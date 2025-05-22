import React from "react";

export const Divider = ({
  className = "w-full mx-8 my-2",
}: {
  className?: string;
}) => {
  return <div className={`h-[1px] bg-[#CCCECE] ${className}`} />;
};

export default Divider;
