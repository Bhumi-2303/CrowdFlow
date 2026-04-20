"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    // Mock authentication
    localStorage.setItem("userRole", role);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md glass-dark rounded-2xl p-8 border border-white/10 shadow-2xl animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-400 text-sm">Sign in to your CrowdFlow account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                required
              />
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-sm font-medium text-gray-300">Login As</label>
              <div className="flex gap-4">
                <label className="flex-1 relative">
                  <input
                    type="radio"
                    value="user"
                    checked={role === "user"}
                    onChange={(e) => setRole(e.target.value)}
                    className="peer sr-only"
                  />
                  <div className="text-center px-4 py-2.5 rounded-lg border border-white/10 cursor-pointer transition-all peer-checked:bg-blue-500/20 peer-checked:border-blue-500/50 peer-checked:text-blue-400 text-gray-400 hover:bg-white/5">
                    User
                  </div>
                </label>
                <label className="flex-1 relative">
                  <input
                    type="radio"
                    value="admin"
                    checked={role === "admin"}
                    onChange={(e) => setRole(e.target.value)}
                    className="peer sr-only"
                  />
                  <div className="text-center px-4 py-2.5 rounded-lg border border-white/10 cursor-pointer transition-all peer-checked:bg-blue-500/20 peer-checked:border-blue-500/50 peer-checked:text-blue-400 text-gray-400 hover:bg-white/5">
                    Admin
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/25 mt-4"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
