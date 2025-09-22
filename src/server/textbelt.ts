export type TextbeltResponse = {
  success: boolean; error?: string; quotaRemaining?: number; textId?: string|number;
};

export async function sendViaTextbelt(to: string, body: string) {
  const endpoint = process.env.TEXTBELT_URL || "https://textbelt.com/text";
  const key = process.env.TEXTBELT_KEY;
  if (!key) throw new Error("TEXTBELT_KEY is not set");

  const form = new URLSearchParams({
    phone: to.replace(/\D/g, ""),  // 15551234567
    message: body,
    key,
  });

  if (process.env.TEXTBELT_REPLY_WEBHOOK) {
    form.append("replyWebhookUrl", process.env.TEXTBELT_REPLY_WEBHOOK);
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
    redirect: "manual",
  });

  const json = (await res.json()) as TextbeltResponse;
  if (!json.success) throw new Error(json.error || "Textbelt send failed");
  return json.textId ?? "ok";
}