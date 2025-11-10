import AuthModal from "@/app/components/AuthPages/AuthForm";
import SignupForm from "@/app/components/AuthPages/SignupForm";
import React from "react";

const page = () => {
  return (
    <AuthModal>
      <SignupForm />
    </AuthModal>
  );
};

export default page;
