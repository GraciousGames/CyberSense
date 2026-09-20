// Basis-URL unseres Backends.
// Alle Scenario-Endpunkte beginnen mit /api/scenarios.
const API_BASE_URL = "http://localhost:3000/api";


// ---------------------------------------------------------
// Hilfsfunktion für Fehlermeldungen
// ---------------------------------------------------------

// Liest die JSON-Antwort des Backends aus und erzeugt
// eine verständliche Fehlermeldung.
async function handleErrorResponse(response, fallbackMessage) {
  let data = {};

  try {
    // Versucht die JSON-Fehlermeldung des Backends zu lesen.
    data = await response.json();
  } catch {
    // Falls keine JSON-Antwort vorhanden ist,
    // bleibt data einfach ein leeres Objekt.
  }

  // Unser Backend verwendet hauptsächlich das Feld "error".
  // Zusätzlich unterstützen wir "message" und "errors".
  const message =
      data.error ??
      data.errors?.join(" ") ??
      data.message ??
      fallbackMessage;

  throw new Error(message);
}


// ---------------------------------------------------------
// Alle Szenarien laden
// ---------------------------------------------------------

export async function getScenarios() {
  // Öffentliche GET-Anfrage an das Backend.
  const response = await fetch(
      `${API_BASE_URL}/scenarios`
  );

  // Bei einem HTTP-Fehler wird eine verständliche
  // Fehlermeldung erzeugt.
  if (!response.ok) {
    await handleErrorResponse(
        response,
        "Die Szenarien konnten nicht geladen werden."
    );
  }

  // Die Scenario-Liste wird als JavaScript-Array zurückgegeben.
  return response.json();
}


// ---------------------------------------------------------
// Einzelnes Szenario laden
// ---------------------------------------------------------

export async function getScenarioById(id) {
  // Lädt genau ein Szenario anhand seiner ID.
  const response = await fetch(
      `${API_BASE_URL}/scenarios/${id}`
  );

  // Fehler wie 400 oder 404 werden an die Oberfläche weitergegeben.
  if (!response.ok) {
    await handleErrorResponse(
        response,
        "Das Szenario konnte nicht geladen werden."
    );
  }

  // Gibt das gefundene Szenario zurück.
  return response.json();
}


// ---------------------------------------------------------
// Neues Szenario erstellen
// ---------------------------------------------------------

export async function createScenario(scenario) {
  const response = await fetch(
      `${API_BASE_URL}/scenarios`,
      {
        // POST wird verwendet, um eine neue Ressource anzulegen.
        method: "POST",

        // Wichtig:
        // Dadurch wird der Session-Cookie mitgeschickt.
        // Ohne credentials erkennt das Backend den Admin nicht.
        credentials: "include",

        // Wir senden JSON an das Backend.
        headers: {
          "Content-Type": "application/json"
        },

        // Das JavaScript-Objekt wird in JSON umgewandelt.
        body: JSON.stringify(scenario)
      }
  );

  // Fehler wie 401, 403 oder 400 werden sauber verarbeitet.
  if (!response.ok) {
    await handleErrorResponse(
        response,
        "Das Szenario konnte nicht gespeichert werden."
    );
  }

  // Das Backend liefert das neu erstellte Szenario zurück.
  return response.json();
}


// ---------------------------------------------------------
// Bestehendes Szenario bearbeiten
// ---------------------------------------------------------

export async function updateScenario(id, scenario) {
  const response = await fetch(
      `${API_BASE_URL}/scenarios/${id}`,
      {
        // PUT ersetzt die gespeicherten Daten des Szenarios.
        method: "PUT",

        // Session-Cookie für die Admin-Prüfung mitsenden.
        credentials: "include",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(scenario)
      }
  );

  if (!response.ok) {
    await handleErrorResponse(
        response,
        "Das Szenario konnte nicht aktualisiert werden."
    );
  }

  // Das Backend liefert die aktualisierte Version zurück.
  return response.json();
}


// ---------------------------------------------------------
// Szenario löschen
// ---------------------------------------------------------

export async function deleteScenario(id) {
  const response = await fetch(
      `${API_BASE_URL}/scenarios/${id}`,
      {
        // DELETE entfernt die Ressource.
        method: "DELETE",

        // Auch Löschen darf nur ein angemeldeter Admin.
        credentials: "include"
      }
  );

  if (!response.ok) {
    await handleErrorResponse(
        response,
        "Das Szenario konnte nicht gelöscht werden."
    );
  }

  // Gibt die Bestätigung des Backends zurück.
  return response.json();
}