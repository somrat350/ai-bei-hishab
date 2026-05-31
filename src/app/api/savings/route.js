import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "../../../../lib/mongodb";
import Savings from "../../../../models/Savings";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const savings = await Savings.find({ userId: session.user.id }).sort({ date: -1 });
    return NextResponse.json(savings, { status: 200 });
  } catch (error) {
    console.error("GET Savings error:", error);
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
    const { amount, date } = body;

    if (!amount) {
      return NextResponse.json({ message: "Amount is required" }, { status: 400 });
    }

    const savingsDate = date ? new Date(date) : new Date();
    const dayOfWeek = savingsDate.getDay(); // 0 is Sunday, 5 is Friday

    if (dayOfWeek !== 5 && amount < 200) {
      return NextResponse.json(
        { message: "Amount must be at least 200 BDT on non-Fridays" },
        { status: 400 }
      );
    }

    await dbConnect();
    const newSavings = await Savings.create({
      userId: session.user.id,
      amount,
      date: savingsDate,
    });

    return NextResponse.json(newSavings, { status: 201 });
  } catch (error) {
    console.error("POST Savings error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
