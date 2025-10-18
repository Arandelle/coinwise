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
      <p className="mt-4 text-gray-700 font-semibold text-lg animate-pulse">
        {label}
      </p>
    </div>
  );
};

export default LoadingCoin;
