"use client";

import { useState } from "react";
import Card from "@/components/admin/Card";
import FormInput from "@/components/admin/FormInput";
import Button from "@/components/admin/Button";

export default function ZonesManagement() {
  // Hardcoded for UI demo
  const [venues] = useState([
    { id: "1", name: "Central Stadium" },
    { id: "2", name: "Downtown Arena" },
  ]);

  const [zones, setZones] = useState([
    { id: "z1", name: "North Gate", venueId: "1", capacityLimit: "5000" },
    { id: "z2", name: "Food Court A", venueId: "1", capacityLimit: "1200" },
    { id: "z3", name: "Main Entrance", venueId: "2", capacityLimit: "3000" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    venueId: venues[0]?.id || "",
    capacityLimit: "",
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.venueId) return;

    // TODO: Integrate with backend API (e.g. FastAPI POST /zones)
    const newZone = {
      id: Math.random().toString(36).substring(7),
      ...formData,
    };
    setZones([...zones, newZone]);
    setFormData({ name: "", venueId: venues[0]?.id || "", capacityLimit: "" });
  };

  const handleDelete = (id) => {
    // TODO: Integrate with backend API (e.g. FastAPI DELETE /zones/{id})
    setZones(zones.filter(z => z.id !== id));
  };

  const getVenueName = (id) => venues.find(v => v.id === id)?.name || "Unknown Venue";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Zone Management</h1>
        <p className="text-gray-400 mt-1">Configure zones within your venues.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Add New Zone</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <FormInput
                label="Zone Name"
                placeholder="e.g. North Gate"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <FormInput
                label="Select Venue"
                type="select"
                value={formData.venueId}
                onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
                required
              >
                {venues.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </FormInput>
              <FormInput
                label="Capacity Limit"
                type="number"
                placeholder="e.g. 5000"
                value={formData.capacityLimit}
                onChange={(e) => setFormData({ ...formData, capacityLimit: e.target.value })}
                required
              />
              <Button type="submit" className="w-full mt-2">
                Create Zone
              </Button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Existing Zones</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-sm">
                    <th className="pb-3 px-4 font-medium">Zone Name</th>
                    <th className="pb-3 px-4 font-medium">Venue</th>
                    <th className="pb-3 px-4 font-medium">Capacity Limit</th>
                    <th className="pb-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500">
                        No zones found.
                      </td>
                    </tr>
                  ) : (
                    zones.map((zone) => (
                      <tr key={zone.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-medium text-white">{zone.name}</td>
                        <td className="py-3 px-4 text-gray-400 text-sm">
                          <span className="inline-block px-2 py-1 bg-white/5 rounded-md">
                            {getVenueName(zone.venueId)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400">{zone.capacityLimit}</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="danger" onClick={() => handleDelete(zone.id)} className="px-3 py-1 text-sm">
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
