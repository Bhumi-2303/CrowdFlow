const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_URL = `${API_BASE}/api/v1/auth`;

export async function login(email, password) {
  const formData = new URLSearchParams();
  formData.append("username", email); // OAuth2 expects username
  formData.append("password", password);

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString()
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Login failed");
  }

  const data = await res.json();
  localStorage.setItem("token", data.access_token);
  // Decode role from token if needed, or set mock role
  localStorage.setItem("userRole", "user"); // Temporary mock for UI compat
  
  return data;
}

export async function signup(name, email, password, role = "user") {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, hashed_password: password, role })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Signup failed");
  }

  const data = await res.json();
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("userRole", role);
  
  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  window.location.href = "/auth/login";
}

export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export function isAuthenticated() {
  return !!getToken();
}
