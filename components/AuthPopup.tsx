
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

type AuthMode = "register" | "login";

type Notice = {
  title: string;
  message: string;
};

const DURATION = 260;

const inputClass =
  "h-12 w-full rounded-xl border border-white/[0.09] " +
  "bg-white/[0.045] px-4 text-[15px] text-white " +
  "outline-none transition-all duration-200 " +
  "placeholder:text-white/25 " +
  "hover:border-white/20 " +
  "focus:border-violet-400/70 " +
  "focus:bg-white/[0.07] " +
  "focus:ring-4 focus:ring-violet-500/10";

export default function AuthPopup() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const [mode, setMode] = useState<AuthMode>("login");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const busyRef = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const frameRef = useRef<number | null>(null);

  const closeDialog = useCallback(() => {
    if (busyRef.current) return;

    setVisible(false);

    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }

    closeTimer.current = setTimeout(() => {
      setMounted(false);
      setNotice(null);
      triggerRef.current?.focus();
    }, DURATION);
  }, []);

  useEffect(() => {
    function handleOpen(event: Event) {
      const detail = (
        event as CustomEvent<{ mode?: AuthMode }>
      ).detail;

      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      triggerRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

      setMode(
        detail?.mode === "register" ? "register" : "login"
      );

      setFullName("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setError("");
      setNotice(null);

      setMounted(true);
      setVisible(false);

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    }

    window.addEventListener("daal-open-auth", handleOpen);

    return () => {
      window.removeEventListener("daal-open-auth", handleOpen);

      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDialog();
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const elements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled)'
        )
      );

      if (!elements.length) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [mounted, closeDialog]);

  function changeMode(nextMode: AuthMode) {
    if (busy) return;

    setMode(nextMode);
    setError("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (busyRef.current) return;

    if (
      mode === "register" &&
      password !== confirmPassword
    ) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }

    busyRef.current = true;
    setBusy(true);
    setError("");

    try {
      const response = await fetch(
        mode === "register"
          ? "/api/auth/register"
          : "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify(
            mode === "register"
              ? {
                  fullName: fullName.trim(),
                  username: username.trim().toLowerCase(),
                  password,
                }
              : {
                  username: username.trim().toLowerCase(),
                  password,
                }
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "درخواست انجام نشد."
        );
      }

      setPassword("");
      setConfirmPassword("");

      window.dispatchEvent(
        new Event("daal-auth-changed")
      );

      setNotice({
        title:
          mode === "register"
            ? "حساب شما ساخته شد"
            : "خوش برگشتی!",
        message:
          mode === "register"
            ? "حساب اختصاصی دال آپس با موفقیت ایجاد شد. از این به بعد درخواست‌ها و مشاوره‌ها به حساب شما متصل می‌شن."
            : "با موفقیت وارد حساب کاربری خودت شدی.",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "خطایی رخ داد. دوباره تلاش کنید."
      );
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  if (!mounted) return null;

  return (
    <div
      dir="rtl"
      className={[
        "fixed inset-0 z-[9999]",
        "flex items-center justify-center",
        "overflow-hidden p-3 sm:p-5",
        "bg-[#050412]/80 backdrop-blur-lg",
        "transition-opacity duration-[260ms]",
        visible ? "opacity-100" : "opacity-0",
      ].join(" ")}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeDialog();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="daal-auth-title"
        tabIndex={-1}
        className={[
          "relative flex w-full max-w-[420px]",
          "max-h-[calc(100dvh-24px)]",
          "flex-col overflow-hidden",
          "rounded-[28px]",
          "border border-white/[0.12]",
          "bg-[#171329]",
          "text-white outline-none",
          "shadow-[0_32px_100px_rgba(0,0,0,0.55)]",
          "transition-[opacity,transform]",
          "duration-[260ms] ease-out",
          "motion-reduce:transition-none",
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-[0.97] opacity-0",
        ].join(" ")}
      >
        {/* Decorative top line */}
        <div
          aria-hidden="true"
          className="h-[2px] shrink-0 bg-gradient-to-l from-cyan-400/80 via-violet-500/70 to-transparent"
        />

        {/* Fixed header */}
        <div className="shrink-0 px-6 pt-5 sm:px-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07]">
                <BrandIcon />
              </div>

              <span className="text-xs font-black tracking-[0.14em] text-cyan-300">
                DAAL OPS
              </span>
            </div>

            <button
              type="button"
              disabled={busy}
              onClick={closeDialog}
              aria-label="بستن پنجره"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/50 transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:opacity-40"
            >
              <XIcon />
            </button>
          </div>
        </div>

        {/* Scrollable content - scrollbar hidden */}
        <div
          className={[
            "min-h-0 flex-1 overflow-y-auto",
            "overscroll-contain",
            "px-6 pb-6 pt-5 sm:px-7 sm:pb-7",
            "[scrollbar-width:none]",
            "[-ms-overflow-style:none]",
            "[&::-webkit-scrollbar]:hidden",
          ].join(" ")}
        >
          {notice ? (
            <div
              className="py-6 text-center"
              role="status"
              aria-live="polite"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <CheckIcon />
              </div>

              <h2
                id="daal-auth-title"
                className="text-xl font-extrabold"
              >
                {notice.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/55">
                {notice.message}
              </p>

              <button
                type="button"
                onClick={closeDialog}
                className="mt-7 flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-l from-violet-600 to-blue-600 font-bold text-white transition hover:brightness-110 active:scale-[0.99]"
              >
                ادامه به سایت
                <ArrowIcon />
              </button>
            </div>
          ) : (
            <>
              <div>
                <h2
                  id="daal-auth-title"
                  className="text-[23px] font-extrabold leading-tight tracking-tight"
                >
                  {mode === "register"
                    ? "حساب کاربری بساز"
                    : "خوش برگشتی"}
                </h2>

                <p className="mt-2 text-[13px] leading-6 text-white/50">
                  {mode === "register"
                    ? "برای مدیریت مشاوره‌ها و خدماتت، یک حساب اختصاصی ایجاد کن."
                    : "برای ادامه همکاری وارد حساب دال آپس شو."}
                </p>
              </div>

              {/* Mode switch */}
              <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl border border-white/[0.06] bg-white/[0.045] p-1">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => changeMode("login")}
                  className={`h-10 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    mode === "login"
                      ? "bg-violet-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.25)]"
                      : "text-white/45 hover:text-white"
                  }`}
                >
                  ورود
                </button>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => changeMode("register")}
                  className={`h-10 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    mode === "register"
                      ? "bg-violet-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.25)]"
                      : "text-white/45 hover:text-white"
                  }`}
                >
                  ثبت‌نام
                </button>
              </div>

              <form
                onSubmit={submit}
                className="mt-5 space-y-3.5"
              >
                {mode === "register" && (
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-white/65">
                      نام و نام خانوادگی
                    </span>

                    <input
                      required
                      minLength={2}
                      maxLength={120}
                      autoComplete="name"
                      value={fullName}
                      onChange={(event) =>
                        setFullName(event.target.value)
                      }
                      placeholder="نام کامل شما"
                      className={inputClass}
                    />
                  </label>
                )}

                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-white/65">
                    نام کاربری
                  </span>

                  <input name="username"
                    required
                    minLength={3}
                    maxLength={40}
                    pattern="[a-zA-Z0-9_]+"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    dir="ltr"
                    value={username}
                    onChange={(event) =>
                      setUsername(event.target.value)
                    }
                    placeholder="username"
                    className={inputClass}
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-white/65">
                    رمز عبور
                  </span>

                  <div className="relative">
                    <input
                      required
                      type={
                        showPassword ? "text" : "password"
                      }
                      minLength={
                        mode === "register"
                          ? 10
                          : undefined
                      }
                      maxLength={128}
                      autoComplete={
                        mode === "register"
                          ? "new-password"
                          : "current-password"
                      }
                      dir="ltr"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder={
                        mode === "register"
                          ? "حداقل ۱۰ کاراکتر"
                          : "رمز عبور"
                      }
                      className={`${inputClass} pl-16`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      aria-label={
                        showPassword
                          ? "مخفی کردن رمز عبور"
                          : "نمایش رمز عبور"
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1.5 text-xs text-white/45 transition hover:bg-white/10 hover:text-white"
                    >
                      {showPassword ? "مخفی" : "نمایش"}
                    </button>
                  </div>
                </label>

                {mode === "register" && (
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-white/65">
                      تکرار رمز عبور
                    </span>

                    <input
                      required
                      type={
                        showPassword ? "text" : "password"
                      }
                      minLength={10}
                      maxLength={128}
                      autoComplete="new-password"
                      dir="ltr"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="رمز عبور را دوباره وارد کن"
                      className={inputClass}
                    />
                  </label>
                )}

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2.5 text-xs leading-6 text-rose-300"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-violet-600 via-violet-600 to-blue-600 px-5 text-sm font-bold text-white shadow-[0_8px_25px_rgba(109,40,217,0.2)] transition-all duration-200 hover:brightness-110 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
                >
                  {busy ? (
                    <>
                      <LoadingIcon />
                      در حال بررسی...
                    </>
                  ) : (
                    <>
                      {mode === "register"
                        ? "ساخت حساب کاربری"
                        : "ورود به حساب"}
                      <ArrowIcon />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-5 text-center text-[11px] leading-6 text-white/35">
                اطلاعات تکمیلی هنگام استفاده از مشاور غلام
                دریافت می‌شه.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function BrandIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-cyan-300"
      aria-hidden="true"
    >
      <path d="M4 17V7l8-4 8 4v10l-8 4-8-4Z" />
      <path d="m4 7 8 5 8-5M12 12v9" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-1"
      aria-hidden="true"
    >
      <path d="M19 12H5m7-7-7 7 7 7" />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="animate-spin"
      aria-hidden="true"
    >
      <path d="M12 3a9 9 0 1 1-9 9" />
    </svg>
  );
}
