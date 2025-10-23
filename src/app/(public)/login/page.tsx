"use client";

import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

export default function CoinWiseAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Branding & Features */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-12 text-white relative overflow-hidden hidden md:flex flex-col justify-between">
          {/* Background decorations */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 text-9xl">💰</div>
            <div className="absolute bottom-20 left-10 text-8xl">📊</div>
            <div className="absolute top-1/2 left-1/3 text-6xl">💵</div>
          </div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <Image
                src="/CoinwiseLogo_v7.png"
                alt="CoinWise Logo"
                width={50}
                height={50}
              />
              <span className="text-3xl font-bold">CoinWise</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Your Journey to Financial Freedom Starts Here
            </h1>
            <p className="text-lg text-emerald-50 mb-12">
              Join thousands who have transformed their finances with AI-powered
              insights and smart budgeting.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {[
                "Track expenses automatically with AI",
                "Set and achieve financial goals",
                "Get personalized money-saving tips",
                "Join community challenges",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-emerald-50">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-3 gap-4 relative z-10">
            <div>
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-sm text-emerald-100">Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold">$2.5M</div>
              <div className="text-sm text-emerald-100">Saved</div>
            </div>
            <div>
              <div className="text-3xl font-bold">4.9★</div>
              <div className="text-sm text-emerald-100">Rating</div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          {/* Mobile Logo */}
          <div className="flex md:hidden items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              CoinWise
            </span>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 mb-8 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isLogin
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${
                !isLogin
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {isLogin ? "Welcome Back!" : "Create Account"}
            </h2>
            <p className="text-slate-600">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Start your financial transformation today"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name - Sign Up Only */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password - Sign Up Only */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password - Login Only */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Forgot Password?
                </a>
              </div>
            )}

            {/* Terms - Sign Up Only */}
            {!isLogin && (
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 accent-emerald-500 cursor-pointer"
                  required
                />
                <span className="text-sm text-slate-600">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 group"
            >
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

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
            <button className="py-3 px-4 border-2 border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-slate-700">
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
              Google
            </button>
            <button className="py-3 px-4 border-2 border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-slate-700">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          {/* Footer Text */}
          <p className="text-center text-sm text-slate-600 mt-8">
            {isLogin ? `Don't have an account?` : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              {isLogin ? "Sign up for free" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
