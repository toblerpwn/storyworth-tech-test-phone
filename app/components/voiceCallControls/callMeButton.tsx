type CallMeButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export const CallMeButton = ({
  disabled = false,
  onClick,
  className = "",
}: CallMeButtonProps) => {
  return (
    <button
      disabled={disabled}
      type="button"
      className={`bg-[#07949D] text-white font-label uppercase font-bold tracking-[0.125em] rounded-full p-[12px] w-[185] shadow-[0px_4px_16px_rgba(0,0,0,0.10)] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={onClick}
    >
      Call Me Now
    </button>
  );
};
