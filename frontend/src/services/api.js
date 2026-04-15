const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function simulateSpectrum(chain) {
  try {
    const response = await fetch(`${API_URL}/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chain: chain.map(c => ({
          id: c.id,
          type: c.type,
          label: c.label,
          shortLabel: c.shortLabel,
          category: c.category,
          params: Object.fromEntries(
            Object.entries(c.params).map(([key, p]) => [key, p.value ?? p])
          )
        }))
      })
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || `Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Simulation error:", error);
    throw error;
  }
}