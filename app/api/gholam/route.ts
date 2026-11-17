import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";


const COOKIE = "gholam_session";

const PROFILE_COLUMNS =
  "id,full_name,phone,email,company_name,organization_type,job_title,industry,team_size,interest";

type Profile = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  company_name: string | null;
  organization_type: string | null;
  job_title: string | null;
  industry: string | null;
  team_size: string | null;
  interest: string | null;
};

function dbClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

type Db = NonNullable<ReturnType<typeof dbClient>>;

function hashToken(token: string) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

async function currentProfile(
  db: Db,
  request: NextRequest
): Promise<Profile | null> {
  const token = request.cookies.get(COOKIE)?.value;

  if (!token || !/^[a-zA-Z0-9_-]{43}$/.test(token)) {
    return null;
  }

  const { data, error } = await db
    .from("gholam_profiles")
    .select(PROFILE_COLUMNS)
    .eq("session_hash", hashToken(token))
    .maybeSingle();

  if (error) throw error;

  return data as Profile | null;
}

function clean(value: unknown, max = 100) {
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}

function replyTo(question: string, profile: Profile) {
  const firstName =
    profile.full_name.trim().split(/\s+/)[0] || "دوست من";

  const company = profile.company_name
    ? ` برای «${profile.company_name}»`
    : "";

  const text = question.toLowerCase();

  if (/قیمت|هزینه|تعرفه|پکیج|پلن/.test(text)) {
    return `${firstName} جان، دال آپس پکیج‌های پایه، استاندارد، حرفه‌ای و VIP داره. برای انتخاب پکیج${company} باید تعداد کاربران، حجم تماس و امکانات موردنیاز رو بدونیم. مشخصات و قیمت‌های فعلی در بخش «پکیج‌های ما» در صفحه اصلی سایت هست.`;
  }

  if (/voip|ویپ|تلفن|سانترال|مرکز تماس|داخلی/.test(text)) {
    return `${firstName} جان، VoIP کمک می‌کنه تماس‌ها و داخلی‌های سازمانت روی شبکه مدیریت بشن. برای اینکه راهکار مناسب${company} رو پیدا کنیم، بگو چند نفر از تلفن استفاده می‌کنن و آیا به صف تماس یا ضبط مکالمه نیاز دارین؟`;
  }

  if (/شبکه|سرور|devops|دواپس|اتوماسیون|ابری/.test(text)) {
    return `${firstName} جان، دال آپس در حوزه شبکه، سرور، DevOps و اتوماسیون هم فعالیت داره. بگو الان زیرساخت${company} چه وضعیتی داره و مهم‌ترین مشکلت چیه تا مسیر مناسب رو مشخص کنیم.`;
  }

  if (/پشتیبانی|تیکت|تماس|شماره|آدرس|ایمیل/.test(text)) {
    return `${firstName} جان، برای تماس با تیم یا ثبت تیکت، از بخش «پشتیبانی و ارتباط با ما» در صفحه اصلی سایت استفاده کن.`;
  }

  if (/خدمات|دال آپس|چیکار|چه کار/.test(text)) {
    return `${firstName} جان، دال آپس در چهار زمینه اصلی فعالیت می‌کنه: VoIP و تلفن سازمانی، شبکه و سرور، DevOps و اتوماسیون. دوست داری درباره کدوم بیشتر بدونی؟`;
  }

  return `${firstName} جان، سؤالت ثبت شد. 💜 من فعلاً نسخه آزمایشی غلام با پاسخ‌های آماده هستم و هنوز به موتور هوش مصنوعی وصل نشدم. می‌تونی درباره خدمات، VoIP، شبکه یا پکیج‌های دال آپس ازم بپرسی.`;
}

