// app/signup/page.tsx
"use client";
import { useEffect, useState } from "react";
import { UserCreate } from "../../types/Users";
import {
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  TriangleAlert,
  User,
} from "lucide-react";

import { useRouter } from "next/navigation";

interface SignupFormProps {
  loading?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SignupForm({
  loading = false,
  setLoading = () => {},
}: SignupFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<UserCreate>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({
    type: "idle",
    message: "",
  });

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (status.type === "success") {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        // Auto redirect when countdown reaches 0
        router.push("/login");
      }
    }
  }, [status.type, countdown, router]);

  const handleRedirectNow = () => {
    router.push("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setStatus({
        type: "error",
        message: "Passwords do not match.",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          type: "success",
          message: "Account created successfully!",
        });
        setFormData({
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
        });
        setCountdown(5); // Reset countdown
      } else {
        setStatus({
          type: "error",
          message: data.error || "Signup failed. Please try again.",
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: "Server error. Please check your connection.",
      });
      console.log("Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Success Message with Redirect */}
      {status.type === "success" && (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 mb-6 space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-900 text-lg mb-1">
                Welcome to CoinWise!
              </h3>
              <p className="text-emerald-700 text-sm">
                Your account has been created successfully. You can now log in
                and start your financial journey.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <p className="text-sm text-emerald-600">
              Redirecting in <span className="font-bold text-lg">{countdown}</span>s
            </p>
            <button
              type="button"
              onClick={handleRedirectNow}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 group"
            >
              Go to Login
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {status.type === "error" && (
        <div className="flex items-center gap-2 text-sm font-medium border-2 px-4 py-3 rounded-xl shadow-sm transition-all duration-200 bg-rose-50 text-rose-600 border-rose-200 mb-6">
          <TriangleAlert className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <span>{status.message}</span>
        </div>
      )}

      <div className="space-y-5">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="JohnDoe07"
              className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
              required
              disabled={loading}
            />
          </div>
        </div>

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
              disabled={loading}
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
              placeholder="Enter your password"
              className="w-full pl-11 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              disabled={loading}
            >
              {showPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
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
              placeholder="Enter your password again"
              className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Terms & Conditions */}
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 mt-0.5 accent-emerald-500 cursor-pointer"
            required
            disabled={loading}
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}