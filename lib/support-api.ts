export const supportBackend = { connected: true } as const;

export type SendResult =
  | { ok: true; ticketNumber?: number }
  | { ok: false; reason: "not-connected" | "network" };

export type TicketValues = {
  name: string;
  contact: string;
  topic: string;
  message: string;
};

export async function sendChatMessage(text: string): Promise<SendResult> {
  void text;
  return { ok: false, reason: "not-connected" };
}

export async function sendTicket(values: TicketValues): Promise<SendResult> {
  try {
    const response = await fetch("/api/support/tickets", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!response.ok) return { ok: false, reason: "network" };
    const data = await response.json();
    return { ok: true, ticketNumber: data.ticket?.ticket_number };
  } catch {
    return { ok: false, reason: "network" };
  }
}
