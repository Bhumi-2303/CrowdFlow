"use client";

import { useState } from "react";
import Card from "@/components/admin/Card";
import FormInput from "@/components/admin/FormInput";
import Button from "@/components/admin/Button";

export default function VenuesManagement() {
  const [venues, setVenues] = useState([
    { id: "1", name: "Central Stadium", latitude: "40.7128", longitude: "-74.0060", capacity: "50000" },
    { id: "2", name: "Downtown Arena", latitude: "34.0522", longitude: "-118.2437", capacity: "20000" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    capacity: "",
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    // TODO: Integrate with backend API (e.g. FastAPI POST /venues)
    const newVenue = {
      id: Math.random().toString(36).substring(7),
      ...formData,
    };
    setVenues([...venues, newVenue]);
    setFormData({ name: "", latitude: "", longitude: "", capacity: "" });
  };

  const handleDelete = (id) => {
    // TODO: Integrate with backend API (e.g. FastAPI DELETE /venues/{id})
    setVenues(venues.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Venue Management</h1>
        <p className="text-gray-400 mt-1">Add, update, and remove physical venues.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Add New Venue</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <FormInput
                label="Venue Name"
                placeholder="e.g. Central Stadium"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <FormInput
                label="Latitude"
                placeholder="e.g. 40.7128"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                required
              />
              <FormInput
                label="Longitude"
                placeholder="e.g. -74.0060"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                required
              />
              <FormInput
                label="Capacity"
                type="number"
                placeholder="e.g. 50000"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
              />
              <Button type="submit" className="w-full mt-2">
                Create Venue
              </Button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Existing Venues</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-sm">
                    <th className="pb-3 px-4 font-medium">Name</th>
                    <th className="pb-3 px-4 font-medium">Coordinates</th>
                    <th className="pb-3 px-4 font-medium">Capacity</th>
                    <th className="pb-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {venues.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500">
                        No venues found.
                      </td>
                    </tr>
                  ) : (
                    venues.map((venue) => (
                      <tr key={venue.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-medium text-white">{venue.name}</td>
                        <td className="py-3 px-4 text-gray-400 text-sm">
                          {venue.latitude}, {venue.longitude}
                        </td>
                        <td className="py-3 px-4 text-gray-400">{venue.capacity}</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="danger" onClick={() => handleDelete(venue.id)} className="px-3 py-1 text-sm">
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
