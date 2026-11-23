import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionCustomerId } from "@/lib/session";

export async function GET() {
  try {
    const customerId = await getSessionCustomerId();

    if (!customerId) {
      return NextResponse.json(
        { error: "ابتدا وارد حساب شوید." },
        { status: 401 }
      );
    }

    const result = await db.query(
      `SELECT
         id,
         COALESCE(title, 'گفت‌وگوی جدید') AS title,
         created_at
       FROM conversations
       WHERE customer_id = $1
       ORDER BY updated_at DESC, created_at DESC
       LIMIT 50`,
      [customerId]
    );

    return NextResponse.json(
      { conversations: result.rows },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Load conversations:", error);

    return NextResponse.json(
      { error: "دریافت گفت‌وگوها انجام نشد." },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const customerId = await getSessionCustomerId();

    if (!customerId) {
      return NextResponse.json(
        { error: "ابتدا وارد حساب شوید." },
        { status: 401 }
      );
    }

    const result = await db.query(
      `INSERT INTO conversations (customer_id, title)
       VALUES ($1, $2)
       RETURNING id, title, created_at`,
      [customerId, "گفت‌وگوی جدید"]
    );

    return NextResponse.json(
      { conversation: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create conversation:", error);

    return NextResponse.json(
      { error: "ساخت گفت‌وگو انجام نشد." },
      { status: 500 }
    );
  }
}