"use client";

import { BrandedButton } from "@/app/components/ui/brandedButton";
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

  const handleShowTranscript = () => {
    console.warn("TODO: show transcript");
  };

  return (
    <div className="gap-3 flex flex-col ">
      <div className="flex flex-row gap-1 text-[#12473A]">
        <p>Story recording:</p>
        {delayingPlayback ? <Spinner /> : <p>ready!</p>}
      </div>
      <div className="gap-5 flex flex-col px-5">
        <audio
          key={`${url}-${delayingPlayback}`}
          ref={audioRef}
          src={delayingPlayback ? undefined : url}
          controls
          preload="auto"
          autoPlay={!delayingPlayback}
        />
        <BrandedButton
          disabled={delayingPlayback}
          label="Show Transcript"
          className="w-[260px]"
          // disabled={digits === null || callUiState >= CallUiState.CALLING}
          onClick={handleShowTranscript}
        />
      </div>
    </div>
  );
};
