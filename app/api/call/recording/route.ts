import { setCall } from "@/services/firebase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("POST /api/call/recording start");

  try {
    // decode body of the request
    const body = await req.formData();

    // get callSid and recordingUrl
    const callSid = body.get("CallSid") as string;
    if (!callSid) {
      return NextResponse.json({ error: "Missing CallSid" }, { status: 400 });
    }
    const recordingUrl = body.get("RecordingUrl") as string;
    if (!recordingUrl) {
      return NextResponse.json(
        { error: "Missing RecordingUrl" },
        { status: 400 }
      );
    }

    await setCall(callSid, {
      recordingUrl,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in Twilio webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
