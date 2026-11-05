import "server-only";
import { emailConfig } from "./config";

export type SendResult = { ok: true; id: string | null } | { ok: false; error: string };

/** Strip control characters / line breaks so a value can never inject headers. */
export const safeHeader = (v: string, max = 150) =>
  v.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max);

/**
 * Sends one email through Resend (server-side only). Returns success ONLY when the
 * provider accepted the message (HTTP 2xx). Never throws.
 */
export async function sendEmail(opts: { to: string; subject: string; html: string; text: string; replyTo?: string }): Promise<SendResult> {
  const c = emailConfig();
  if (!c.apiKey) return { ok: false, error: "not_configured:RESEND_API_KEY" };
  if (!c.from) return { ok: false, error: "not_configured:CLOUDTREK_FROM_EMAIL" };
  try {
    // RESEND_API_URL exists only so tests can point at a local mock; production uses the real endpoint.
    const res = await fetch(process.env.RESEND_API_URL || "https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${c.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: c.from,
        to: [safeHeader(opts.to, 254)],
        subject: safeHeader(opts.subject),
        html: opts.html,
        text: opts.text,
        ...(opts.replyTo ? { reply_to: safeHeader(opts.replyTo, 254) } : {}),
      }),
      signal: AbortSignal.timeout(15_000),
    });
    const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string; name?: string };
    if (!res.ok) return { ok: false, error: `resend_${res.status}:${(body.message ?? body.name ?? "error").slice(0, 200)}` };
    return { ok: true, id: body.id ?? null };
  } catch (e) {
    return { ok: false, error: `network:${e instanceof Error ? e.message.slice(0, 120) : "error"}` };
  }
}
