export async function fetchStatus() {
  const res = await fetch(
    "https://crowdflow-backend-hj2vqfbcja-el.a.run.app/api/v1/status?lat=23.0225&lng=72.5714"
  );

  if (!res.ok) {
    throw new Error("API Error");
  }

  return res.json();
}