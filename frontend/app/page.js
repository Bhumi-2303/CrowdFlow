"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchStatus } from "../services/api"; // ✅ safe relative import
import StatusCard from "../components/StatusCard";

const REFRESH_MS = 5000;

// ─────────────────────────────────────────────────────────────
// Sun / Moon SVG icons (inline, zero-dependency)
// ─────────────────────────────────────────────────────────────
function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1"  x2="12" y2="3"  />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"   />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1"  y1="12" x2="3"  y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const [data,      setData]      = useState(null);
  const [error,     setError]     = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [countdown, setCountdown] = useState(REFRESH_MS / 1000);
  const [mounted,   setMounted]   = useState(false);
  const [theme,     setTheme]     = useState("dark"); // "dark" | "light"

  // ── Hydration guard ──────────────────────────────────────
  useEffect(() => { setMounted(true); }, []);

  // ── Load persisted theme on mount ───────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("cf-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  // ── Apply theme class to <body> ──────────────────────────
  useEffect(() => {
    document.body.classList.remove("theme-dark", "theme-light");
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem("cf-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // ── Data fetching ────────────────────────────────────────
  const load = useCallback(async () => {
    try {
      const result = await fetchStatus();
      setData(result);
      setError(null);
      setCountdown(REFRESH_MS / 1000);
    } catch (err) {
      setError("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, REFRESH_MS);
    return () => clearInterval(interval);
  }, [load]);

  // ── Countdown timer ──────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? REFRESH_MS / 1000 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  // ── Computed theme tokens ────────────────────────────────
  const isDark = theme === "dark";

  const pageBg       = isDark ? "bg-[#0a0f1e]"     : "bg-[#f8fafc]";
  const headerBg     = isDark ? "bg-[#0a0f1e]/90"  : "bg-white/80";
  const headerBorder = isDark ? "border-slate-800/80" : "border-slate-200/80";
  const titleText    = isDark ? "text-white"        : "text-slate-900";
  const subText      = isDark ? "text-slate-500"    : "text-slate-500";
  const toggleBg     = isDark
    ? "bg-slate-800 hover:bg-slate-700 text-amber-300"
    : "bg-slate-100 hover:bg-slate-200 text-slate-700";
  const footerText   = isDark ? "text-slate-700"    : "text-slate-400";
  const footerBorder = isDark ? "border-slate-800/50" : "border-slate-200/50";
  const skeletonBg   = isDark ? "bg-slate-800/60"   : "bg-slate-200/70";

  return (
    <main className={`min-h-screen transition-colors duration-300 ${pageBg}`}>

      {/* ── Sticky Header ─────────────────────────────────────── */}
      <header className={`border-b ${headerBorder} ${headerBg} backdrop-blur-md sticky top-0 z-20`}>
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-violet-500/30 flex-shrink-0">
              CF
            </div>
            <div>
              <h1 className={`text-sm font-bold tracking-tight ${titleText}`}>CrowdFlow</h1>
              <p className={`text-xs ${subText}`}>AI-powered venue intelligence</p>
            </div>
          </div>

          {/* Right: Live badge + countdown + theme toggle */}
          <div className="flex items-center gap-4">

            {/* Live badge */}
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider hidden sm:inline">
                Live
              </span>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg className="w-3 h-3 text-violet-400 animate-spin" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="tabular-nums">
                <span className="text-violet-400 font-semibold">{countdown}s</span>
              </span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer ${toggleBg} theme-icon-enter`}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

        </div>
      </header>

      {/* ── Page Body ─────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-5 py-8">

        {/* Page heading */}
        <div className="mb-8 animate-fade-in">
          <h2 className={`text-2xl font-bold mb-1 ${titleText}`}>Live Venue Status</h2>
          <p className={`text-sm ${subText}`}>
            Real-time crowd intelligence · auto-refreshes every {REFRESH_MS / 1000}s
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[200, 160, 160, 120, 120, 80].map((h, i) => (
              <div
                key={i}
                className={`rounded-2xl animate-pulse ${skeletonBg} ${i === 0 ? "md:col-span-2" : ""}`}
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-center animate-fade-in">
            <p className="text-3xl mb-3">⚠️</p>
            <p className="text-red-400 font-semibold">{error}</p>
            <p className="text-slate-500 text-xs mt-2">Check that the backend server is running</p>
          </div>
        )}

        {/* Main content */}
        {!loading && !error && data && (
          <StatusCard data={data} theme={theme} />
        )}

      </div>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className={`text-center text-xs py-8 border-t mt-8 ${footerText} ${footerBorder}`}>
        CrowdFlow © 2026 · AI-powered venue intelligence
      </footer>

    </main>
  );
}