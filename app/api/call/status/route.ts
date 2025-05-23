import { setCall } from "@/services/firebase";
import { TwilioCallStatus } from "@/types/twilio";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("POST /api/call/status start");

  try {
    // decode body of the request
    const body = await req.formData();

    // get state of the call
    const callSid = body.get("CallSid") as string;
    if (!callSid) {
      return NextResponse.json({ error: "Missing CallSid" }, { status: 400 });
    }

    const callStatus = body.get("CallStatus") as TwilioCallStatus;

    console.log(`Call ${callSid} status: ${callStatus}`);

    await setCall(callSid, {
      status: callStatus,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in Twilio webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