export async function GET(request: NextRequest) {
  const db = dbClient();

  if (!db) {
    return NextResponse.json(
      {
        error: "اتصال پایگاه داده تنظیم نشده است.",
      },
      {
        status: 503,
      }
    );
  }

  try {
    const profile = await currentProfile(db, request);

    if (!profile) {
      return NextResponse.json({
        profile: null,
        messages: [],
      });
    }

    const { data, error } = await db
      .from("gholam_messages")
      .select("id,role,content,created_at")
      .eq("profile_id", profile.id)
      .order("id", { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json({
      profile,
      messages: (data ?? []).reverse(),
    });
  } catch {
    return NextResponse.json(
      {
        error: "خواندن اطلاعات ممکن نشد.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  const db = dbClient();

  if (!db) {
    return NextResponse.json(
      {
        error: "اتصال پایگاه داده تنظیم نشده است.",
      },
      {
        status: 503,
      }
    );
  }

  try {
    const body: unknown = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          error: "درخواست نامعتبر است.",
        },
        {
          status: 400,
        }
      );
    }

    const input = body as Record<string, unknown>;
    const profile = await currentProfile(db, request);

    // ثبت‌نام یا ویرایش اطلاعات مشتری
    if (input.action === "save-profile") {
      const fullName = clean(input.fullName, 80);
      const phone = clean(input.phone, 32);
      const email = clean(input.email, 120).toLowerCase();

      if (
        fullName.length < 2 ||
        phone.replace(/\D/g, "").length < 7
      ) {
        return NextResponse.json(
          {
            error: "نام و شماره تماس معتبر وارد کن.",
          },
          {
            status: 400,
          }
        );
      }

      if (
        email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        return NextResponse.json(
          {
            error: "ایمیل معتبر نیست.",
          },
          {
            status: 400,
          }
        );
      }

      if (!profile && input.consent !== true) {
        return NextResponse.json(
          {
            error: "برای ذخیره اطلاعات باید موافقت کنی.",
          },
          {
            status: 400,
          }
        );
      }

      const fields = {
        full_name: fullName,
        phone,
        email: email || null,
        company_name:
          clean(input.companyName, 120) || null,
        organization_type:
          clean(input.organizationType, 40) || null,
        job_title:
          clean(input.jobTitle, 80) || null,
        industry:
          clean(input.industry, 80) || null,
        team_size:
          clean(input.teamSize, 30) || null,
        interest:
          clean(input.interest, 80) || null,
      };

      // ویرایش پروفایل موجود
      if (profile) {
        const { data, error } = await db
          .from("gholam_profiles")
          .update(fields)
          .eq("id", profile.id)
          .select(PROFILE_COLUMNS)
          .single();

        if (error) throw error;

        return NextResponse.json({
          profile: data,
        });
      }

      // ساخت پروفایل جدید
      const token = randomBytes(32).toString("base64url");

      const { data, error } = await db
        .from("gholam_profiles")
        .insert({
          ...fields,
          session_hash: hashToken(token),
        })
        .select(PROFILE_COLUMNS)
        .single();

      if (error) throw error;

      const response = NextResponse.json({
        profile: data,
      });

      // نگهداری نشست مشتری در همان مرورگر
      response.cookies.set(COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 180,
      });

      return response;
    }

    // ادامه عملیات فقط برای مشتری دارای نشست
    if (!profile) {
      return NextResponse.json(
        {
          error: "اول اطلاعات خودت رو ثبت کن.",
        },
        {
          status: 401,
        }
      );
    }

    // ارسال پیام به غلام
    if (input.action === "send-message") {
      const content = clean(input.content, 2000);

      if (!content) {
        return NextResponse.json(
          {
            error: "پیام خالی است.",
          },
          {
            status: 400,
          }
        );
      }

      const answer = replyTo(content, profile);

      const { data, error } = await db
        .from("gholam_messages")
        .insert([
          {
            profile_id: profile.id,
            role: "user",
            content,
          },
          {
            profile_id: profile.id,
            role: "assistant",
            content: answer,
          },
        ])
        .select("id,role,content,created_at");

      if (error) throw error;

      return NextResponse.json({
        messages: data ?? [],
      });
    }

    // حذف پروفایل مشتری
    if (input.action === "delete-profile") {
      const { error } = await db
        .from("gholam_profiles")
        .delete()
        .eq("id", profile.id);

      if (error) throw error;

      const response = NextResponse.json({
        ok: true,
      });

      response.cookies.delete(COOKIE);

      return response;
    }

    return NextResponse.json(
      {
        error: "عملیات ناشناخته است.",
      },
      {
        status: 400,
      }
    );
  } catch {
    return NextResponse.json(
      {
        error: "خطای سرور؛ دوباره تلاش کن.",
      },
      {
        status: 500,
      }
    );
  }
}