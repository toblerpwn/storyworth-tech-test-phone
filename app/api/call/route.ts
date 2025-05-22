import { NextRequest, NextResponse } from "next/server";
import { createTwilioCall } from "@/services/twilio";

export type CallRequestBody = {
  phoneNumber: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: CallRequestBody = await req.json();
    const { phoneNumber } = body;
    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Missing phoneNumber" },
        { status: 400 }
      );
    }
    await createTwilioCall(phoneNumber);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
