
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionCustomerId } from "@/lib/session";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export async function GET(request: NextRequest) {
  try {
    const customerId = await getSessionCustomerId();

    if (!customerId) {
      return NextResponse.json(
        { error: "ابتدا وارد حساب شوید." },
        { status: 401 }
      );
    }

    const conversationId =
      request.nextUrl.searchParams.get("conversationId") ?? "";

    if (!uuidPattern.test(conversationId)) {
      return badRequest("شناسه گفت‌وگو نامعتبر است.");
    }

    const owner = await db.query(
      `SELECT id
       FROM conversations
       WHERE id = $1 AND customer_id = $2`,
      [conversationId, customerId]
    );

    if (!owner.rowCount) {
      return NextResponse.json(
        { error: "گفت‌وگو پیدا نشد." },
        { status: 404 }
      );
    }

    const result = await db.query(
      `SELECT id, sender, content, created_at
       FROM messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC, id ASC
       LIMIT 500`,
      [conversationId]
    );

    return NextResponse.json(
      { messages: result.rows },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Load messages:", error);

    return NextResponse.json(
      { error: "دریافت پیام‌ها انجام نشد." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const customerId = await getSessionCustomerId();

  if (!customerId) {
    return NextResponse.json(
      { error: "ابتدا وارد حساب شوید." },
      { status: 401 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return badRequest("فرمت درخواست نامعتبر است.");
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return badRequest("داده ارسالی نامعتبر است.");
  }

  const input = body as Record<string, unknown>;

  const conversationId = input.conversationId;
  const userContent = input.userContent;
  const assistantContent = input.assistantContent;

  if (
    typeof conversationId !== "string" ||
    !uuidPattern.test(conversationId)
  ) {
    return badRequest("شناسه گفت‌وگو نامعتبر است.");
  }

  if (
    typeof userContent !== "string" ||
    !userContent.trim()
  ) {
    return badRequest("متن پیام کاربر خالی یا نامعتبر است.");
  }

  if (userContent.length > 2000) {
    return badRequest("پیام کاربر بیشتر از ۲۰۰۰ کاراکتر است.");
  }

  if (
    typeof assistantContent !== "string" ||
    !assistantContent.trim()
  ) {
    return badRequest("پاسخ غلام خالی یا نامعتبر است.");
  }

  if (assistantContent.length > 12000) {
    return badRequest("پاسخ غلام بیشتر از ۱۲۰۰۰ کاراکتر است.");
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const owner = await client.query(
      `SELECT id
       FROM conversations
       WHERE id = $1 AND customer_id = $2
       FOR UPDATE`,
      [conversationId, customerId]
    );

    if (!owner.rowCount) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        { error: "گفت‌وگو پیدا نشد." },
        { status: 404 }
      );
    }

    await client.query(
      `INSERT INTO messages (conversation_id, sender, content)
       VALUES
         ($1, 'user', $2),
         ($1, 'assistant', $3)`,
      [
        conversationId,
        userContent.trim(),
        assistantContent.trim(),
      ]
    );

    await client.query(
      `UPDATE conversations
       SET
         updated_at = now(),
         title = CASE
           WHEN title IS NULL OR title = 'گفت‌وگوی جدید'
           THEN LEFT($2, 70)
           ELSE title
         END
       WHERE id = $1`,
      [conversationId, userContent.trim()]
    );

    await client.query("COMMIT");

    return NextResponse.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Save messages:", error);

    return NextResponse.json(
      { error: "ذخیره پیام‌ها انجام نشد." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
