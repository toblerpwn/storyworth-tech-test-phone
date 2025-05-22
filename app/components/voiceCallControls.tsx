"use client";

import { CallMeButton } from "@/app/components/callMeButton";
import { PhoneInput } from "@/app/components/phoneInput";
import Spinner from "@/app/components/ui/spinner";
import { useEffect, useRef, useState } from "react";

const INVALID_PHONE_STRING =
  "Invalid phone number. Please enter a 10-digit number and try again.";

enum CallState {
  IDLE = "IDLE",
  CALLING = "CALLING",
}
const CALLING_TIMEOUT = 10000; // 10 seconds

export const VoiceCallControls = () => {
  const [digits, setDigits] = useState<string | null>(null);
  const [errorString, setErrorString] = useState<string | null>(null);
  const [hasSubmittedPhoneNumber, setHasSubmittedPhoneNumber] = useState(false);
  const [callState, setCallState] = useState(CallState.IDLE);

  const validDigits = digits && digits.length === 10;

  const statusString =
    callState === CallState.CALLING ? "Calling you now..." : null;

  useEffect(() => {
    console.log("Valid digits:", validDigits);
    if (!validDigits && hasSubmittedPhoneNumber) {
      setErrorString(INVALID_PHONE_STRING);
    } else {
      setErrorString(null);
    }
  }, [validDigits, hasSubmittedPhoneNumber]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-[#12473A]">Your phone number</p>
        <PhoneInput
          className=" max-w-sm"
          onDigitsChange={(num) => {
            setDigits(num);
          }}
        />
      </div>
      <div className="flex flex-row gap-4">
        <CallMeButton
          className="flex-shrink-0"
          disabled={digits === null || callState !== CallState.IDLE}
          onClick={() => {
            setHasSubmittedPhoneNumber(true);

            // validate digits
            if (validDigits) {
              console.log("Calling number:", digits);
              setCallState(CallState.CALLING);
              setErrorString(null);
              setTimeout(() => {
                setCallState(CallState.IDLE);
                console.log("Call ended");
              }, 5000);
            } else {
              console.warn("Number is invalid:", errorString);
            }
          }}
        />
        {callState === CallState.CALLING ? (
          <div className="flex flex-row gap-2 items-center">
            <Spinner />
            <p className="font-text text-[#12473A]">{statusString}</p>
          </div>
        ) : errorString ? (
          <p className="font-text text-red-500">{errorString}</p>
        ) : null}
      </div>
    </div>
  );
};
