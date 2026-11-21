import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Please use /api/auth/register" },
    { status: 410 }
  );
}