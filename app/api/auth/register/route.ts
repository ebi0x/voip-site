
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const fullName =
      typeof body?.fullName === "string"
        ? body.fullName.trim()
        : "";

    const username =
      typeof body?.username === "string"
        ? body.username.trim().toLowerCase()
        : "";

    const password = body?.password;

    if (fullName.length < 2 || fullName.length > 120) {
      return NextResponse.json(
        { error: "نام و نام خانوادگی باید بین ۲ تا ۱۲۰ کاراکتر باشد." },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9_]{3,40}$/.test(username)) {
      return NextResponse.json(
        {
          error:
            "نام کاربری باید بین ۳ تا ۴۰ کاراکتر و شامل حروف انگلیسی، عدد یا _ باشد.",
        },
        { status: 400 }
      );
    }

    if (
      typeof password !== "string" ||
      password.length < 10 ||
      password.length > 128
    ) {
      return NextResponse.json(
        { error: "رمز عبور باید بین ۱۰ تا ۱۲۸ کاراکتر باشد." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const result = await db.query(
      `INSERT INTO customers (
        full_name,
        username,
        password_hash
      )
      VALUES ($1, $2, $3)
      RETURNING id, customer_code, full_name, username`,
      [fullName, username, passwordHash]
    );

    const customer = result.rows[0];

    await createSession(customer.id);

    return NextResponse.json(
      {
        success: true,
        customer: {
          id: customer.id,
          customerCode: customer.customer_code,
          fullName: customer.full_name,
          username: customer.username,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
    ) {
      return NextResponse.json(
        { error: "این نام کاربری قبلاً ثبت شده است." },
        { status: 409 }
      );
    }

    console.error("Registration error:", error);

    return NextResponse.json(
      { error: "ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
