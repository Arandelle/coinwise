"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingCoin from "../components/Loading";

const Login = () => {
  const router = useRouter();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        setMessage("Login failed");
        setLoading(false);
        return;
      }

      setMessage("Successfully logged in");
      router.push("/dashboard");
    } catch (err) {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingCoin label="Logging in..."/>
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          placeholder="Enter your email"
        />
        <input
          type="password"
          value={loginData.password}
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
          placeholder="Enter password"
        />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Login;
