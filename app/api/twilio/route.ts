import { NextRequest, NextResponse } from "next/server";

const PUBLIC_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NGROK_PUBLIC_URL ||
  "http://localhost:3000";

export const TWILIO_CALL_STATUS_CALLBACK_URL = `${PUBLIC_URL}/api/twilio`;

export enum TwilioCallStatus {
  QUEUED = "queued",
  INITIATED = "initiated",
  RINGING = "ringing",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
  BUSY = "busy",
  FAILED = "failed",
  NO_ANSWER = "no-answer",
  CANCELED = "canceled",
}

export const TWILIO_CALL_STATUS_FRIENDLY_TEXT: {
  [key in TwilioCallStatus]: string;
} = {
  [TwilioCallStatus.QUEUED]: "queued",
  [TwilioCallStatus.INITIATED]: "initiated",
  [TwilioCallStatus.RINGING]: "ringing",
  [TwilioCallStatus.IN_PROGRESS]: "in progress",
  [TwilioCallStatus.COMPLETED]: "completed",
  [TwilioCallStatus.BUSY]: "busy",
  [TwilioCallStatus.FAILED]: "failed",
  [TwilioCallStatus.NO_ANSWER]: "no answer",
  [TwilioCallStatus.CANCELED]: "canceled",
};

export async function POST(req: NextRequest) {
  console.log("POST /api/twilio start");

  try {
    // decode body of the request
    const body = await req.formData();

    // get state of the call
    const callStatus = body.get("CallStatus") as TwilioCallStatus;
    const recordingUrl = body.get("RecordingUrl");

    console.log(
      "Call status:",
      callStatus,
      "friendly text:",
      TWILIO_CALL_STATUS_FRIENDLY_TEXT[callStatus]
    );
    console.log("Recording URL:", recordingUrl);

    // TODO: EMIT SOCKET EVENT TO CLIENT LISTENING FOR UPDATES ON CALL SID

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in Twilio webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
