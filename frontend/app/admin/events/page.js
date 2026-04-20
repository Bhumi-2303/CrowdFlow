"use client";

import { useState, useEffect } from "react";
import Card from "@/components/admin/Card";
import Button from "@/components/admin/Button";
import EventForm from "@/components/EventForm";
import { fetchEvents, createEvent, deleteEvent } from "@/services/api";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    const data = await fetchEvents();
    if (data.length === 0) {
      setEvents([
        { _id: "1", name: "Championship Finals", venue_id: "venue-1", expected_attendance: 55000, start_time: new Date().toISOString() }
      ]);
    } else {
      setEvents(data);
    }
  }

  const handleCreate = async (eventData) => {
    try {
      const newEvt = await createEvent(eventData);
      setEvents([...events, newEvt]);
    } catch {
      // Fallback for mock
      setEvents([...events, { _id: Math.random().toString(), ...eventData }]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
    } catch {}
    setEvents(events.filter(e => e._id !== id && e.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
        <p className="text-gray-400 mt-1">Create, edit, and remove upcoming events.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
            <EventForm onSubmit={handleCreate} />
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Scheduled Events</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-sm">
                    <th className="pb-3 px-4 font-medium">Event Name</th>
                    <th className="pb-3 px-4 font-medium">Venue</th>
                    <th className="pb-3 px-4 font-medium">Date</th>
                    <th className="pb-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500">
                        No events found.
                      </td>
                    </tr>
                  ) : (
                    events.map((evt) => (
                      <tr key={evt._id || evt.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-medium text-white">{evt.name}</td>
                        <td className="py-3 px-4 text-gray-400 text-sm">{evt.venue_id}</td>
                        <td className="py-3 px-4 text-gray-400 text-sm">{new Date(evt.start_time).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="danger" onClick={() => handleDelete(evt._id || evt.id)} className="px-3 py-1 text-sm">
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
