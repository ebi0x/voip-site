"use client";

import type { ReactNode } from "react";
import { usePanels, type PanelId, type TicketTopic } from "./panel-context";

type PanelTriggerProps = {
  panel: PanelId;
  topic?: TicketTopic;
  message?: string;
  className?: string;
  children: ReactNode;
};

export function PanelTrigger({
  panel,
  topic,
  message,
  className,
  children,
}: PanelTriggerProps) {
  const { open } = usePanels();
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={() => open(panel, { topic, message })}
    >
      {children}
    </button>
  );
}