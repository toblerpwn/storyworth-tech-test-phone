import Divider from "@/app/components/divider";
import Image from "next/image";

const howItWorksSteps = [
  "Enter your phone number and Storyworth will call you to record your story.",
  "During the call we’ll record your story over the phone.",
  "After the call, an audio clip of your recording will be uploaded to your story where you can then request it to be transcribed.",
];

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20]">
      <main className="flex flex-col gap-[36px] row-start-2 items-center justify-items-center max-w-2xl">
        <Image
          className="dark:invert"
          src="/assets/laptop-typing.png"
          alt="Laptop with a typing hand"
          width={180}
          height={38}
          priority
        />
        <h3 className="font-display text-4xl text">
          Record your voice over the phone and we'll transcribe your story.
        </h3>
        <div className="flex flex-col gap-[16px] items-center justify-items-center sm:items-start">
          <p className="font-label uppercase font-bold tracking-widest">
            How it works
          </p>
          {howItWorksSteps.map((step, index) => (
            <div key={index}>
              <div className="flex flex-row gap-[28px] items-center justify-items-center">
                <p className="font-display text-[28px]">{`0${index + 1}`}</p>
                <p className="font-text text-xl">{step}</p>
              </div>
              {index < howItWorksSteps.length - 1 ? (
                <Divider className="w-full mx-8 my-2" />
              ) : null}
            </div>
          ))}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        /* todo: debug info */
      </footer>
    </div>
  );
}
