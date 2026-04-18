"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchStatus } from "../services/api"; // ✅ safe relative import
import StatusCard from "../components/StatusCard";

const REFRESH_MS = 5000;

export default function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(REFRESH_MS / 1000);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const load = useCallback(async () => {
    try {
      const result = await fetchStatus();
      setData(result);
      setError(null);
      setCountdown(REFRESH_MS / 1000);
    } catch (err) {
      setError("Failed to connect backend");
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
      setCountdown((prev) =>
        prev <= 1 ? REFRESH_MS / 1000 : prev - 1
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">

      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0a0f1e]/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-sm font-bold">
              CF
            </div>
            <div>
              <h1 className="text-sm font-bold">CrowdFlow</h1>
              <p className="text-xs text-slate-500">
                AI-powered venue intelligence
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-600">
            Refreshing in{" "}
            <span className="text-violet-400 font-semibold">
              {countdown}s
            </span>
          </div>

        </div>
      </header>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 py-8">

        <h2 className="text-2xl font-bold mb-6">
          Live Venue Status
        </h2>

        {loading && (
          <div className="text-center py-20">
            <p className="text-slate-400">Loading...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <StatusCard data={data} />
        )}

      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-600 py-6">
        CrowdFlow © 2026
      </footer>

    </main>
  );
}