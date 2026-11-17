/**
 * Ù†Ù‚Ø·Ù‡ Ø§ØªØµØ§Ù„ Ú†Øª Ùˆ ØªÛŒÚ©Øª Ø¨Ù‡ Ø¨Ú©â€ŒØ§Ù†Ø¯.
 * ØªØ§ ÙˆÙ‚ØªÛŒ Ø¨Ú©â€ŒØ§Ù†Ø¯ ÙˆØ§Ù‚Ø¹ÛŒ Ù†ÛŒØ³ØªØŒ Ù‡ÛŒÚ† Ù¾ÛŒØ§Ù…ÛŒ Ø§Ø±Ø³Ø§Ù„ Ù†Ù…ÛŒâ€ŒØ´ÙˆØ¯ Ùˆ Ù†ØªÛŒØ¬Ù‡ Ù‡Ù…ÛŒØ´Ù‡ Â«Ù…ØªØµÙ„ Ù†ÛŒØ³ØªÂ» Ø§Ø³Øª.
 * Ø¨Ø¹Ø¯Ø§Ù‹ ÙÙ‚Ø· Ø¨Ø¯Ù†Ù‡ Ø§ÛŒÙ† Ø¯Ùˆ ØªØ§Ø¨Ø¹ Ø±Ø§ Ø¨Ø§ Ø¯Ø±Ø®ÙˆØ§Ø³Øª ÙˆØ§Ù‚Ø¹ÛŒ Ø¹ÙˆØ¶ Ú©Ù† Ùˆ connected Ø±Ø§ true Ú©Ù†.
 */
export const supportBackend = { connected: false } as const;

export type SendResult =
  | { ok: true }
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
  void values;
  return { ok: false, reason: "not-connected" };
}