// Node-eigener Test Runner.
import {
    describe,
    test
} from "node:test";

// Assertions zum Vergleichen von erwarteten
// und tatsächlichen Ergebnissen.
import assert from "node:assert/strict";

// Supertest ermöglicht HTTP-Requests direkt gegen unsere Express-App.
import request from "supertest";

// Express-Anwendung.
import app from "../src/app.js";

// Direkter Datenbankzugriff wird hier nur im Test verwendet,
// um gezielt Testzustände herzustellen.
import database from "../src/database/database.js";


// =========================================================
// Attempt API Tests
// =========================================================

describe("Attempt API", () => {

    // -------------------------------------------------------
    // Testbenutzer erzeugen
    // -------------------------------------------------------

    function createTestUser() {
        // Zufälliger Wert verhindert doppelte E-Mail-Adressen
        // zwischen verschiedenen Testläufen.
        const uniqueValue =
            `${Date.now()}-${Math.random()}`;

        return {
            username: "AttemptTestUser",
            email:
                `attempt-${uniqueValue}@test.de`,
            password: "Test123!"
        };
    }


    // -------------------------------------------------------
    // Test-Szenario erzeugen
    // -------------------------------------------------------

    function createTestScenario() {
        return {
            senderName: "CyberSense Bank",
            senderEmail: "security@cybersense-bank.de",
            recipient: "test@test.de",
            subject: "Security warning",
            date: "2026-09-20 12:00",
            greeting: "Hello,",

            paragraphs: [
                "We noticed suspicious activity on your account.",
                "Please check your account immediately."
            ],

            actionText: "Check account",

            displayedUrl:
                "https://cybersense-bank.de",

            actualUrl:
                "https://phishing-example.test",

            signature:
                "CyberSense Bank Security",

            // Diese Antwort verwenden wir später,
            // um richtig/falsch zu testen.
            correctAnswer:
                "phishing",

            explanation:
                "The actual URL does not belong to the bank.",

            clues: [
                {
                    id: "fake-url",
                    title: "Suspicious URL",
                    description:
                        "The actual URL points to another domain."
                }
            ]
        };
    }


    // -------------------------------------------------------
    // Eingeloggten normalen Benutzer erzeugen
    // -------------------------------------------------------

    async function createLoggedInUserAgent() {
        const user =
            createTestUser();

        // Benutzer registrieren.
        const registerResponse =
            await request(app)
                .post("/api/auth/register")
                .send(user);

        assert.equal(
            registerResponse.status,
            201
        );


        // request.agent merkt sich Cookies.
        // Dadurch bleibt der Benutzer eingeloggt.
        const agent =
            request.agent(app);


        // Benutzer anmelden.
        const loginResponse =
            await agent
                .post("/api/auth/login")
                .send({
                    email: user.email,
                    password: user.password
                });

        assert.equal(
            loginResponse.status,
            200
        );


        return {
            agent,
            user,
            loginResponse
        };
    }


    // -------------------------------------------------------
    // Admin erzeugen
    // -------------------------------------------------------

    async function createAdminAgent() {
        const user =
            createTestUser();


        // Benutzer zunächst normal registrieren.
        const registerResponse =
            await request(app)
                .post("/api/auth/register")
                .send(user);

        assert.equal(
            registerResponse.status,
            201
        );


        // Im Test wird die Rolle direkt in der Datenbank geändert.
        const updateRole =
            database.prepare(`
        UPDATE users
        SET role = 'admin'
        WHERE email = ?
      `);

        updateRole.run(
            user.email
        );


        const agent =
            request.agent(app);


        // Danach als Admin anmelden.
        const loginResponse =
            await agent
                .post("/api/auth/login")
                .send({
                    email: user.email,
                    password: user.password
                });


        assert.equal(
            loginResponse.status,
            200
        );

        assert.equal(
            loginResponse.body.role,
            "admin"
        );


        return {
            agent,
            user
        };
    }


    // -------------------------------------------------------
    // Szenario über die API erzeugen
    // -------------------------------------------------------

    async function createScenarioForTest() {
        // Szenario-Erstellung ist geschützt.
        // Deshalb benötigen wir einen Admin.
        const {
            agent
        } =
            await createAdminAgent();


        const scenario =
            createTestScenario();


        const response =
            await agent
                .post("/api/scenarios")
                .send(scenario);


        assert.equal(
            response.status,
            201
        );


        // Neu erzeugtes Szenario zurückgeben.
        return response.body;
    }


    // =======================================================
    // AUTHENTIFIZIERUNG
    // =======================================================

    test(
        "rejects attempt creation without authentication",
        async () => {

            // Dafür reicht irgendeine ID.
            // requireAuth sollte bereits vorher abbrechen.
            const response =
                await request(app)
                    .post("/api/attempts")
                    .send({
                        scenarioId: 1,
                        selectedAnswer: "phishing"
                    });


            // Nicht eingeloggt -> Unauthorized.
            assert.equal(
                response.status,
                401
            );


            assert.equal(
                response.body.error,
                "Authentication required."
            );
        }
    );


    // =======================================================
    // VALIDIERUNG
    // =======================================================

    test(
        "rejects invalid scenario ID",
        async () => {

            const {
                agent
            } =
                await createLoggedInUserAgent();


            const response =
                await agent
                    .post("/api/attempts")
                    .send({
                        scenarioId: "not-a-number",
                        selectedAnswer: "phishing"
                    });


            assert.equal(
                response.status,
                400
            );


            assert.equal(
                response.body.error,
                "Invalid scenario ID."
            );
        }
    );


    test(
        "rejects invalid selected answer",
        async () => {

            const {
                agent
            } =
                await createLoggedInUserAgent();


            const response =
                await agent
                    .post("/api/attempts")
                    .send({
                        scenarioId: 1,
                        selectedAnswer: "maybe"
                    });


            assert.equal(
                response.status,
                400
            );


            assert.equal(
                response.body.error,
                "Invalid selected answer."
            );
        }
    );


    test(
        "returns 404 for unknown scenario",
        async () => {

            const {
                agent
            } =
                await createLoggedInUserAgent();


            const response =
                await agent
                    .post("/api/attempts")
                    .send({
                        scenarioId: 999999999,
                        selectedAnswer: "phishing"
                    });


            assert.equal(
                response.status,
                404
            );


            assert.equal(
                response.body.error,
                "Scenario not found."
            );
        }
    );


    // =======================================================
    // RICHTIGE ANTWORT
    // =======================================================

    test(
        "stores correct answer as correct attempt",
        async () => {

            // Szenario erzeugen.
            const scenario =
                await createScenarioForTest();


            // Normalen Benutzer anmelden.
            const {
                agent
            } =
                await createLoggedInUserAgent();


            // Richtige Antwort absenden.
            const response =
                await agent
                    .post("/api/attempts")
                    .send({
                        scenarioId: scenario.id,
                        selectedAnswer: "phishing"
                    });


            // Neue Attempt-Ressource wurde erstellt.
            assert.equal(
                response.status,
                201
            );


            // Szenario-ID muss stimmen.
            assert.equal(
                response.body.scenarioId,
                scenario.id
            );


            // Gesendete Antwort muss gespeichert worden sein.
            assert.equal(
                response.body.selectedAnswer,
                "phishing"
            );


            // Backend muss selbst erkannt haben,
            // dass die Antwort richtig ist.
            assert.equal(
                response.body.isCorrect,
                true
            );


            // Attempt besitzt eine Datenbank-ID.
            assert.ok(
                response.body.id
            );


            // Zeitstempel wurde automatisch erzeugt.
            assert.ok(
                response.body.createdAt
            );
        }
    );


    // =======================================================
    // FALSCHE ANTWORT
    // =======================================================

    test(
        "stores wrong answer as incorrect attempt",
        async () => {

            const scenario =
                await createScenarioForTest();


            const {
                agent
            } =
                await createLoggedInUserAgent();


            // Absichtlich falsche Antwort.
            const response =
                await agent
                    .post("/api/attempts")
                    .send({
                        scenarioId: scenario.id,
                        selectedAnswer: "legitim"
                    });


            assert.equal(
                response.status,
                201
            );


            assert.equal(
                response.body.selectedAnswer,
                "legitim"
            );


            // Backend muss erkennen,
            // dass "legitim" falsch ist.
            assert.equal(
                response.body.isCorrect,
                false
            );
        }
    );


    // =======================================================
    // /ME
    // =======================================================

    test(
        "rejects /me without authentication",
        async () => {

            const response =
                await request(app)
                    .get("/api/attempts/me");


            assert.equal(
                response.status,
                401
            );
        }
    );


    test(
        "returns attempts of authenticated user",
        async () => {

            const scenario =
                await createScenarioForTest();


            const {
                agent
            } =
                await createLoggedInUserAgent();


            // Zwei Antworten speichern.
            await agent
                .post("/api/attempts")
                .send({
                    scenarioId: scenario.id,
                    selectedAnswer: "phishing"
                });


            await agent
                .post("/api/attempts")
                .send({
                    scenarioId: scenario.id,
                    selectedAnswer: "legitim"
                });


            // Eigene Trainingshistorie abrufen.
            const response =
                await agent
                    .get("/api/attempts/me");


            assert.equal(
                response.status,
                200
            );


            // API muss ein Array liefern.
            assert.equal(
                Array.isArray(response.body),
                true
            );


            // Mindestens unsere zwei Versuche müssen vorhanden sein.
            assert.equal(
                response.body.length >= 2,
                true
            );


            // User-ID des eingeloggten Benutzers bestimmen.
            const userId =
                response.body[0].userId;


            // Jeder zurückgegebene Versuch muss
            // zu demselben Benutzer gehören.
            for (
                const attempt of response.body
                ) {
                assert.equal(
                    attempt.userId,
                    userId
                );
            }
        }
    );


    // =======================================================
    // DATENTRENNUNG ZWISCHEN BENUTZERN
    // =======================================================

    test(
        "/me only returns attempts of current user",
        async () => {

            const scenario =
                await createScenarioForTest();


            // ---------------------------------------------------
            // Benutzer A
            // ---------------------------------------------------

            const {
                agent: firstAgent
            } =
                await createLoggedInUserAgent();


            // Benutzer A beantwortet eine Aufgabe.
            const firstAttempt =
                await firstAgent
                    .post("/api/attempts")
                    .send({
                        scenarioId: scenario.id,
                        selectedAnswer: "phishing"
                    });


            assert.equal(
                firstAttempt.status,
                201
            );


            // ---------------------------------------------------
            // Benutzer B
            // ---------------------------------------------------

            const {
                agent: secondAgent
            } =
                await createLoggedInUserAgent();


            // Benutzer B beantwortet dieselbe Aufgabe.
            const secondAttempt =
                await secondAgent
                    .post("/api/attempts")
                    .send({
                        scenarioId: scenario.id,
                        selectedAnswer: "legitim"
                    });


            assert.equal(
                secondAttempt.status,
                201
            );


            // ---------------------------------------------------
            // Historie von Benutzer A abrufen
            // ---------------------------------------------------

            const firstUserAttempts =
                await firstAgent
                    .get("/api/attempts/me");


            assert.equal(
                firstUserAttempts.status,
                200
            );


            // Historie von Benutzer B abrufen.
            const secondUserAttempts =
                await secondAgent
                    .get("/api/attempts/me");


            assert.equal(
                secondUserAttempts.status,
                200
            );


            // User-IDs der beiden neu erzeugten Attempts.
            const firstUserId =
                firstAttempt.body.userId;

            const secondUserId =
                secondAttempt.body.userId;


            // Sicherheitsprüfung:
            // Es müssen wirklich zwei unterschiedliche Benutzer sein.
            assert.notEqual(
                firstUserId,
                secondUserId
            );


            // Alle Ergebnisse von Benutzer A
            // müssen auch wirklich Benutzer A gehören.
            for (
                const attempt of firstUserAttempts.body
                ) {
                assert.equal(
                    attempt.userId,
                    firstUserId
                );
            }


            // Alle Ergebnisse von Benutzer B
            // müssen entsprechend Benutzer B gehören.
            for (
                const attempt of secondUserAttempts.body
                ) {
                assert.equal(
                    attempt.userId,
                    secondUserId
                );
            }
        }
    );

});