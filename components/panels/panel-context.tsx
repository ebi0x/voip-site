"use client";

import { createContext, useContext } from "react";

export type PanelId = "chat" | "ticket" | "contact";
export type TicketTopic = "tech" | "purchase" | "consult" | "other";
export type OpenOptions = { topic?: TicketTopic; message?: string };

type PanelContextValue = {
  open: (panel: PanelId, options?: OpenOptions) => void;
};

export const PanelContext = createContext<PanelContextValue | null>(null);

export function usePanels(): PanelContextValue {
  const ctx = useContext(PanelContext);
  if (!ctx) {
    throw new Error("usePanels Ø¨Ø§ÛŒØ¯ Ø¯Ø§Ø®Ù„ <PanelProvider> Ø§Ø³ØªÙØ§Ø¯Ù‡ Ø´ÙˆØ¯.");
  }
  return ctx;
}