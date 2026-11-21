import { NextResponse } from "next/server";
import { db } from "@/lib/db";


export async function GET() {
  try {
    const result = await db.query(
      "SELECT current_database() AS database, current_user AS username, (SELECT COUNT(*)::int FROM customers) AS customers"
    );

    return NextResponse.json({
      success: true,
      ...result.rows[0],
    });
  } catch (error) {
    console.error("Database test failed:", error);

    return NextResponse.json(
      { success: false, message: "Database connection failed" },
      { status: 500 }
    );
  }
}
