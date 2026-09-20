import API_BASE_URL from "../config/api.js";

// Alle Authentifizierungs-Endpunkte liegen unter /api/auth.
const AUTH_API_URL = `${API_BASE_URL}/auth`;


/*
 * Registriert einen neuen Benutzer.
 */
export async function registerUser(username, email, password) {
    const response = await fetch(`${AUTH_API_URL}/register`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        credentials: "include",

        body: JSON.stringify({
            username,
            email,
            password
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Registrierung fehlgeschlagen."
        );
    }

    return data;
}


/*
 * Meldet einen Benutzer an.
 *
 * credentials: "include" sorgt dafür, dass der Session-Cookie
 * vom Browser gespeichert und bei weiteren Requests verwendet wird.
 */
export async function loginUser(email, password) {
    const response = await fetch(`${AUTH_API_URL}/login`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        credentials: "include",

        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Anmeldung fehlgeschlagen."
        );
    }

    return data;
}


/*
 * Lädt den aktuell angemeldeten Benutzer.
 *
 * Eine 401-Antwort bedeutet hier lediglich, dass momentan
 * keine aktive Anmeldung besteht.
 */
export async function getCurrentUser() {
    const response = await fetch(`${AUTH_API_URL}/me`, {
        credentials: "include"
    });

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error(
            "Benutzer konnte nicht geladen werden."
        );
    }

    return response.json();
}


/*
 * Beendet die aktuelle Sitzung.
 */
export async function logoutUser() {
    const response = await fetch(`${AUTH_API_URL}/logout`, {
        method: "POST",

        credentials: "include"
    });

    if (!response.ok) {
        throw new Error(
            "Abmeldung fehlgeschlagen."
        );
    }
}