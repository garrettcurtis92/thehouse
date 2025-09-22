import { sendViaTextbelt } from "./textbelt";
import { sendSms as sendViaTwilio } from "./twilio";

export async function sendSmsUniversal(to: string, body: string) {
  if (process.env.USE_TEXTBELT === "true") return sendViaTextbelt(to, body);
  return sendViaTwilio(to, body);
}