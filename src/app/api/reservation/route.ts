import { Reservation } from "@/features/reservation";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const reservations = await Reservation.find();
    if (!reservations) {
      return NextResponse.json({ error: "Reservations" }, { status: 404 });
    }
    return NextResponse.json(reservations);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const user = await Reservation.create(body);
    return NextResponse.json(user, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
