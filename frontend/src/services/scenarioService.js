const API_BASE_URL = "http://localhost:3000/api";

export async function getScenarios() {
  const response = await fetch(`${API_BASE_URL}/scenarios`);

  if (!response.ok) {
    throw new Error(
      `Szenarien konnten nicht geladen werden: ${response.status}`
    );
  }

  return response.json();
}