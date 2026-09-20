// Express Router gruppiert alle /api/attempts-Endpunkte.
import { Router } from "express";

import {
    requireAuth
} from "../middleware/authMiddleware.js";

import {
    createAttempt,
    findAttemptsByUserId
} from "../repositories/attemptRepository.js";

import {
    findScenarioById
} from "../repositories/scenarioRepository.js";


const router = Router();


// CyberSense unterscheidet im Training nur zwischen
// legitimen Nachrichten und Phishing-Nachrichten.
const allowedAnswers = [
    "legitim",
    "phishing"
];


// ---------------------------------------------------------
// POST /api/attempts
// Trainingsantwort speichern
// ---------------------------------------------------------

router.post(
    "/",
    requireAuth,
    (request, response) => {

        /*
         * Die Benutzer-ID stammt ausschließlich aus der Session.
         * Dadurch kann der Client keinen Versuch für einen
         * anderen Benutzer speichern.
         */
        const userId =
            request.session.userId;

        const {
            scenarioId,
            selectedAnswer
        } = request.body;

        const parsedScenarioId =
            Number(scenarioId);


        // Szenario-ID validieren.
        if (
            !Number.isInteger(parsedScenarioId) ||
            parsedScenarioId <= 0
        ) {
            return response.status(400).json({
                error: "Invalid scenario ID."
            });
        }


        // Nur die beiden Trainingsantworten sind erlaubt.
        if (
            !allowedAnswers.includes(selectedAnswer)
        ) {
            return response.status(400).json({
                error: "Invalid selected answer."
            });
        }


        // Das zu beantwortende Szenario muss existieren.
        const scenario =
            findScenarioById(parsedScenarioId);

        if (!scenario) {
            return response.status(404).json({
                error: "Scenario not found."
            });
        }


        /*
         * Sicherheitsrelevant:
         *
         * Das Frontend übermittelt nur die ausgewählte Antwort.
         * Ob diese richtig ist, entscheidet ausschließlich
         * das Backend anhand des gespeicherten Szenarios.
         */
        const isCorrect =
            selectedAnswer ===
            scenario.correctAnswer;


        const attempt =
            createAttempt({
                userId,
                scenarioId:
                parsedScenarioId,
                selectedAnswer,
                isCorrect
            });


        // 201 = Trainingsversuch wurde gespeichert.
        return response.status(201).json(
            attempt
        );
    }
);


// ---------------------------------------------------------
// GET /api/attempts/me
// Eigene Trainingsversuche laden
// ---------------------------------------------------------

router.get(
    "/me",
    requireAuth,
    (request, response) => {

        // Benutzer wird über seine Session bestimmt.
        const userId =
            request.session.userId;

        const attempts =
            findAttemptsByUserId(userId);

        return response.status(200).json(
            attempts
        );
    }
);


export default router;