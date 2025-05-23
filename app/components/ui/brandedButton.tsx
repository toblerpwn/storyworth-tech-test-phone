type BrandedButtonProps = {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export const BrandedButton = ({
  label,
  disabled = false,
  onClick,
  className = "",
}: BrandedButtonProps) => {
  return (
    <button
      disabled={disabled}
      type="button"
      className={`bg-[#07949D] text-white font-label uppercase font-bold tracking-[0.125em] rounded-full p-[12px] w-[185] max-h-12 shadow-[0px_4px_16px_rgba(0,0,0,0.10)] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
