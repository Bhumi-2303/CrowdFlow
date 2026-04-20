export async function fetchStatus(userId) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const res = await fetch(
    `${API_URL}/api/v1/status?user_id=${userId}`
  );

  if (!res.ok) {
    throw new Error("API Error");
  }

  return res.json();
}

export async function fetchAdminOverview() {
  // Mock data for AdminDashboard
  return {
    totalVenues: 5,
    totalEvents: 12,
    activeAlerts: 3,
    totalCapacity: 150000
  };
}

export async function fetchVenues() {
  const token = localStorage.getItem("token") || "mock-token";
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return fetch(`${API_URL}/api/v1/admin/venues`, {
    headers: { "Authorization": `Bearer ${token}` }
  }).then(res => res.ok ? res.json() : []);
}

export async function createVenue(venueData) {
  const token = localStorage.getItem("token") || "mock-token";
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return fetch(`${API_URL}/api/v1/admin/venues`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(venueData)
  }).then(res => res.json());
}

export async function fetchEvents() {
  const token = localStorage.getItem("token") || "mock-token";
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return fetch(`${API_URL}/api/v1/admin/events`, {
    headers: { "Authorization": `Bearer ${token}` }
  }).then(res => res.ok ? res.json() : []);
}

export async function createEvent(eventData) {
  const token = localStorage.getItem("token") || "mock-token";
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return fetch(`${API_URL}/api/v1/admin/events`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(eventData)
  }).then(res => res.json());
}

export async function deleteEvent(id) {
  const token = localStorage.getItem("token") || "mock-token";
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return fetch(`${API_URL}/api/v1/admin/events/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
}