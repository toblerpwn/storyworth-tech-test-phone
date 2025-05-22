const apiSid = process.env.TWILIO_API_KEY_SID;
const apiSecret = process.env.TWILIO_API_KEY_SECRET;

console.log("TWILIO_API_KEY_SID", apiSid);
console.log("TWILIO_API_KEY_SECRET", apiSecret);

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";
const TWILIO_REST_API_ROOT = "https://api.twilio.com/2010-04-01";
const TWILIO_REST_API_ACCOUNT_STRING = `Accounts/${apiSid}`;

console.log("TWILIO_PHONE_NUMBER", TWILIO_PHONE_NUMBER);
console.log("TWILIO_REST_API_ROOT", TWILIO_REST_API_ROOT);
console.log("TWILIO_REST_API_ACCOUNT_STRING", TWILIO_REST_API_ACCOUNT_STRING);

const TWILIO_CALL_METADATA_APP_ROUTE = `http://${
  process.env.NEXT_PUBLIC_BASE_URL || "localhost:3000"
}/twiml.xml`;

console.log("TWILIO_CALL_METADATA_APP_ROUTE", TWILIO_CALL_METADATA_APP_ROUTE);

export const createTwilioCall = async (phoneNumber: string) => {
  console.log("process.env", process.env);
  // using Twilio REST API to simplify the technical stack for this project
  // TODO: move Twilio API calls to a some backend
  const url = `${TWILIO_REST_API_ROOT}/${TWILIO_REST_API_ACCOUNT_STRING}/Calls.json`;
  const params = new URLSearchParams({
    From: TWILIO_PHONE_NUMBER,
    To: phoneNumber,
    Twiml:
      '<Response><Pause length="2"/><Say voice="woman">Hello! This is Storyworth, where every story is worth sharing. Please begin recording your one minute story now...</Say><Record maxLength="60" playBeep="true" /></Response>',
    Record: "true",
  });

  console.log("url", url);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${apiSid}:${apiSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  console.log("response", response.status);

  if (!response.ok) {
    const error = await response.text();
    console.error("Twilio API error:", error);
    throw new Error("Failed to create call");
  }

  const call = await response.json();
  console.log(call.sid);
  console.log(call);
};
