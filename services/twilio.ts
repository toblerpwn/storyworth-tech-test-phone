const apiSid = process.env.TWILIO_API_KEY_SID;
const apiSecret = process.env.TWILIO_API_KEY_SECRET;

// console.log("TWILIO_API_KEY_SID", apiSid);
// console.log("TWILIO_API_KEY_SECRET", apiSecret);

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";
const TWILIO_REST_API_ROOT = "https://api.twilio.com/2010-04-01";
const TWILIO_REST_API_ACCOUNT_STRING = `Accounts/${apiSid}`;

// console.log("TWILIO_PHONE_NUMBER", TWILIO_PHONE_NUMBER);
// console.log("TWILIO_REST_API_ROOT", TWILIO_REST_API_ROOT);
// console.log("TWILIO_REST_API_ACCOUNT_STRING", TWILIO_REST_API_ACCOUNT_STRING);

enum TwilioCallbackEvents {
  INITIATED = "initiated",
  RINGING = "ringing",
  ANSWERED = "answered",
  COMPLETED = "completed",
}

// https://www.twilio.com/docs/voice/make-calls#get-call-status-events-during-a-call
const TWILIO_CALLBACK_EVENTS = [
  TwilioCallbackEvents.INITIATED,
  TwilioCallbackEvents.RINGING,
  TwilioCallbackEvents.ANSWERED,
  TwilioCallbackEvents.COMPLETED,
];

const VERCEL_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : undefined;

const PUBLIC_URL =
  VERCEL_URL || process.env.NGROK_PUBLIC_URL || "http://localhost:3000";

const TWILIO_CALL_STATUS_CALLBACK_URL = `${PUBLIC_URL}/api/twilio`;

export const createTwilioCall = async (phoneNumber: string) => {
  // using Twilio REST API to simplify the technical stack for this project
  // TODO: move Twilio API calls to a some backend
  const url = `${TWILIO_REST_API_ROOT}/${TWILIO_REST_API_ACCOUNT_STRING}/Calls.json`;
  const params = new URLSearchParams({
    From: TWILIO_PHONE_NUMBER,
    To: phoneNumber,
    Twiml:
      '<Response><Pause length="2"/><Say voice="woman">Hello! This is Storyworth, where every story is worth sharing. Please begin recording your one minute story now...</Say><Record maxLength="60" playBeep="true" /></Response>',
    Record: "true",
    StatusCallback: TWILIO_CALL_STATUS_CALLBACK_URL,
  });

  TWILIO_CALLBACK_EVENTS.forEach((event) => {
    params.append("StatusCallbackEvent", event);
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${apiSid}:${apiSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  console.log("response.status", response.status);

  if (!response.ok) {
    const error = await response.text();
    console.error("Twilio API error:", error);
    throw new Error("Failed to create call");
  }

  const call = await response.json();

  return call;
};
