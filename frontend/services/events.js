export async function browseEvents() {
  const token = localStorage.getItem("token") || "mock-token";
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  try {
    const res = await fetch(`${API_URL}/api/v1/user/events`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchEventDetails(id) {
  // Mock data for individual event details
  return {
    id,
    name: "Championship Finals",
    venue_id: "venue-1",
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 7200000).toISOString(),
    expected_attendance: 50000,
    live_status: {
      crowd_density: { level: "high", value: 0.8 },
      wait_time: 15,
      zones: [
        { name: "North Gate", location: { lat: 40.7130, lng: -74.0050 }, crowd_density: { value: 0.9, level: "high" }, waiting_time: { minutes: 20 }, prediction: { level: "high" } },
        { name: "South Gate", location: { lat: 40.7125, lng: -74.0065 }, crowd_density: { value: 0.4, level: "low" }, waiting_time: { minutes: 5 }, prediction: { level: "low" } }
      ]
    }
  };
}

export async function getUserBookings() {
  const token = localStorage.getItem("token") || "mock-token";
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  try {
    const res = await fetch(`${API_URL}/api/v1/user/bookings`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function createBooking(bookingData) {
  const token = localStorage.getItem("token") || "mock-token";
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return fetch(`${API_URL}/api/v1/user/bookings`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(bookingData)
  }).then(res => res.json());
}
