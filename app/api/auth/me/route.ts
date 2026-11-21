
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionCustomerId } from "@/lib/session";

export async function GET() {
  try {
    const customerId = await getSessionCustomerId();

    if (!customerId) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    const result = await db.query(
      `SELECT id, customer_code, username, full_name,
              phone, email, company_name,
              organization_type, job_title, industry,
              team_size, interest
       FROM customers
       WHERE id = $1 AND password_hash IS NOT NULL
       LIMIT 1`,
      [customerId]
    );

    const customer = result.rows[0];

    if (!customer) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { authenticated: true, customer },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error("Auth me error:", error);

    return NextResponse.json(
      { error: "خطا در دریافت اطلاعات حساب." },
      { status: 500 }
    );
  }
}
