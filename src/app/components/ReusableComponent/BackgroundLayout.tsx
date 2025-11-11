import Image from "next/image";
import React from "react";

const BackgroundLayout = ({children} : {children: React.ReactNode}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 text-8xl">📊</div>
        <div className="absolute top-32 right-14 text-6xl">💰</div>
        <div className="absolute bottom-44 right-20 text-7xl">✍</div>
        <div className="absolute bottom-32 left-12 text-5xl">✨</div>
        <Image
          src={"/CoinwiseLogo_v7.png"}
          alt="coinwise_logo"
          width={300}
          height={300}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="max-w-7xl mx-auto py-6">

        {children}

      </div>
    </div>
  );
};

export default BackgroundLayout;
