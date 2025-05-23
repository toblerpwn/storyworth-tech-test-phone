import type { CallRequestBody } from "@/app/api/call/route";
import { TwilioCallResponse, TwilioCallStatus } from "@/types/twilio";

export const TWILIO_CALL_STATUS_FRIENDLY_TEXT: {
  [key in TwilioCallStatus]: string;
} = {
  [TwilioCallStatus.QUEUED]: "Starting call...",
  [TwilioCallStatus.INITIATED]: "Calling you now...",
  [TwilioCallStatus.RINGING]: "Ringing! It's ringing! 🎉",
  [TwilioCallStatus.IN_PROGRESS]:
    "You answered! 😍  Please record a brief story about your fondest childhood memory...",
  [TwilioCallStatus.COMPLETED]: "Call completed. Preparing your recording...",
  [TwilioCallStatus.BUSY]: "Line was busy. Please try again.",
  [TwilioCallStatus.FAILED]: "Call failed. Please try again.",
  [TwilioCallStatus.NO_ANSWER]: "No answer. Please try again.",
  [TwilioCallStatus.CANCELED]:
    "Call was canceled due to an internal error. Please try again.",
};

export async function makeCall(phoneNumber: string) {
  console.warn("Making call to:", phoneNumber);

  const res = await fetch("/api/call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phoneNumber } satisfies CallRequestBody),
  });

  console.log("res:", res.status, res.statusText);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Unknown error");
  }

  const callData = data.call as TwilioCallResponse;
  return callData;
}
