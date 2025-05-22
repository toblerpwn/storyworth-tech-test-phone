import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-items-center sm:items-start max-w-3xl">
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
          <p className="font-label uppercase font-bold">How it works</p>
          <span className="flex flex-row gap-[54px]">
            <p className="font-display text-[28px]">01</p>
            <p className="font-text text-xl">
              Enter your phone number and Storyworth will call you to record
              your story.
            </p>
          </span>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        /* todo: debug info */
      </footer>
    </div>
  );
}
