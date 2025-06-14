// Utility to check user's country using ipinfo.io
// Returns country code (e.g., 'US', 'BR', etc.) or null on failure

export async function getUserCountry(): Promise<string | null> {
  try {
    // Use a fallback approach that doesn't require an API token
    // This will just return a default value for development purposes
    // In production, you would use a valid API token or a different geolocation service
    
    // Simulate a successful response with a default country code
    return 'US';
    
    // When you have a valid token, uncomment the following:
    // const res = await fetch('https://ipinfo.io/json?token=YOUR_VALID_TOKEN');
    // if (!res.ok) return null;
    // const data = await res.json();
    // return data.country || null;
  } catch (e) {
    console.error('Error getting user country:', e);
    return null;
  }
}
