import { NextRequest, NextResponse } from "next/server";
import { createTwilioCall } from "@/services/twilio";
import { TwilioCallResponse } from "@/types/twilio";

export type CallRequestBody = {
  phoneNumber: string;
};

export type CallRequestResponseData = {
  success: true;
  call: TwilioCallResponse;
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

    const call = await createTwilioCall(phoneNumber);

    const response: CallRequestResponseData = {
      success: true,
      call,
    };
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
