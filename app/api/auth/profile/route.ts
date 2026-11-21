import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionCustomerId } from "@/lib/session";

const fields = ["phone", "email", "companyName", "organizationType", "jobTitle", "industry", "teamSize", "interest"] as const;

export async function PATCH(request: NextRequest) {
  try {
    const customerId = await getSessionCustomerId();
    if (!customerId) return NextResponse.json({ error: "ابتدا وارد حساب کاربری شوید." }, { status: 401 });

    const body = await request.json();
    const values: Record<string, string> = {};
    for (const field of fields) {
      if (body?.[field] !== undefined && typeof body[field] !== "string")
        return NextResponse.json({ error: "اطلاعات نامعتبر است." }, { status: 400 });
      values[field] = (body?.[field] ?? "").trim();
      if (values[field].length > 120)
        return NextResponse.json({ error: "طول اطلاعات بیش از حد مجاز است." }, { status: 400 });
    }
    if (!/^[+\d\s()-]{7,20}$/.test(values.phone))
      return NextResponse.json({ error: "شماره تماس معتبر نیست." }, { status: 400 });

    const result = await db.query(
      `UPDATE customers SET phone = $1, email = $2, company_name = $3,
        organization_type = $4, job_title = $5, industry = $6,
        team_size = $7, interest = $8
       WHERE id = $9 AND password_hash IS NOT NULL
       RETURNING id, full_name, username`,
      [values.phone, values.email || null, values.companyName || null,
       values.organizationType || null, values.jobTitle || null,
       values.industry || null, values.teamSize || null,
       values.interest || null, customerId]
    );
    if (!result.rowCount) return NextResponse.json({ error: "حساب کاربری پیدا نشد." }, { status: 404 });
    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "خطا در ذخیره اطلاعات." }, { status: 500 });
  }
}
