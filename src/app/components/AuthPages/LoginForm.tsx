"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Eye, EyeClosed, Loader2, Lock, Mail, TriangleAlert } from "lucide-react";

interface FormProps {
  loading?: boolean,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginModal({loading = false, setLoading = () => {}} : FormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // get email from URL params
  const emailFromURL = searchParams.get('email') || "";

  const [loginData, setLoginData] = useState({ 
    email: emailFromURL, // pre-fill email from url
    password: "" 
  });
  const [viewPass, setViewPass] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(!!emailFromURL);

  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error",
    message: string
  }>({
    type: "idle",
    message: ""
  });

  useEffect(() => {
    if(emailFromURL){
      setLoginData(prev => ({
        ...prev, 
        email: emailFromURL
      }));
      setShowWelcomeMessage(true);
    }
  }, [emailFromURL]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      setStatus({
        type: "success",
        message: "Successfully logged in",
      });
      router.push("/dashboard");
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form action="" onSubmit={handleLogin} className="space-y-5">

       {/* Welcome Message for New Users */}
      {showWelcomeMessage && (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-900 text-sm">
              Account created successfully!
            </p>
            <p className="text-emerald-700 text-xs mt-1">
              Please enter your password to log in.
            </p>
          </div>
        </div>
      )}


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
            id="email"
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
            type={`${viewPass ? "text" : "password"}`}
            name="password"
            id="password"
            value={loginData.password}
            placeholder={`${viewPass ? "Enter your password" : "••••••••"}`}
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
              <Eye className="w-5 h-5" />
            ) : (
              <EyeClosed className="w-5 h-5" />
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
              id="remember-me"
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
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 group cursor-pointer"
        >
          {loading ? (
             <><Loader2 className="text-slate-600 w-5 h-5 animate-spin"/> Logging in...</>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
}
