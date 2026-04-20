"use client";

import { useState } from "react";
import FormInput from "@/components/admin/FormInput";
import Button from "@/components/admin/Button";

export default function EventForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(initialData || {
    name: "",
    venue_id: "",
    start_time: "",
    end_time: "",
    expected_attendance: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.venue_id) return;
    
    // Ensure correct types
    const submission = {
      ...formData,
      expected_attendance: parseInt(formData.expected_attendance) || 0,
      start_time: new Date(formData.start_time).toISOString(),
      end_time: new Date(formData.end_time).toISOString(),
    };
    
    onSubmit(submission);
    if (!initialData) {
      setFormData({ name: "", venue_id: "", start_time: "", end_time: "", expected_attendance: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Event Name"
        placeholder="e.g. World Cup Final"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <FormInput
        label="Venue ID"
        placeholder="e.g. 60f1b..."
        value={formData.venue_id}
        onChange={(e) => setFormData({ ...formData, venue_id: e.target.value })}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Start Time"
          type="datetime-local"
          value={formData.start_time}
          onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
          required
        />
        <FormInput
          label="End Time"
          type="datetime-local"
          value={formData.end_time}
          onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
          required
        />
      </div>
      <FormInput
        label="Expected Attendance"
        type="number"
        placeholder="e.g. 50000"
        value={formData.expected_attendance}
        onChange={(e) => setFormData({ ...formData, expected_attendance: e.target.value })}
      />
      <Button type="submit" className="w-full mt-2">
        {initialData ? "Update Event" : "Create Event"}
      </Button>
    </form>
  );
}
