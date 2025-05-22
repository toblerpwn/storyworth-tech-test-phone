import React from "react";

export const Divider = ({ className = "" }: { className?: string }) => {
  return <div className={`h-[1px] bg-[#CCCECE] ${className}`} />;
};

export default Divider;
