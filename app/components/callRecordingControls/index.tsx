"use client";

import { BrandedButton } from "@/app/components/ui/brandedButton";
import Spinner from "@/app/components/ui/spinner";
import { useEffect, useRef, useState } from "react";

type CallRecordingControlsProps = {
  recordingUrl: string;
  transcriptText?: string | null;
};

export const CallRecordingControls = ({
  recordingUrl,
  transcriptText,
}: CallRecordingControlsProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [delayingPlayback, setDelayingPlayback] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);

  // delay playback for a few seconds at startup
  // this is to allow the URL to replicate/etc and playback to be available
  // playing immediately reliably fails due to Twilio caching/etc
  // TODO: download locally and validate before playing (then remove delay)
  useEffect(() => {
    setTimeout(() => {
      setDelayingPlayback(false);
    }, 3500);
  }, [recordingUrl]);

  const handleShowTranscript = () => {
    setShowTranscript((prev) => !prev);
  };

  return (
    <div className="gap-3 flex flex-col ">
      <div className="flex flex-row gap-1 text-[#12473A]">
        <p>Your story:</p>
        {delayingPlayback ? <Spinner /> : <p>ready!</p>}
      </div>
      <div className="gap-5 flex flex-col px-5">
        <audio
          key={`${recordingUrl}-${delayingPlayback}`}
          ref={audioRef}
          src={delayingPlayback ? undefined : recordingUrl}
          controls
          preload="auto"
          autoPlay={!delayingPlayback}
        />
        <div className="flex flex-row gap-2 items-center">
          <BrandedButton
            label={
              !transcriptText
                ? "Loading Transcript..."
                : showTranscript
                ? "Hide Transcript"
                : "Show Transcript"
            }
            className={`w-[260px] ${showTranscript ? "opacity-60" : ""}`}
            disabled={!transcriptText}
            onClick={handleShowTranscript}
          />
          {!transcriptText ? <Spinner /> : null}
        </div>

        {showTranscript ? (
          <div className="pl-8">
            <p className="font-text text-[#12473A] border-l-4 border-[#12473A] pl-4 italic">
              {transcriptText ? transcriptText : "No transcript available."}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
