"use client";

import { useState } from "react";
import StatusCard from "@/components/StatusCard";

export default function Monitoring() {
  const [selectedVenue, setSelectedVenue] = useState("1");

  // Mock data for the StatusCard
  const mockData = {
    crowd_density: { level: "high", value: 0.85 },
    waiting_time: { minutes: 45 },
    route: {
      estimated_time: 15,
      is_accessible: true,
      path: ["Entrance A", "Concourse B", "Section 104"],
    },
    alerts: [
      { severity: "high", message: "Capacity limit reached at North Gate." },
      { severity: "medium", message: "Elevator 3 is out of service." },
    ],
    ai_insights: {
      risk_level: "high",
      alert_message: "High density detected in food court. Consider opening additional concessions.",
      recommendations: [
        "Dispatch crowd control to Sector C.",
        "Update digital signage to reroute traffic.",
      ],
    },
    prediction: {
      value: 0.95,
      level: "high",
      recommendation: "Peak density expected in 15 mins. Prepare for overflow.",
      time_horizon: "15 min",
    },
    zones: [
      {
        name: "North Gate",
        location: { lat: 40.7130, lng: -74.0050 },
        crowd_density: { value: 0.9, level: "high" },
        waiting_time: { minutes: 20 },
        prediction: { level: "high" },
      },
      {
        name: "Food Court",
        location: { lat: 40.7125, lng: -74.0065 },
        crowd_density: { value: 0.6, level: "medium" },
        waiting_time: { minutes: 10 },
        prediction: { level: "high" },
      },
    ],
    metadata: {
      weather: "normal",
      traffic: "medium",
    },
    location: { lat: 40.7128, lng: -74.0060 },
    timestamp: Math.floor(Date.now() / 1000),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Monitoring</h1>
          <p className="text-gray-400 mt-1">Real-time crowd analytics and map view.</p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-300">Select Venue:</label>
          <select
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(e.target.value)}
          >
            <option value="1">Central Stadium</option>
            <option value="2">Downtown Arena</option>
          </select>
        </div>
      </div>

      {/* The StatusCard includes both the analytics and the MapView internally */}
      <div className="w-full">
        <StatusCard data={mockData} theme="dark" />
      </div>
    </div>
  );
}
