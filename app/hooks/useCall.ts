"use client";

import { watchCallSid } from "@/services/firebase";
import { FirestoreCall } from "@/types/firestore";
import { useEffect, useState } from "react";

// TODO: create global state w/ single instance of subscription
export const useCall = (callSid: string | null) => {
  const [call, setCall] = useState<FirestoreCall | null>();

  useEffect(() => {
    if (!callSid) {
      setCall(null);
      return;
    }

    const unsubscribe = watchCallSid(callSid, (call) => {
      // console.log("Active call updated:", call);
      setCall(call);
    });

    return () => unsubscribe();
  }, [callSid]);

  return call;
};

export const useCallStatus = (callSid: string | null) => {
  const call = useCall(callSid);
  return call?.status;
};

export const useCallRecordingUrl = (callSid: string | null) => {
  const call = useCall(callSid);
  return call?.recordingUrl;
};
