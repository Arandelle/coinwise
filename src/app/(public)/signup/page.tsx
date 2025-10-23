import AuthModal from "@/app/components/Auth/AuthForm";
import SignupForm from "@/app/components/Auth/SignupForm";
import React from "react";

const page = () => {
  return (
    <AuthModal>
      <SignupForm />
    </AuthModal>
  );
};

export default page;
