// app/signup/page.tsx
"use client";
import { useState } from "react";
import { UserCreate } from "../../types/Users";
import {
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  TriangleAlert,
  User,
} from "lucide-react";
import LoadingCoin from "../Loading";

export default function SignupForm() {
  const [formData, setFormData] = useState<UserCreate>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<{
    loading: boolean;
    type: "idle" | "success" | "error";
    message: string;
  }>({
    loading: false,
    type: "idle",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, type: "idle", message: "" });

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          loading: false,
          type: "success",
          message: "Successfully created an account! You can now log in.",
        });
      } else {
        setStatus({
          loading: false,
          type: "error",
          message: data.error || "Signup failed. Please try again.",
        });
      }
    } catch (err) {
      setStatus({
        loading: false,
        type: "error",
        message: "Server error. Please check your connection.",
      });

      console.log("Error: ", err)
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (status.loading) return <LoadingCoin label="Logging in..." />;

  return (
    <form onSubmit={handleSubmit}>
      {status.type !== "idle" && (
        <p
          className={`flex items-center gap-2 text-sm font-medium border px-4 py-3 rounded-xl shadow-sm transition-all duration-200 ${
            status.type === "success"
              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
              : "bg-rose-50 text-rose-600 border-rose-200"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          ) : (
            <TriangleAlert className="w-5 h-5 text-rose-500" />
          )}
          <span>{status.message}</span>
        </p>
      )}

      <div className="space-y-5">
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
            placeholder="John Doe"
            className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
            required
          />
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
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

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 mt-0.5 accent-emerald-500 cursor-pointer"
            required
          />
          <span className="text-sm text-slate-600">
            I agree to the
            <a
              href="#"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Terms of Service
            </a>
            and
            <a
              href="#"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Privacy Policy
            </a>
          </span>
        </label>

        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 group cursor-pointer"
        >
          Create Account
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </form>
  );
}
