"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CheckCircle, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type WithLoadingProps = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthModal = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const pathName = usePathname();
  const route = useRouter();
  const isLogin = pathName === "/login";
  const [loading, setLoading] = useState(false);

  const handleNavigate = () => {
    alert(
      "This authentication currently not available. Please try again later!"
    );
  };

  const handleBack = () => {
    if (window.history.length > 1){
      route.back();
    } else {
      route.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-300 via-teal-300 to-blue-300 flex items-center justify-center p-0 md:p-4">
      {/** Wrapper with relative positioning for the X button */}
      <div className="relative w-full max-w-6xl">
        <button onClick={handleBack}>
          <X className="absolute top-2 right-2 md:-top-4 md:-right-4 w-8 h-8 md:w-10 md:h-10 p-2 text-emerald-500 border border-emerald-300 hover:text-emerald-700 hover:border-emerald-400 cursor-pointer bg-white rounded-full transition-all duration-200 z-50" />
        </button>

        <div className="grid md:grid-cols-2 gap-0 bg-white md:rounded-3xl shadow-2xl md:overflow-hidden relative">
          {/**Left side - branding and features */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-12 text-white relative overflow-hidden md:flex flex-col justify-between">
            {/** Background decoration */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 right-2 md:right-10 text-6xl md:text-9xl">💰</div>
              <div className="absolute bottom-10 left-10 text-7xl">💸</div>
              <div className="absolute top-1/2 left-1/2 text-6xl -translate-x-1/2 -translate-y-1/2">
                🤖
              </div>
            </div>

            {/** Body and header */}
            <div className="relative z-10">
              {/** Logo */}
              <div className="flex items-center gap-3 mb-12">
                <Image
                  src="/CoinwiseLogo_v7.png"
                  alt="coinwise_logo"
                  height={50}
                  width={50}
                />
                <span className="font-bold text-2xl md:text-3xl">Coinwise</span>
              </div>
              {/** Headline */}
              <h1 className="text-2xl md:text-4xl font-bold mb-6 leading-tight">
                Your journey for financial freedom starts here.
              </h1>
              <p className="text-md md:text-lg text-emerald-50 mb-12">
                Join thousands who have transformed their finances with
                AI-powered insights and smart budgeting.
              </p>
              {/** Features */}
              <div className="space-y-4">
                {[
                  "Track expenses automatically with AI",
                  "Set and achieve financial goals",
                  "Get personalized money-saving tips",
                  "Join weekly challenges",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-emerald-50">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/**Bottom Stats */}
            <div className="hidden md:grid grid-cols-3 gap-4 relative z-10">
              {[
                { label: "Users", value: "50K+" },
                { label: "Saved", value: "$2.5M+" },
                { label: "Rating", value: "4.8⭐" },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-emerald-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/** Right Side */}
          <div
            className={`p-8 md:p-12 flex flex-col justify-center ${
              loading && "opacity-50 pointer-events-none"
            }`}
          >
            {/* Tab Switcher */}
            <div className="flex gap-2 mb-8 bg-slate-100 p-1 rounded-xl">
              {[
                { href: "/login", text: "Login" },
                { href: "/signup", text: "Signup" },
              ].map((button, index) => (
                <Link
                  key={index}
                  href={button.href}
                  className={`flex-1 text-center py-3 rounded-lg font-semibold transition-all duration-200 ${
                    pathName === `${button.href}`
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {button.text}
                </Link>
              ))}
            </div>

            {/* Welcome Text */}
            <div className="mb-8">
              <h2 className="text-xl md:text-3xl font-bold text-slate-900 mb-2">
                {isLogin ? "Welcome Back!" : "Create Account"}
              </h2>
              <p className="text-sm md:text-md text-slate-600">
                {!isLogin
                  ? "Enter your credentials to access your account"
                  : "Start your financial transformation today"}
              </p>
            </div>

            {/** Form  */}
            {React.isValidElement(children) &&
              React.cloneElement(
                children as React.ReactElement<WithLoadingProps>,
                {
                  loading,
                  setLoading,
                }
              )}

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  svg: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  ),
                  title: "Google",
                },
                {
                  svg: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                  title: "Facebook",
                },
              ].map((button, index) => (
                <button
                  key={index}
                  onClick={handleNavigate}
                  className="py-3 px-4 border-2 border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-slate-700 cursor-pointer"
                >
                  {button.svg}
                  <span className="hidden md:block">{button.title}</span>
                </button>
              ))}
            </div>

            {/* Footer Text */}
            <p className="flex flex-col md:flex-row items-center justify-center text-center text-sm text-slate-600 mt-8">
              {isLogin ? `Don't have an account?` : "Already have an account? "}
              <Link
                href={isLogin ? "/signup" : "/login"}
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                {isLogin ? "Sign up for free" : "Sign in"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
