import React from "react";
import Image from "next/image";

const LoadingCoin = ({
  label = "Loading...",
  size = 64,
}: {
  label?: string;
  size?: number;
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      {/* Rotating coin */}
      <div
        className="animate-spin rounded-full border-4 border-amber-400 border-t-transparent"
        style={{ width: size, height: size }}
      ></div>

      {/* Label */}
      <div className="flex flex-col items-center mt-4 text-gray-300 font-semibold text-lg animate-pulse">
        <p>{label}</p>
        <p>This may take some time</p>
      </div>     
    </div>
  );
};

export default LoadingCoin;
