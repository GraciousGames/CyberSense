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

export async function createScenario(scenario) {
  const response = await fetch(`${API_BASE_URL}/scenarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(scenario)
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data.errors?.join(" ") ??
      data.message ??
      "Das Szenario konnte nicht gespeichert werden.";

    throw new Error(message);
  }

  return data;
}