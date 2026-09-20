// Express stellt unseren HTTP-Server bereit.
import express from "express";

// CORS erlaubt die Kommunikation zwischen
// Frontend auf Port 5173 und Backend auf Port 3000.
import cors from "cors";

// Session-Verwaltung für Login und Benutzerzustand.
import session from "express-session";


// Authentifizierungs-Routen.
import authRoutes from "./routes/authRoutes.js";

// Scenario-Routen.
import scenarioRoutes from "./routes/scenarioRoutes.js";

// Trainingsversuche.
import attemptRoutes from "./routes/attemptRoutes.js";


// Erstellt benötigte Datenbanktabellen.
import {
    initDatabase
} from "./database/initDatabase.js";


// Fügt initiale Trainingsdaten ein.
import {
    seedDatabase
} from "./database/seedDatabase.js";


const app = express();


// ---------------------------------------------------------
// Datenbank vorbereiten
// ---------------------------------------------------------

// Tabellen erzeugen, falls sie noch nicht existieren.
initDatabase();

// Initiale Szenarien hinzufügen.
seedDatabase();


// ---------------------------------------------------------
// CORS
// ---------------------------------------------------------

app.use(
    cors({
        // Unser React/Vite-Frontend.
        origin: "http://localhost:5173",

        // Erlaubt Cookies bei Cross-Origin-Requests.
        credentials: true
    })
);


// ---------------------------------------------------------
// JSON Body Parser
// ---------------------------------------------------------

// Wandelt JSON-Request-Bodies automatisch
// in request.body um.
app.use(
    express.json()
);


// ---------------------------------------------------------
// Session-Konfiguration
// ---------------------------------------------------------

app.use(
    session({
        // In Produktion muss SESSION_SECRET gesetzt werden.
        secret:
            process.env.SESSION_SECRET ||
            "development-secret",

        // Session wird nicht unnötig gespeichert,
        // wenn sich nichts geändert hat.
        resave: false,

        // Für nicht eingeloggte Besucher wird nicht sofort
        // eine leere Session gespeichert.
        saveUninitialized: false,

        cookie: {
            // JavaScript im Browser kann den Cookie nicht auslesen.
            httpOnly: true,

            // Schutz gegen bestimmte Cross-Site-Anfragen.
            sameSite: "lax",

            // Für localhost bleibt secure false.
            // Bei HTTPS in Produktion muss dies true sein.
            secure: false
        }
    })
);


// ---------------------------------------------------------
// Health Check
// ---------------------------------------------------------

app.get(
    "/api/health",
    (request, response) => {

        response.status(200).json({
            status: "ok",
            message: "CyberSense-Backend läuft."
        });
    }
);


// ---------------------------------------------------------
// API-Routen
// ---------------------------------------------------------

// Trainingsszenarien.
app.use(
    "/api/scenarios",
    scenarioRoutes
);


// Registrierung, Login, Logout und /me.
app.use(
    "/api/auth",
    authRoutes
);


// Antworten und Trainingshistorie.
app.use(
    "/api/attempts",
    attemptRoutes
);


// ---------------------------------------------------------
// Fallback für unbekannte Endpunkte
// ---------------------------------------------------------

app.use(
    (request, response) => {

        response.status(404).json({
            message: "Endpunkt wurde nicht gefunden."
        });
    }
);


export default app;