import React from "react";
import PublicHeader from "../components/PublicHeader";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <PublicHeader />
      {children}
    </div>
  );
};

export default layout;
