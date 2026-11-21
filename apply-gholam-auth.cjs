const fs = require("fs");

const file = "app/consult/page.tsx";
let code = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
const original = code;

function replace(oldText, newText) {
  const count = code.split(oldText).length - 1;
  if (count !== 1) {
    throw new Error(`Expected one match, found ${count}: ${oldText.slice(0, 65)}`);
  }
  code = code.replace(oldText, newText);
}

replace(
  "const topics = [",
  `function profileFromCustomer(c: Record<string, string | null>): Profile {
  return {
    fullName: c.full_name ?? "",
    phone: c.phone ?? "",
    email: c.email ?? "",
    companyName: c.company_name ?? "",
    organizationType: c.organization_type ?? "",
    jobTitle: c.job_title ?? "",
    industry: c.industry ?? "",
    teamSize: c.team_size ?? "",
    interest: c.interest ?? "",
  };
}

const topics = [`
);

replace(
  '  const [editing, setEditing] = useState(false);',
  `  const [editing, setEditing] = useState(false);
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);`
);

replace(
  "  function change<K extends keyof Profile>(",
  `  useEffect(() => {
    let active = true;

    async function restore() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!active || !data.authenticated) return;

        const restored = profileFromCustomer(data.customer);
        setProfile(restored);
        setForm(restored);
        setMessages([welcomeMessage(restored)]);
      } catch {
        // Login form remains available.
      } finally {
        if (active) setAuthLoading(false);
      }
    }

    void restore();
    return () => { active = false; };
  }, []);

  async function logout() {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error();

      setProfile(null);
      setForm(emptyProfile);
      setMessages([]);
      setPassword("");
      setEditing(false);
      setAuthMode("login");
      setMobileMenuOpen(false);
      setError("");
    } catch {
      setError("خروج انجام نشد؛ دوباره تلاش کن.");
    }
  }

  function change<K extends keyof Profile>(`
);

const start = code.indexOf("  async function submitProfile(");
const end = code.indexOf("  function sendMessage(", start);

if (start < 0 || end <= start) {
  throw new Error("Cannot locate submitProfile");
}

const submit = `  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (authBusy) return;

    setError("");

    const saved = {
      ...form,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
    };

    if ((editing || authMode === "register") && saved.fullName.length < 2) {
      setError("نام و نام خانوادگی را درست وارد کن.");
      return;
    }

    if (!/^[+\\\\d\\\\s()-]{7,20}$/.test(saved.phone)) {
      setError("شماره تماس معتبر وارد کن.");
      return;
    }

    if (!editing && (password.length < 10 || password.length > 128)) {
      setError("رمز عبور باید بین ۱۰ تا ۱۲۸ کاراکتر باشد.");
      return;
    }

    if (!editing && authMode === "register" && !consent) {
      setError("برای ثبت‌نام، موافقت با ذخیره اطلاعات ضروری است.");
      return;
    }

    setAuthBusy(true);

    try {
      const endpoint = editing
        ? "/api/auth/profile"
        : authMode === "login"
          ? "/api/auth/login"
          : "/api/auth/register";

      const payload = editing
        ? saved
        : authMode === "login"
          ? { phone: saved.phone, password }
          : { ...saved, password };

      const response = await fetch(endpoint, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("این شماره قبلاً ثبت شده؛ از بخش ورود استفاده کن.");
        }
        if (response.status === 401) {
          throw new Error("شماره تماس یا رمز عبور اشتباه است.");
        }
        throw new Error(result.error || "درخواست انجام نشد.");
      }

      const me = await fetch("/api/auth/me", { cache: "no-store" });
      if (!me.ok) throw new Error("دریافت اطلاعات حساب انجام نشد.");

      const session = await me.json();
      if (!session.authenticated || !session.customer) {
        throw new Error("نشست حساب معتبر نیست.");
      }

      const verified = profileFromCustomer(session.customer);
      setProfile(verified);
      setForm(verified);
      setPassword("");
      setEditing(false);
      setMobileMenuOpen(false);

      if (messages.length === 0) {
        setMessages([welcomeMessage(verified)]);
      }

      stickToBottom.current = true;
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "خطایی رخ داد؛ دوباره تلاش کن."
      );
    } finally {
      setAuthBusy(false);
    }
  }

`;

code = code.slice(0, start) + submit + code.slice(end);

replace(
  "  const showForm = !profile || editing;",
  `  const showForm = !profile || editing;

  if (authLoading) {
    return (
      <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#0b0a1d] text-white">
        در حال بررسی حساب کاربری...
      </main>
    );
  }`
);

replace(
  "✦ بدون رمز عبور و کد تأیید",
  "✦ ورود با شماره تماس و رمز عبور"
);

code = code.replace(
  /حالت تست: اطلاعات فرم فقط در حافظه همین صفحه\s+نگه داشته می‌شن و به سرور ارسال نمی‌شن\./,
  "اطلاعات حساب در پایگاه داده ذخیره می‌شود و رمز عبور به‌صورت هش نگهداری می‌شود."
);

