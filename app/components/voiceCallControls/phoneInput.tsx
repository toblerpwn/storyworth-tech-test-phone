import React, { useState } from "react";

type PhoneInputProps = {
  onDigitsChange?: (value: string | null) => void;
  className?: string;
};

export const PhoneInput = ({
  className = "",
  onDigitsChange,
}: PhoneInputProps) => {
  const [value, setValue] = useState("");

  const digitsString = (input: string): string | null => {
    const digits = input.replace(/\D/g, "");

    // return null if the string is empty OR not a number
    return digits.length === 0 || isNaN(Number(digits)) ? null : digits;
  };

  // Format the phone number as 123-456-7890
  const formatPhone = (input: string) => {
    const digits = digitsString(input);
    if (!digits) return null;

    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // console.log("Input value:", input);

    // TODO: handle invalid input, especially from keyboard predictions on mobile
    // e.g. (123) 456-7890, or +11234567890

    // TODO: handle international numbers

    // strip non-digit chars from input to test validity
    const digits = digitsString(input);
    // console.log("Digits value:", digits);

    if (!digits || digits.length === 0) {
      setValue("");
    } else {
      // send formatted value to local state for display
      const formattedValue = formatPhone(input);
      // console.log("Formatted value:", formattedValue);
      setValue(formattedValue || "");
    }

    // send only digits number to parent
    if (onDigitsChange) {
      onDigitsChange(digits);
    }
  };

  return (
    <input
      type="tel"
      className={`border border-[#9FB5AF] rounded-[8px] p-[12px] w-full placeholder:text-[#61706F] ${className}`}
      placeholder="123-456-7890"
      pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
      maxLength={12}
      minLength={12}
      required
      value={value}
      onChange={handleChange}
    />
  );
};
