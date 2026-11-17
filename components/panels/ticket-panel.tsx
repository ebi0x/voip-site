"use client";

import { useState, type FormEvent } from "react";
import { CloseIcon, DocIcon } from "@/components/icons";
import {
  sendTicket,
  supportBackend,
  type TicketValues,
} from "@/lib/support-api";
import type { OpenOptions } from "./panel-context";

type Props = {
  onClose: () => void;
  initial: OpenOptions;
};

type Errors = Partial<Record<"name" | "contact" | "message", string>>;
type Status = "idle" | "sending" | "sent" | "failed";

const topics = [
  {
    id: "tech",
    icon: "⌘",
    title: "پشتیبانی فنی",
    description: "مشکلات و اختلالات",
  },
  {
    id: "purchase",
    icon: "◈",
    title: "پکیج‌ها و خرید",
    description: "سؤالات پیش از خرید",
  },
  {
    id: "consult",
    icon: "✦",
    title: "درخواست مشاوره",
    description: "راهنمایی تخصصی",
  },
  {
    id: "other",
    icon: "◎",
    title: "سایر درخواست‌ها",
    description: "موضوعات دیگر",
  },
] as const;

const fieldClass =
  "w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 text-sm text-[var(--text)] outline-none transition-all duration-200 placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface-strong)]";

function validate(values: TicketValues): Errors {
  const errors: Errors = {};

  if (values.name.trim().length < 2) {
    errors.name = "لطفاً نام و نام خانوادگی رو وارد کن.";
  }

  const contact = values.contact.trim();

  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);

  const normalizedPhone = contact
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    )
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    );

  const phoneValid =
    /^[+]?[0-9\s()-]+$/.test(normalizedPhone) &&
    normalizedPhone.replace(/\D/g, "").length >= 7;

  if (!emailValid && !phoneValid) {
    errors.contact = "شماره تماس یا ایمیل معتبر وارد کن.";
  }

  if (values.message.trim().length < 10) {
    errors.message =
      "لطفاً درخواستت رو کمی کامل‌تر توضیح بده.";
  }

  return errors;
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
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
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

