"use client";

import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white selection:bg-blue-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-6">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-blue-300 font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Live Crowd Intelligence is Here
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-gray-500 animate-fade-in" style={{ animationDelay: "100ms" }}>
            AI-Powered Crowd <br className="hidden md:block" /> Management System
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10 animate-fade-in" style={{ animationDelay: "200ms" }}>
            Optimize event operations with real-time density tracking, predictive AI analytics, and dynamic route recommendations for sports venues and mega-events.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
            {role ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/25"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/25"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  Login to Account
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative z-10 px-6 bg-black/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Intelligence</h2>
            <p className="text-gray-400">Everything you need to monitor, analyze, and direct crowds safely.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon="📡"
              title="Real-Time Tracking"
              description="Monitor crowd density and wait times across all venue zones instantly using a live updating dashboard."
            />
            <FeatureCard 
              icon="🔮"
              title="Predictive AI"
              description="Stay ahead of bottlenecks. Our AI forecasts peak traffic times and provides actionable recommendations."
            />
            <FeatureCard 
              icon="🗺️"
              title="Route Optimization"
              description="Dynamically route attendees through the venue with accessible, low-density pathways calculated on the fly."
            />
          </div>
        </div>
      </section>

      {/* Mini Mock Dashboard Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="glass-dark rounded-2xl border border-white/10 p-2 md:p-4 shadow-2xl overflow-hidden group">
            <div className="rounded-xl border border-white/5 bg-slate-900/50 aspect-video flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500">🏢</div>
              <h3 className="text-xl font-bold text-gray-300">CrowdFlow Dashboard Preview</h3>
              <p className="text-gray-500 text-sm mt-2">Sign in to access live map data and metrics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500 border-t border-white/5">
        <p>© 2026 CrowdFlow Intelligence. All rights reserved.</p>
      </footer>
    </div>
  );
}
