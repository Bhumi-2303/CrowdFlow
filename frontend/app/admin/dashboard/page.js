"use client";

import { useEffect, useState } from "react";
import AdminDashboard from "@/components/AdminDashboard";
import { fetchAdminOverview } from "@/services/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await fetchAdminOverview();
      setStats([
        { title: "Total Venues", value: data.totalVenues, icon: "🏢", change: "+1 this month" },
        { title: "Total Events", value: data.totalEvents, icon: "🎉", change: "2 upcoming" },
        { title: "Active Alerts", value: data.activeAlerts, icon: "🚨", change: "-1 from yesterday", isAlert: true },
        { title: "Total Capacity", value: `${Math.round(data.totalCapacity / 1000)}K`, icon: "👥", change: "Across all venues" },
      ]);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1">Monitor real-time status across all venues.</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: Just now
        </div>
      </div>
      
      {stats.length > 0 ? (
        <AdminDashboard stats={stats} />
      ) : (
        <div className="animate-pulse bg-white/5 h-64 rounded-xl"></div>
      )}
    </div>
  );
}
