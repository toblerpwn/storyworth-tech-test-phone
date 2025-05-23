"use client";

import Spinner from "@/app/components/ui/spinner";
import { useEffect, useRef, useState } from "react";

type CallRecordingControlsProps = {
  url: string;
};

export const CallRecordingControls = ({ url }: CallRecordingControlsProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [delayingPlayback, setDelayingPlayback] = useState(true);

  // delay playback for a few seconds at startup
  // this is to allow the URL to replicate/etc and playback to be available
  // playing immediately reliably fails due to Twilio caching/etc
  useEffect(() => {
    console.log("Delaying playback for 5 seconds...");
    setTimeout(() => {
      console.log("Allowing playback!");
      setDelayingPlayback(false);
    }, 2000);
  }, [url]);

  return (
    <div className="flex flex-row items-center justify-center gap-2">
      {delayingPlayback ? <Spinner /> : null}
      <audio
        key={`${url}-${delayingPlayback}`}
        ref={audioRef}
        src={delayingPlayback ? undefined : url}
        controls
        preload="auto"
        autoPlay={!delayingPlayback}
      />
      {delayingPlayback ? <div className="w-5" /> : null}
    </div>
  );
};
