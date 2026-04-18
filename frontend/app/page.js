"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchStatus } from "../services/api"; // ✅ safe relative import
import StatusCard from "../components/StatusCard";

const REFRESH_MS = 5000;

export default function HomePage() {
  const [data,      setData]      = useState(null);
  const [error,     setError]     = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [countdown, setCountdown] = useState(REFRESH_MS / 1000);
  const [mounted,   setMounted]   = useState(false);

  // Prevent hydration issues
  useEffect(() => { setMounted(true); }, []);

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

  // Initial load + polling
  useEffect(() => {
    load();
    const interval = setInterval(load, REFRESH_MS);
    return () => clearInterval(interval);
  }, [load]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? REFRESH_MS / 1000 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">

      {/* ── Sticky Header ─────────────────────────────────────── */}
      <header className="border-b border-slate-800/80 bg-[#0a0f1e]/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-violet-500/25">
              CF
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">CrowdFlow</h1>
              <p className="text-xs text-slate-500">AI-powered venue intelligence</p>
            </div>
          </div>

          {/* Refresh countdown */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <svg
              className="w-3 h-3 text-violet-400 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Refreshing in{" "}
            <span className="text-violet-400 font-semibold tabular-nums">{countdown}s</span>
          </div>

        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Page heading */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">Live Venue Status</h2>
          <p className="text-sm text-slate-500">
            Real-time crowd intelligence · auto-refreshes every {REFRESH_MS / 1000}s
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-5">
            {[200, 120, 120, 80].map((h, i) => (
              <div
                key={i}
                className="rounded-2xl bg-slate-800/60 animate-pulse"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-center">
            <p className="text-2xl mb-2">⚠️</p>
            <p className="text-red-400 font-semibold text-sm">{error}</p>
            <p className="text-slate-500 text-xs mt-1">Check that the backend server is running</p>
          </div>
        )}

        {/* Main content */}
        {!loading && !error && data && (
          <StatusCard data={data} />
        )}

      </div>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="text-center text-xs text-slate-700 py-8 border-t border-slate-800/50 mt-8">
        CrowdFlow © 2026 · AI-powered venue intelligence
      </footer>

    </main>
  );
}