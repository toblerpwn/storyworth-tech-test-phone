"use client";

import { BrandedButton } from "@/app/components/ui/brandedButton";
import { PhoneInput } from "@/app/components/voiceCallControls/phoneInput";
import Spinner from "@/app/components/ui/spinner";
import { makeCall, TWILIO_CALL_STATUS_FRIENDLY_TEXT } from "@/app/utils/calls";
import { useEffect, useState } from "react";
import { setActiveCall } from "@/app/utils/firestore";
import {
  useCurrentUserCallSid,
  useCurrentUserId,
} from "@/app/hooks/useCurrentUser";
import { useCallStatus } from "@/app/hooks/useCall";
import { TwilioCallStatus } from "@/types/twilio";

const INVALID_PHONE_STRING =
  "Invalid phone number. Please enter a 10-digit number and try again.";

enum CallUiState {
  ERROR = -1,
  IDLE = 0,
  CALLING,
  COMPLETED,
}

export const VoiceCallControls = () => {
  const [digits, setDigits] = useState<string | null>(null);
  const [errorString, setErrorString] = useState<string | null>(null);
  const [hasSubmittedPhoneNumber, setHasSubmittedPhoneNumber] = useState(false);
  const [callUiState, setCallUiState] = useState(CallUiState.IDLE);

  const userId = useCurrentUserId();
  const callSid = useCurrentUserCallSid();
  const callStatus = useCallStatus(callSid);

  const validDigits = Boolean(digits && digits.length === 10);

  const statusString = callStatus
    ? TWILIO_CALL_STATUS_FRIENDLY_TEXT[callStatus]
    : null;

  useEffect(() => {
    console.log("Valid digits:", validDigits);
    if (!validDigits && hasSubmittedPhoneNumber) {
      setErrorString(INVALID_PHONE_STRING);
    } else {
      setErrorString(null);
    }
  }, [validDigits, hasSubmittedPhoneNumber]);

  useEffect(() => {
    let callUiState = CallUiState.IDLE;
    switch (callStatus) {
      case TwilioCallStatus.QUEUED:
      case TwilioCallStatus.INITIATED:
      case TwilioCallStatus.RINGING:
      case TwilioCallStatus.IN_PROGRESS:
        callUiState = CallUiState.CALLING;
        break;
      case TwilioCallStatus.COMPLETED:
        callUiState = CallUiState.COMPLETED;
        break;
      case TwilioCallStatus.BUSY:
      case TwilioCallStatus.FAILED:
      case TwilioCallStatus.NO_ANSWER:
      case TwilioCallStatus.CANCELED:
        callUiState = CallUiState.ERROR;
        break;
      default:
        callUiState = CallUiState.IDLE;
        break;
    }
    setCallUiState(callUiState);
  }, [callStatus]);

  const onCallMeButtonClick = async () => {
    if (!userId) {
      setErrorString("Still loading user. Try again in a few seconds...");
      return;
    }

    setHasSubmittedPhoneNumber(true);

    // validate digits
    if (validDigits && digits) {
      console.log("Calling number:", digits);
      setErrorString(null);

      try {
        setCallUiState(CallUiState.CALLING);
        const call = await makeCall(digits);
        console.log("Call response:", call);
        await setActiveCall(userId, call.sid, call.status);
      } catch (error) {
        console.error("Error calling number:", error);
        setErrorString(`Call failed. ${error}`);
        setCallUiState(CallUiState.ERROR);
      }
    } else {
      console.warn("Number is invalid:", errorString);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-[#12473A]">Your phone number</p>
        <PhoneInput
          className="max-w-sm"
          onDigitsChange={(num) => {
            setDigits(num);
          }}
        />
      </div>
      <div className="flex flex-row gap-4">
        <BrandedButton
          label="Call Me Now"
          className="flex-shrink-0"
          disabled={digits === null || callUiState >= CallUiState.CALLING}
          onClick={onCallMeButtonClick}
        />
        {callUiState >= CallUiState.CALLING ? (
          <div className="flex flex-row gap-2 items-center">
            {callUiState === CallUiState.CALLING ? <Spinner /> : null}
            <p className="font-text text-[#12473A]">{statusString}</p>
          </div>
        ) : errorString ? (
          <p className="font-text text-red-500">{errorString}</p>
        ) : null}
      </div>
    </div>
  );
};
