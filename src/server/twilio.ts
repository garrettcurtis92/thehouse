import twilio from "twilio";

const sid = process.env.TWILIO_ACCOUNT_SID!;
const token = process.env.TWILIO_AUTH_TOKEN!;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const fromNumber = process.env.TWILIO_FROM_NUMBER;

if (!sid || !token || (!messagingServiceSid && !fromNumber)) {
  throw new Error("Twilio env vars missing");
}

const client = twilio(sid, token);

export async function sendSms(to: string, body: string) {
  const msg = await client.messages.create({
    to,
    body,
    ...(messagingServiceSid ? { messagingServiceSid } : { from: fromNumber }),
  });
  return msg.sid;
}