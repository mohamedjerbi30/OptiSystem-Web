const API_URL = 'http://localhost:8000/api';

/**
 * Call the Python backend to run a full spectral simulation
 * @param {Array} chain - The array of optical component objects
 * @returns {Promise<Object>} Contains spectrum data, power points, and metrics
 */
export async function simulateSpectrum(chain) {
  try {
    const response = await fetch(`${API_URL}/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Extract only what the backend needs to minimize payload
      body: JSON.stringify({
        chain: chain.map(c => ({
          id: c.id,
          type: c.type,
          label: c.label,
          shortLabel: c.shortLabel,
          category: c.category,
          params: Object.fromEntries(
            Object.entries(c.params).map(([key, p]) => [key, { value: p.value }])
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
