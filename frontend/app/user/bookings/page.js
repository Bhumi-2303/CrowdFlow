"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Card from "@/components/admin/Card";
import Button from "@/components/admin/Button";
import Link from "next/link";
import { getUserBookings } from "@/services/events";

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getUserBookings();
      if (data.length === 0) {
        setBookings([
          { _id: "b1", event_id: "1", event_name: "Championship Finals", status: "confirmed", ticket_count: 2 },
          { _id: "b2", event_id: "2", event_name: "Summer Music Fest", status: "pending", ticket_count: 1 }
        ]);
      } else {
        setBookings(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-24">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">My Bookings</h1>
          <p className="text-gray-400">Manage your registered events and monitor live conditions before you arrive.</p>
        </div>

        {loading ? (
          <div className="flex gap-4">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 animate-fade-in">
            {bookings.map((booking) => (
              <Card key={booking._id} className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{booking.event_name || `Event ${booking.event_id}`}</h3>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400">Tickets: {booking.ticket_count}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      booking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                      booking.status === 'cancelled' ? 'bg-rose-500/20 text-rose-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <Link href={`/events/${booking.event_id}`}>
                    <Button variant="outline" className="w-full md:w-auto">Live Status</Button>
                  </Link>
                  <Button variant="danger" className="w-full md:w-auto" onClick={() => alert("Cancel logic would execute here")}>Cancel</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
