import { setCall } from "@/services/firebase";
import { TwilioCallStatus } from "@/types/twilio";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("POST /api/twilio start");

  try {
    // decode body of the request
    const body = await req.formData();

    // get state of the call
    const callSid = body.get("CallSid") as string;
    if (!callSid) {
      return NextResponse.json({ error: "Missing CallSid" }, { status: 400 });
    }

    const callStatus = body.get("CallStatus") as TwilioCallStatus;
    const recordingUrl = body.get("RecordingUrl") as string;

    console.log(`Call ${callSid} status: ${callStatus} (${recordingUrl})`);

    await setCall(callSid, {
      status: callStatus,
      recordingUrl: recordingUrl,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in Twilio webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
