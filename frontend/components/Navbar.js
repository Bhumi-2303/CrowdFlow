"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) {
      setRole(savedRole);
    }
  }, [pathname]); // Re-check when route changes

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    setRole(null);
    router.push("/");
  };

  return (
    <nav className="fixed w-full z-50 bg-[#0a0f1e]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              CF
            </div>
            <span className="font-bold text-lg text-white tracking-tight">CrowdFlow</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className={`transition-colors ${pathname === '/' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>Home</Link>
          <Link href="/#features" className="text-gray-400 hover:text-white transition-colors">Features</Link>
        </div>

        <div className="flex items-center gap-4">
          {role ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors border border-white/5"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
