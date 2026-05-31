import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "../../../../lib/mongodb";
import Income from "../../../../models/Income";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const incomes = await Income.find({ userId: session.user.id }).sort({ date: -1 });
    return NextResponse.json(incomes, { status: 200 });
  } catch (error) {
    console.error("GET Income error:", error);
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
    const { amount, source, date } = body;

    if (!amount || !source) {
      return NextResponse.json({ message: "Amount and source are required" }, { status: 400 });
    }

    await dbConnect();
    const newIncome = await Income.create({
      userId: session.user.id,
      amount,
      source,
      date: date ? new Date(date) : Date.now(),
    });

    return NextResponse.json(newIncome, { status: 201 });
  } catch (error) {
    console.error("POST Income error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
