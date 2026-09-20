// Basisadresse des CyberSense-Backends.
const API_BASE_URL =
    "http://localhost:3000/api";


// ---------------------------------------------------------
// Trainingsantwort speichern
// ---------------------------------------------------------

export async function createAttempt({
                                        scenarioId,
                                        selectedAnswer
                                    }) {

    const response = await fetch(
        `${API_BASE_URL}/attempts`,
        {
            // Neue Attempt-Ressource erstellen.
            method: "POST",

            // Session-Cookie an das Backend senden.
            credentials: "include",

            // Request enthält JSON.
            headers: {
                "Content-Type": "application/json"
            },

            // Nur Szenario und ausgewählte Antwort senden.
            //
            // isCorrect wird absichtlich NICHT übertragen.
            // Das Backend berechnet dies selbst.
            body: JSON.stringify({
                scenarioId,
                selectedAnswer
            })
        }
    );


    // Antwort des Servers auslesen.
    const data =
        await response.json();


    // Fehler des Backends als JavaScript Error weitergeben.
    if (!response.ok) {

        throw new Error(
            data.error ??
            data.message ??
            "Das Trainingsergebnis konnte nicht gespeichert werden."
        );
    }


    // Gespeicherten Versuch zurückgeben.
    return data;
}


// ---------------------------------------------------------
// Eigene Versuche laden
// ---------------------------------------------------------

export async function getMyAttempts() {

    const response = await fetch(
        `${API_BASE_URL}/attempts/me`,
        {
            // Session-Cookie mitsenden.
            credentials: "include"
        }
    );


    const data =
        await response.json();


    if (!response.ok) {
        throw new Error(
            data.error ??
            data.message ??
            "Die Trainingsergebnisse konnten nicht geladen werden."
        );
    }


    return data;
}