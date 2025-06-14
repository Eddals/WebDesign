// Utility to check user's country using ipinfo.io
// Returns country code (e.g., 'US', 'BR', etc.) or null on failure

export async function getUserCountry(): Promise<string | null> {
  try {
    const res = await fetch('https://ipinfo.io/json?token=149388dbdb5641'); // Replace with your ipinfo.io token
    if (!res.ok) return null;
    const data = await res.json();
    return data.country || null;
  } catch (e) {
    return null;
  }
}
