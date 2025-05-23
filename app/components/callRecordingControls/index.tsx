"use client";

import { useCallRecordingUrl } from "@/app/hooks/useCall";
import { useCurrentUserCallSid } from "@/app/hooks/useCurrentUser";
import { useState, useRef } from "react";

export const CallRecordingControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const callSid = useCurrentUserCallSid();
  const callRecordingUrl = useCallRecordingUrl(callSid);
  console.log("callRecordingUrl", callRecordingUrl);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      {callRecordingUrl ? (
        <>
          <audio ref={audioRef} src={callRecordingUrl} />
          <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
        </>
      ) : null}
    </div>
  );
};
