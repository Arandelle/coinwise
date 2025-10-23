"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingCoin from "@/app/components/Loading";
import { Eye, EyeClosed, Lock, Mail, TriangleAlert } from "lucide-react";

export default function LoginModal() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [viewPass, setViewPass] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      setMessage("Successfully logged in");
      router.push("/dashboard");
    } catch (err) {
      setMessage(`Error logging in: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingCoin label="Logging in..." />;

  return (
    <form action="" onSubmit={handleLogin} className="space-y-5">
      {message && (
        <p className="flex items-center gap-2 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 px-4 py-3 rounded-xl shadow-sm transition-all duration-200">
          <TriangleAlert className="w-5 h-5 text-rose-500" />
          <span>{message}</span>
        </p>
      )}
      <div className="space-y-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Email address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="email"
            name="email"
            value={loginData.email}
            placeholder="example@gmail.com"
            className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
          />
        </div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type={`${viewPass ? "password" : "text"}`}
            name="password"
            value={loginData.password}
            placeholder={`${viewPass ? "••••••••" : "Enter your password"}`}
            className="w-full px-11 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
          <button
            type="button"
            onClick={() => setViewPass((prev) => !prev)}
            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 mb-2"
          >
            {viewPass ? (
              <EyeClosed className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label
            htmlFor="remember-me"
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              name="remember-me"
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
            <span className="text-sm text-slate-600">Remember me</span>
          </label>
          <a
            href="#"
            className="text-sm text-slate-600 hover:text-slate-700 font-medium"
          >
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 group cursor-pointer"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
