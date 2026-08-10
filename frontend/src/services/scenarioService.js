const API_BASE_URL = "http://localhost:3000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.errors?.join(" ") ??
      data?.message ??
      `Die Anfrage ist fehlgeschlagen: ${response.status}`;

    throw new Error(message);
  }

  return data;
}

export function getScenarios() {
  return request("/scenarios");
}

export function getScenario(id) {
  return request(`/scenarios/${id}`);
}

export function createScenario(scenario) {
  return request("/scenarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(scenario)
  });
}

export function updateScenario(id, scenario) {
  return request(`/scenarios/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(scenario)
  });
}

export function deleteScenario(id) {
  return request(`/scenarios/${id}`, {
    method: "DELETE"
  });
}
