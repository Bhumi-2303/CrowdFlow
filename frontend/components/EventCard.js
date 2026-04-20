"use client";

import Link from "next/link";
import Card from "@/components/admin/Card";
import Button from "@/components/admin/Button";

export default function EventCard({ event }) {
  const dateStr = new Date(event.start_time).toLocaleDateString(undefined, { 
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  return (
    <Card className="flex flex-col h-full border border-white/10 hover:border-blue-500/30">
      <div className="flex-1">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md">
            Upcoming
          </span>
          <span className="text-sm text-gray-500">{dateStr}</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>
        <p className="text-gray-400 text-sm mb-4">
          <span className="inline-block mr-2">📍 Venue ID: {event.venue_id}</span>
          <span className="inline-block">👥 Expected: {event.expected_attendance?.toLocaleString() || "N/A"}</span>
        </p>
      </div>
      <div className="mt-auto pt-4 border-t border-white/5">
        <Link href={`/events/${event.id || event._id}`} className="block w-full">
          <Button variant="outline" className="w-full justify-center">
            View Live Details & Routing
          </Button>
        </Link>
      </div>
    </Card>
  );
}
