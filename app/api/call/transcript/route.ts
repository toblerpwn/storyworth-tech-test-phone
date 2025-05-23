import { setCall } from "@/services/firebase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("POST /api/call/transcript start");

  try {
    // decode body of the request
    const body = await req.formData();
    console.log("POST /api/call/transcript body", body);

    // get callSid and recordingUrl
    const callSid = body.get("CallSid") as string;
    if (!callSid) {
      return NextResponse.json({ error: "Missing CallSid" }, { status: 400 });
    }
    const transcriptText = body.get("TranscriptionText") as string;
    if (!transcriptText) {
      return NextResponse.json(
        { error: "Missing TranscriptionText" },
        { status: 400 }
      );
    }

    const transcriptUrl = body.get("TranscriptionUrl") as string;
    if (!transcriptUrl) {
      return NextResponse.json(
        { error: "Missing TranscriptionUrl" },
        { status: 400 }
      );
    }

    await setCall(callSid, {
      transcriptUrl,
      transcriptText,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in Twilio webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
