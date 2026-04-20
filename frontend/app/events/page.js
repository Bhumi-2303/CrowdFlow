"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import { browseEvents } from "@/services/events";

export default function BrowseEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Mock events or fetch from backend
      const data = await browseEvents();
      if (data.length === 0) {
        // Provide mock data if backend empty/offline
        setEvents([
          { _id: "1", name: "Championship Finals", venue_id: "Main Stadium", start_time: new Date().toISOString(), expected_attendance: 55000 },
          { _id: "2", name: "Summer Music Fest", venue_id: "North Arena", start_time: new Date(Date.now() + 86400000).toISOString(), expected_attendance: 20000 }
        ]);
      } else {
        setEvents(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-24">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Upcoming Events</h1>
          <p className="text-gray-400">Browse live and upcoming events to monitor crowd levels and get smart routes.</p>
        </div>

        {loading ? (
          <div className="flex gap-4">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="text-gray-400">Loading events...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => (
              <EventCard key={evt.id || evt._id} event={evt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
