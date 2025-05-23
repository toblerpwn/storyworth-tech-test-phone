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

// TODO: this should work at build time on Vercel using process.env.VERCEL_URL, I think...
// but it's not, so hard-coding for now
const VERCEL_URL = "https://storyworth-tech-test-phone.vercel.app";

const PUBLIC_URL =
  process.env.NGROK_PUBLIC_URL || VERCEL_URL || "http://localhost:3000";

const TWILIO_CALL_API_ROOT = `${PUBLIC_URL}/api/call`;
const TWILIO_CALL_STATUS_CALLBACK_URL = `${TWILIO_CALL_API_ROOT}/status`;
const TWILIO_CALL_RECORDING_CALLBACK_URL = `${TWILIO_CALL_API_ROOT}/recording`;
const TWILIO_CALL_TRANSCRIPT_CALLBACK_URL = `${TWILIO_CALL_API_ROOT}/transcript`;

console.log("TWILIO_CALL_STATUS_CALLBACK_URL", TWILIO_CALL_STATUS_CALLBACK_URL);

export const createTwilioCall = async (phoneNumber: string) => {
  // TODO: do local transcription instead of Twilio - right now, limit is only 2 minutes
  const url = `${TWILIO_REST_API_ROOT}/${TWILIO_REST_API_ACCOUNT_STRING}/Calls.json`;
  const params = new URLSearchParams({
    From: TWILIO_PHONE_NUMBER,
    To: phoneNumber,
    Twiml: `
      <Response>
        <Pause length="2"/>
        <Say voice="woman">
          Hello! This is Storyworth, where every story is worth sharing. Let's start with a brief story about your fondest childhood memory. You may begin recording after the beep...
        </Say>
        <Record maxLength="120" timeout="0" playBeep="true" transcribe="true" transcribeCallback="${TWILIO_CALL_TRANSCRIPT_CALLBACK_URL}" recordingStatusCallback="${TWILIO_CALL_RECORDING_CALLBACK_URL} " />
      </Response>
    `,
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
