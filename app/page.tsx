"use client";

import { CallRecordingControls } from "@/app/components/callRecordingControls";
import HomeFooter from "@/app/components/homeFooter";
import { HowItWorks } from "@/app/components/howItWorks";
import Divider from "@/app/components/ui/divider";
import Spinner from "@/app/components/ui/spinner";
import { VoiceCallControls } from "@/app/components/voiceCallControls";
import {
  useCallRecordingUrl,
  useCallTranscriptText,
} from "@/app/hooks/useCall";
import {
  useCurrentUserCallSid,
  useCurrentUserId,
} from "@/app/hooks/useCurrentUser";
import Image from "next/image";

export default function Home() {
  const userId = useCurrentUserId();
  const activeCallSid = useCurrentUserCallSid();
  const callRecordingUrl = useCallRecordingUrl(activeCallSid);
  const callTranscriptText = useCallTranscriptText(activeCallSid);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20]">
      <main className="flex flex-col gap-[36px] row-start-2 items-center justify-items-center max-w-2xl">
        <Image
          className="w-auto h-auto"
          src="/assets/laptop-typing.png"
          alt="Laptop with a typing hand"
          width={180}
          height={38}
          priority
        />
        <h1 className="font-display text-4xl text">
          Record your voice over the phone and we&apos;ll transcribe your story.
        </h1>
        <div className="w-full min-h-40">
          {callRecordingUrl ? (
            <CallRecordingControls
              recordingUrl={callRecordingUrl}
              transcriptText={callTranscriptText}
            />
          ) : userId ? (
            <VoiceCallControls />
          ) : (
            <Spinner />
          )}
        </div>
        <Divider />
        <HowItWorks />
      </main>
      <HomeFooter />
    </div>
  );
}
