import API_BASE_URL from "../config/api.js";


// ---------------------------------------------------------
// Szenario-API
// ---------------------------------------------------------

const SCENARIO_API_URL = `${API_BASE_URL}/scenarios`;


// ---------------------------------------------------------
// Alle Szenarien laden
// ---------------------------------------------------------

export async function getScenarios() {
    const response = await fetch(SCENARIO_API_URL, {
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Szenarien konnten nicht geladen werden.");
    }

    return response.json();
}


// ---------------------------------------------------------
// Einzelnes Szenario laden
// ---------------------------------------------------------

export async function getScenarioById(id) {
    const response = await fetch(
        `${SCENARIO_API_URL}/${id}`,
        {
            credentials: "include"
        }
    );

    if (!response.ok) {
        throw new Error("Das Szenario konnte nicht geladen werden.");
    }

    return response.json();
}


// ---------------------------------------------------------
// Neues Szenario erstellen
// ---------------------------------------------------------

export async function createScenario(scenario) {
    const response = await fetch(SCENARIO_API_URL, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        credentials: "include",

        body: JSON.stringify(scenario)
    });

    if (!response.ok) {
        throw new Error("Das Szenario konnte nicht erstellt werden.");
    }

    return response.json();
}


// ---------------------------------------------------------
// Bestehendes Szenario aktualisieren
// ---------------------------------------------------------

export async function updateScenario(id, scenario) {
    const response = await fetch(
        `${SCENARIO_API_URL}/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify(scenario)
        }
    );

    if (!response.ok) {
        throw new Error("Das Szenario konnte nicht aktualisiert werden.");
    }

    return response.json();
}


// ---------------------------------------------------------
// Szenario löschen
// ---------------------------------------------------------

export async function deleteScenario(id) {
    const response = await fetch(
        `${SCENARIO_API_URL}/${id}`,
        {
            method: "DELETE",
            credentials: "include"
        }
    );

    if (!response.ok) {
        throw new Error("Das Szenario konnte nicht gelöscht werden.");
    }

    // DELETE kann je nach Backend eine JSON-Antwort oder
    // eine leere Antwort zurückgeben.
    if (response.status === 204) {
        return null;
    }

    return response.json();
}