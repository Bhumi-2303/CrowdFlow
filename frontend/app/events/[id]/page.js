"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import MapView from "@/components/MapView";
import RouteRecommender from "@/components/RouteRecommender";
import Card from "@/components/admin/Card";
import Button from "@/components/admin/Button";
import { fetchEventDetails, createBooking } from "@/services/events";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState("");

  useEffect(() => {
    async function load() {
      const data = await fetchEventDetails(id);
      setEvent(data);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleBook = async () => {
    setBookingStatus("Booking...");
    try {
      await createBooking({ event_id: id, ticket_count: 1 });
      setBookingStatus("Registered!");
    } catch {
      setBookingStatus("Error. Try again.");
    }
  };

  if (loading || !event) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col items-center justify-center">
        <Navbar />
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Mock routes based on live status
  const mockRoutes = [
    { title: "Fastest Entry", eta: 12, path: ["Main Road", "East Concourse", "Gate 4"], accessible: false },
    { title: "Avoid Crowds", eta: 15, path: ["Parking C", "South Tunnel", "Gate 2"], accessible: true }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col">
      <Navbar />
      
      {/* Header Banner */}
      <div className="bg-slate-900/50 border-b border-white/5 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase rounded flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live
              </span>
              <span className="text-gray-400 text-sm font-medium">{new Date(event.start_time).toDateString()}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2">{event.name}</h1>
            <p className="text-gray-400 font-medium">📍 Venue: {event.venue_id} | 👥 {event.expected_attendance?.toLocaleString() || 0} Expected</p>
          </div>
          <Button onClick={handleBook} disabled={bookingStatus !== ""}>
            {bookingStatus || "Register for Event"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Live Status & Map */}
        <div className="lg:col-span-2 space-y-8 animate-fade-in">
          <Card className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Overall Crowd Density</h3>
              <p className="text-4xl font-bold text-white mb-2">
                {Math.round(event.live_status.crowd_density.value * 100)}%
              </p>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                event.live_status.crowd_density.level === 'high' ? 'bg-rose-500/20 text-rose-400' :
                event.live_status.crowd_density.level === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {event.live_status.crowd_density.level}
              </span>
            </div>
            <div className="h-16 w-px bg-white/10 hidden md:block"></div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Current Wait Time</h3>
              <p className="text-4xl font-bold text-white mb-2">{event.live_status.wait_time} <span className="text-xl">min</span></p>
              <span className="text-xs text-gray-500">Average across all gates</span>
            </div>
          </Card>

          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-800">
            <MapView 
              lat={40.7128} 
              lng={-74.0060} 
              density={event.live_status.crowd_density.value}
              zones={event.live_status.zones} 
            />
          </div>
        </div>

        {/* Right Column: AI Recommendations & Routing */}
        <div className="space-y-6 animate-fade-in">
          <RouteRecommender recommendations={mockRoutes} />
          
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">Live Zone Status</h3>
            <div className="space-y-3">
              {event.live_status.zones.map((zone, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-sm font-medium">{zone.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-400">{zone.waiting_time.minutes}m</span>
                    <div className={`w-2 h-2 rounded-full ${
                      zone.crowd_density.level === 'high' ? 'bg-rose-500' :
                      zone.crowd_density.level === 'medium' ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
