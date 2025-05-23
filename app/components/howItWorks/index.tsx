import Divider from "@/app/components/ui/divider";

const howItWorksSteps = [
  "Enter your phone number and Storyworth will call you to record your story.",
  "During the call we’ll record your story over the phone.",
  "After the call, an audio clip of your recording will be uploaded to your story where you can then request it to be transcribed.",
];

export const HowItWorks = () => {
  return (
    <div className="flex flex-col gap-[16px] items-center justify-items-center sm:items-start">
      <h2 className="font-label uppercase font-bold tracking-[0.125em]">
        How it works
      </h2>
      {howItWorksSteps.map((step, index) => (
        <div key={index}>
          <div className="flex flex-row gap-[28px] items-center justify-items-center">
            <p className="font-display text-[28px]">{`0${index + 1}`}</p>
            <p className="font-text text-xl">{step}</p>
          </div>
          {index < howItWorksSteps.length - 1 ? <Divider /> : null}
        </div>
      ))}
    </div>
  );
};