replace(
  ': "اول خودتو معرفی کن"}',
  ': authMode === "login" ? "ورود به حساب" : "اول خودتو معرفی کن"}'
);

replace(
  '<div className="grid gap-5 sm:grid-cols-2">',
  `{!editing && (
              <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-white/5 p-1">
                {(["register", "login"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => { setAuthMode(mode); setError(""); }}
                    className={\`rounded-lg p-3 text-sm transition \${
                      authMode === mode
                        ? "bg-violet-600 text-white"
                        : "text-white/60 hover:bg-white/5"
                    }\`}
                  >
                    {mode === "register" ? "ثبت‌نام" : "ورود"}
                  </button>
                ))}
              </div>
            )}

            {!editing && authMode === "login" && (
              <div className="mb-5">
                <InputField
                  label="شماره تماس"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(v) => change("phone", v)}
                  placeholder="مثلاً 09123456789"
                />
              </div>
            )}

            {(editing || authMode === "register") && (
              <>
                <div className="grid gap-5 sm:grid-cols-2">`
);

const interest = code.indexOf('label="بیشتر برای چه موضوعی اومدی؟"');
const consentStart = code.indexOf("{!profile && (", interest);

if (interest < 0 || consentStart < 0) {
  throw new Error("Cannot locate interest and consent fields");
}

code =
  code.slice(0, consentStart) +
  `</>
            )}

            {!editing && (
              <div className="mt-5">
                <label className="mb-2 block text-xs text-white/70">
                  رمز عبور
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={10}
                  maxLength={128}
                  required
                  autoComplete={authMode === "login" ? "current-password" : "new-password"}
                  placeholder="حداقل ۱۰ کاراکتر"
                  className="min-h-12 w-full rounded-xl border border-white/15 bg-[#181530] px-4 text-base text-white outline-none focus:border-violet-400"
                />
              </div>
            )}

            {!profile && authMode === "register" && (` +
  code.slice(consentStart + "{!profile && (".length);

code = code.replace(
  /موافقم اطلاعات فرم به‌صورت موقت در همین\s+صفحه برای شخصی‌سازی گفت‌وگوی آزمایشی\s+استفاده بشه\./,
  "موافقم اطلاعات حساب من برای ارائه خدمات و شخصی‌سازی گفتگو در سرور ذخیره شود."
);

replace(
  `                {editing
                  ? "ذخیره تغییرات و بازگشت به چت"
                  : "ثبت اطلاعات و شروع گفت‌وگو ←"}`,
  `                {authBusy
                  ? "در حال انجام..."
                  : editing
                    ? "ذخیره تغییرات و بازگشت به چت"
                    : authMode === "login"
                      ? "ورود به غلام"
                      : "ثبت‌نام و شروع گفت‌وگو"}`
);

replace(
  '                type="submit"',
  '                type="submit"\n                disabled={authBusy}'
);

code = code.replace(
  /فقط نام و شماره تماس ضروریه؛ بقیه اطلاعات\s+اختیاریه\./,
  '{editing ? "شماره تماس در این بخش قابل تغییر نیست." : authMode === "login" ? "شماره تماس و رمز عبورت را وارد کن." : "نام، شماره تماس و رمز عبور ضروری‌اند؛ بقیه اطلاعات اختیاری است."}'
);

const phoneField = code.indexOf('label="شماره تماس"', code.indexOf('{(editing || authMode === "register")'));
if (phoneField < 0) throw new Error("Cannot locate registration phone field");
const phoneSection = code.slice(phoneField, phoneField + 350);
const phoneUpdated = phoneSection.replace(
  'type="tel"',
  'type="tel"\n                disabled={editing}'
);
if (phoneSection === phoneUpdated) throw new Error("Cannot disable phone editing");
code = code.slice(0, phoneField) + phoneUpdated + code.slice(phoneField + 350);

replace(
  '  type = "text",',
  '  type = "text",\n  disabled = false,'
);

replace(
  '  type?: string;',
  '  type?: string;\n  disabled?: boolean;'
);

replace(
  '        required={required}',
  '        required={required}\n        disabled={disabled}'
);

replace(
  '                ویرایش اطلاعات\n              </button>',
  `                ویرایش اطلاعات
              </button>
              <button type="button" onClick={logout}
                className="mt-4 mr-5 text-xs text-rose-300 hover:text-rose-200">
                خروج از حساب
              </button>`
);

replace(
  '                  ویرایش پروفایل\n                </button>',
  `                  ویرایش پروفایل
                </button>
                <button type="button" onClick={logout}
                  className="w-full rounded-xl border border-rose-400/20 p-3 text-right text-sm text-rose-300">
                  خروج از حساب
                </button>`
);

if (code === original) throw new Error("No changes generated");

fs.copyFileSync(file, file + ".before-login.bak");
fs.writeFileSync(file, code, "utf8");

console.log("Consult page updated.");