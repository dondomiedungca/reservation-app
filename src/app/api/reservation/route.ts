import { Reservation } from "@/features/reservation";
import connectDB from "@/lib/mongodb";
import { toDate } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const dateFilter = request.nextUrl.searchParams.get("dateFilter");
    const now = new Date();
    const month = toDate(dateFilter || now).getMonth() + 1;
    const year = toDate(dateFilter || now).getFullYear();

    const reservations = dateFilter
      ? await Reservation.find({
          $expr: {
            $and: [
              { $eq: [{ $month: "$date" }, month] },
              { $eq: [{ $year: "$date" }, year] },
            ],
          },
        })
      : [];
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
