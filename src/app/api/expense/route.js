import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "../../../../lib/mongodb";
import Expense from "../../../../models/Expense";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const expenses = await Expense.find({ userId: session.user.id }).sort({ date: -1 });
    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error("GET Expense error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, destination, date } = body;

    if (!amount || !destination) {
      return NextResponse.json({ message: "Amount and destination are required" }, { status: 400 });
    }

    await dbConnect();
    const newExpense = await Expense.create({
      userId: session.user.id,
      amount,
      destination,
      date: date ? new Date(date) : Date.now(),
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("POST Expense error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
