
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const username =
      typeof body?.username === "string"
        ? body.username.trim().toLowerCase()
        : "";

    const password = body?.password;

    if (
      !/^[a-z0-9_]{3,40}$/.test(username) ||
      typeof password !== "string" ||
      password.length === 0 ||
      password.length > 128
    ) {
      return NextResponse.json(
        { error: "نام کاربری یا رمز عبور صحیح نیست." },
        { status: 401 }
      );
    }

    const result = await db.query(
      `SELECT id, username, full_name, customer_code, password_hash
       FROM customers
       WHERE LOWER(username) = $1
       LIMIT 1`,
      [username]
    );

    const customer = result.rows[0];

    if (
      !customer ||
      !customer.password_hash ||
      !(await verifyPassword(password, customer.password_hash))
    ) {
      return NextResponse.json(
        { error: "نام کاربری یا رمز عبور صحیح نیست." },
        { status: 401 }
      );
    }

    await createSession(customer.id);

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        username: customer.username,
        fullName: customer.full_name,
        customerCode: customer.customer_code,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "خطا در ورود. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
