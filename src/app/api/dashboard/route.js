import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "../../../../lib/mongodb";
import Income from "../../../../models/Income";
import Expense from "../../../../models/Expense";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const dateParam = searchParams.get("date"); // e.g., YYYY-MM-DD, YYYY-MM, or YYYY

    await dbConnect();
    const userId = session.user.id;

    const incomeQuery = { userId };
    const expenseQuery = { userId };

    if (search) {
      const searchRegex = new RegExp(search, "i");
      incomeQuery.source = searchRegex;
      expenseQuery.destination = searchRegex;
    }

    if (dateParam) {
      const parts = dateParam.split("-");
      if (parts.length === 3) {
        // YYYY-MM-DD (Specific Day)
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
        const day = parseInt(parts[2], 10);

        const startOfDay = new Date(year, month, day);
        const endOfDay = new Date(year, month, day, 23, 59, 59, 999);
        const dateFilter = { $gte: startOfDay, $lte: endOfDay };

        incomeQuery.date = dateFilter;
        expenseQuery.date = dateFilter;
      } else if (parts.length === 2) {
        // YYYY-MM (Specific Month)
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;

        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);
        const dateFilter = { $gte: startOfMonth, $lte: endOfMonth };

        incomeQuery.date = dateFilter;
        expenseQuery.date = dateFilter;
      } else if (parts.length === 1) {
        // YYYY (Specific Year)
        const year = parseInt(parts[0], 10);

        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);
        const dateFilter = { $gte: startOfYear, $lte: endOfYear };

        incomeQuery.date = dateFilter;
        expenseQuery.date = dateFilter;
      }
    }

    // Fetch records concurrently
    const [incomes, expenses, savings] = await Promise.all([
      Income.find(incomeQuery).sort({ date: -1 }),
      Expense.find(expenseQuery).sort({ date: -1 }),
    ]);

    // Savings don't have source/destination, so exclude them if a search is performed
    const filteredSavings = search ? [] : savings;

    // Calculate totals
    const totalIncome = incomes.reduce((sum, record) => sum + record.amount, 0);
    const totalExpense = expenses.reduce(
      (sum, record) => sum + record.amount,
      0,
    );

    return NextResponse.json(
      {
        totals: {
          totalIncome,
          totalExpense,
        },
        records: {
          incomes,
          expenses,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET Dashboard error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
