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
    setTimeout(() => {
      setDelayingPlayback(false);
    }, 1500);
  }, [url]);

  return (
    <div className="gap-5 flex flex-col ">
      <div className="flex flex-row gap-1 text-[#12473A]">
        <p>Story recording:</p>
        {delayingPlayback ? <Spinner /> : <p>ready!</p>}
      </div>
      <div className="flex flex-row items-center gap-2">
        <audio
          key={`${url}-${delayingPlayback}`}
          ref={audioRef}
          src={delayingPlayback ? undefined : url}
          controls
          preload="auto"
          autoPlay={!delayingPlayback}
        />
      </div>
    </div>
  );
};
