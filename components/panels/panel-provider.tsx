"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChatPanel } from "./chat-panel";
import { ContactPanel } from "./contact-panel";
import {
  PanelContext,
  type OpenOptions,
  type PanelId,
} from "./panel-context";
import { TicketPanel } from "./ticket-panel";

const CLOSE_MS = 220;

const labels: Record<PanelId, string> = {
  chat: "چت آنلاین",
  ticket: "ارسال تیکت پشتیبانی",
  contact: "تماس با ما",
};

export function PanelProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [options, setOptions] = useState<OpenOptions>({});
  const [closing, setClosing] = useState(false);

  const open = useCallback((next: PanelId, opts: OpenOptions = {}) => {
    window.clearTimeout(closeTimer.current);
    if (
      !dialogRef.current?.open &&
      document.activeElement instanceof HTMLElement
    ) {
      returnFocus.current = document.activeElement;
    }
    setOptions(opts);
    setClosing(false);
    setPanel(next);
  }, []);

  const close = useCallback(() => {
    setClosing(true);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setPanel(null);
      setClosing(false);
    }, CLOSE_MS);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (panel && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!panel && dialog.open) {
      dialog.close();
      document.documentElement.style.overflow = "";
      returnFocus.current?.focus();
    }
  }, [panel]);

  useEffect(
    () => () => {
      window.clearTimeout(closeTimer.current);
      document.documentElement.style.overflow = "";
    },
    [],
  );

  const value = useMemo(() => ({ open }), [open]);

  return (
    <PanelContext.Provider value={value}>
      {children}
      <dialog
        ref={dialogRef}
        className="panel-dialog"
        data-closing={closing ? "" : undefined}
        aria-label={panel ? labels[panel] : undefined}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        {panel && (
          <div
            className="flex h-full w-full items-center justify-center p-4"
            onClick={(event) => {
              if (event.target === event.currentTarget) close();
            }}
          >
            {panel === "chat" && <ChatPanel onClose={close} onSwitch={open} />}
            {panel === "ticket" && (
              <TicketPanel onClose={close} initial={options} />
            )}
            {panel === "contact" && (
              <ContactPanel onClose={close} onSwitch={open} />
            )}
          </div>
        )}
      </dialog>
    </PanelContext.Provider>
  );
}