export function TicketPanel({
  onClose,
  initial,
}: Props) {
  const isConsult = initial.topic === "consult";

  const [values, setValues] = useState<TicketValues>({
    name: "",
    contact: "",
    topic: initial.topic ?? "tech",
    message: initial.message ?? "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const connected = supportBackend.connected;

  function update<K extends keyof TicketValues>(
    key: K,
    value: TicketValues[K]
  ) {
    setValues((previous) => ({
      ...previous,
      [key]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [key]: undefined,
    }));

    if (status === "failed") {
      setStatus("idle");
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (status === "sending") return;

    const found = validate(values);
    setErrors(found);

    const firstInvalid = (
      ["name", "contact", "message"] as const
    ).find((key) => found[key]);

    if (firstInvalid) {
      document
        .getElementById(`ticket-${firstInvalid}`)
        ?.focus();
      return;
    }

    setStatus("sending");

    try {
      const result = await sendTicket({
        ...values,
        name: values.name.trim(),
        contact: values.contact.trim(),
        message: values.message.trim(),
      });

      setStatus(result.ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div
      dir="rtl"
      className="
        panel-card relative isolate
        flex h-[min(90dvh,780px)]
        min-h-0 w-full max-w-[680px]
        flex-col overflow-hidden
        rounded-[28px]
        border border-[var(--border)]
        bg-[var(--bg-0)]
        text-[var(--text)]
        shadow-[0_35px_100px_-25px_var(--shadow)]
      "
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-32 -top-36 h-[330px] w-[330px] rounded-full bg-[var(--accent)] opacity-10 blur-[100px]" />

        <div className="absolute -bottom-32 -left-32 h-[300px] w-[300px] rounded-full bg-[var(--accent-2)] opacity-[0.07] blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 shrink-0 border-b border-[var(--border)] bg-[var(--surface)] px-5 py-5 backdrop-blur-xl sm:px-7">
        <div className="flex items-center gap-4">
          <div className="relative flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-[var(--cta-a)] to-[var(--accent-2)] text-white shadow-[0_12px_30px_-12px_var(--accent)]">
            <DocIcon className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="text-[10px] font-semibold tracking-wider text-[var(--accent-2)]">
                DAAL OPS
              </span>

              <span className="h-1 w-1 rounded-full bg-[var(--text-muted)]" />

              <span className="text-[10px] text-[var(--text-muted)]">
                SUPPORT CENTER
              </span>
            </div>

            <h2 className="text-lg font-bold sm:text-xl">
              {isConsult
                ? "درخواست مشاوره"
                : "ثبت تیکت پشتیبانی"}
            </h2>

            <p className="mt-1 text-[11px] leading-6 text-[var(--text-muted)]">
              درخواستت رو با جزئیات برامون بنویس.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن پنجره"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--text)]"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Scrollable content */}
      <div
        className="
          min-h-0 flex-1
          overflow-y-auto overscroll-contain
          px-5 py-6 sm:px-7
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {status === "sent" ? (
          <div
            role="status"
            className="flex min-h-[360px] flex-col items-center justify-center text-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-[26px] border border-emerald-400/25 bg-emerald-400/10 text-emerald-400">
              <CheckIcon />
            </div>

            <h3 className="mt-6 text-xl font-bold">
              درخواستت ثبت شد!
            </h3>

            <p className="mt-3 max-w-sm text-sm leading-8 text-[var(--text-muted)]">
              درخواستت با موفقیت به سامانه پشتیبانی
              ارسال شد.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-7 rounded-2xl bg-gradient-to-l from-[var(--cta-a)] to-[var(--cta-b)] px-8 py-3 text-sm font-bold text-white"
            >
              بستن پنجره
            </button>
          </div>
        ) : (
          <form
            id="daal-support-ticket-form"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-7"
          >
            {/* Intro */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--surface-strong)] text-xs font-bold text-[var(--accent-2)]">
                  01
                </span>

                <h3 className="text-sm font-bold">
                  موضوع درخواست
                </h3>
              </div>

              <p className="mb-4 text-xs leading-6 text-[var(--text-muted)]">
                کدوم موضوع به درخواستت نزدیک‌تره؟
              </p>

              <div className="grid grid-cols-2 gap-3">
                {topics.map((topic) => {
                  const selected =
                    values.topic === topic.id;

                  return (
                    <button
                      key={topic.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        update("topic", topic.id)
                      }
                      className={`
                        group relative flex min-h-[105px]
                        flex-col items-start
                        rounded-2xl border
                        p-3.5 text-right
                        transition-all duration-200
                        sm:p-4
                        ${
                          selected
                            ? "border-[var(--accent)] bg-[var(--surface-strong)] shadow-[0_0_25px_-20px_var(--accent)]"
                            : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:bg-[var(--surface-strong)]"
                        }
                      `}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span
                          className={`
                            flex h-8 w-8 items-center
                            justify-center rounded-xl
                            text-lg
                            ${
                              selected
                                ? "bg-[var(--accent)] text-white"
                                : "bg-[var(--surface-strong)] text-[var(--accent-2)]"
                            }
                          `}
                        >
                          {topic.icon}
                        </span>

                        <span
                          className={`
                            flex h-4 w-4 items-center
                            justify-center rounded-full border
                            ${
                              selected
                                ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                                : "border-[var(--border)]"
                            }
                          `}
                        >
                          {selected && (
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              aria-hidden="true"
                            >
                              <path d="m5 12 4 4L19 6" />
                            </svg>
                          )}
                        </span>
                      </div>

                      <span className="mt-3 text-xs font-bold leading-5">
                        {topic.title}
                      </span>

                      <span className="mt-1 text-[10px] leading-5 text-[var(--text-muted)]">
                        {topic.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personal information */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--surface-strong)] text-xs font-bold text-[var(--accent-2)]">
                  02
                </span>

                <h3 className="text-sm font-bold">
                  اطلاعات ارتباطی
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="ticket-name"
                    className="mb-2 block text-xs font-medium"
                  >
                    نام و نام خانوادگی
                    <span className="mr-1 text-[var(--accent-2)]">
                      *
                    </span>
                  </label>

                  <input
                    id="ticket-name"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    value={values.name}
                    onChange={(event) =>
                      update("name", event.target.value)
                    }
                    aria-invalid={Boolean(errors.name)}
                    placeholder="مثلاً علی محمدی"
                    className={fieldClass}
                  />

                  {errors.name && (
                    <p className="mt-2 text-[11px] text-rose-400">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="ticket-contact"
                    className="mb-2 block text-xs font-medium"
                  >
                    شماره تماس یا ایمیل
                    <span className="mr-1 text-[var(--accent-2)]">
                      *
                    </span>
                  </label>

                  <input
                    id="ticket-contact"
                    type="text"
                    dir="ltr"
                    maxLength={120}
                    value={values.contact}
                    onChange={(event) =>
                      update("contact", event.target.value)
                    }
                    aria-invalid={Boolean(errors.contact)}
                    placeholder="09123456789"
                    className={`${fieldClass} text-left`}
                  />

                  {errors.contact && (
                    <p className="mt-2 text-[11px] text-rose-400">
                      {errors.contact}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--surface-strong)] text-xs font-bold text-[var(--accent-2)]">
                  03
                </span>

                <h3 className="text-sm font-bold">
                  توضیحات درخواست
                </h3>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition focus-within:border-[var(--accent)]">
                <textarea
                  id="ticket-message"
                  rows={5}
                  maxLength={3000}
                  value={values.message}
                  onChange={(event) =>
                    update("message", event.target.value)
                  }
                  aria-invalid={Boolean(errors.message)}
                  placeholder="مشکل یا درخواستت رو توضیح بده. هرچقدر جزئیات بیشتری بنویسی، بررسی اون راحت‌تر می‌شه..."
                  className="
                    block min-h-[145px] w-full
                    resize-y bg-transparent
                    px-4 py-4
                    text-sm leading-8
                    text-[var(--text)]
                    outline-none
                    placeholder:text-[var(--text-muted)]
                    [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden
                  "
                />

                <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2.5">
                  <span className="text-[10px] text-[var(--text-muted)]">
                    حداقل ۱۰ کاراکتر
                  </span>

                  <span
                    dir="ltr"
                    className="text-[10px] text-[var(--text-muted)]"
                  >
                    {values.message.length} / 3000
                  </span>
                </div>
              </div>

              {errors.message && (
                <p className="mt-2 text-[11px] text-rose-400">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Connection notice */}
            {!connected && (
              <div
                role="status"
                className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.055] p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                    !
                  </span>

                  <div>
                    <p className="text-xs font-bold">
                      سامانه ثبت تیکت هنوز فعال نشده
                    </p>

                    <p className="mt-1.5 text-[11px] leading-6 text-[var(--text-muted)]">
                      می‌تونی فرم رو تکمیل و طراحی
                      اون رو بررسی کنی، اما فعلاً
                      درخواست‌ها به پشتیبانی ارسال
                      نمی‌شن.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {status === "failed" && (
              <div
                role="alert"
                className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.06] p-4 text-xs leading-7 text-[var(--text)]"
              >
                ارسال درخواست انجام نشد. اطلاعات
                واردشده در فرم باقی مونده و می‌تونی
                بعداً دوباره تلاش کنی.
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "sending"}
              className="
                group flex min-h-13 w-full
                items-center justify-center gap-3
                rounded-2xl
                bg-gradient-to-l
                from-[var(--cta-a)]
                to-[var(--cta-b)]
                px-6 py-3.5
                text-sm font-bold text-white
                shadow-[0_12px_35px_-16px_var(--accent)]
                transition-all duration-200
                hover:brightness-110
                active:scale-[0.99]
                disabled:cursor-wait
                disabled:opacity-60
              "
            >
              {status === "sending" ? (
                "در حال ارسال..."
              ) : (
                <>
                  {isConsult
                    ? "ثبت درخواست مشاوره"
                    : "ارسال درخواست پشتیبانی"}

                  <span className="transition-transform group-hover:-translate-x-1">
                    <ArrowIcon />
                  </span>
                </>
              )}
            </button>

            <p className="text-center text-[11px] leading-6 text-[var(--text-muted)]">
              اطلاعات تماس فقط برای رسیدگی به
              درخواستت دریافت می‌شه.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}