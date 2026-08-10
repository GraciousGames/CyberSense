const API_URL = "http://localhost:3000/api/auth";

export async function registerUser(username, email, password) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
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

export async function loginUser(email, password) {
    const response = await fetch(`${API_URL}/login`, {
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

export async function getCurrentUser() {
    const response = await fetch(`${API_URL}/me`, {
        credentials: "include"
    });

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Benutzer konnte nicht geladen werden.");
    }

    return response.json();
}

export async function logoutUser() {
    const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Abmeldung fehlgeschlagen.");
    }
}