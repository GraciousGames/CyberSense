import { describe, test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../src/app.js";
import database from "../src/database/database.js";

describe("Scenario API", () => {

    function createTestUser() {
        const uniqueValue = `${Date.now()}-${Math.random()}`;

        return {
            username: "ScenarioTestUser",
            email: `scenario-${uniqueValue}@test.de`,
            password: "Test123!"
        };
    }

    function createTestScenario() {
        return {
            senderName: "PayPal Security",
            senderEmail: "security@example.com",
            recipient: "test@cybersense.de",
            subject: "Unusual login attempt",
            date: "2026-09-20 10:00",
            greeting: "Hello,",
            paragraphs: [
                "We detected an unusual login attempt.",
                "Please verify your account."
            ],
            actionText: "Verify account",
            displayedUrl: "https://paypal.com/security",
            actualUrl: "https://example-phishing-site.com",
            signature: "PayPal Security Team",
            correctAnswer: "phishing",
            explanation: "The actual URL does not belong to PayPal.",
            clues: [
                {
                    id: "suspicious-url",
                    title: "Suspicious URL",
                    description: "The visible URL and actual URL are different."
                }
            ]
        };
    }

    async function createLoggedInUserAgent() {
        const user = createTestUser();

        const registerResponse = await request(app)
            .post("/api/auth/register")
            .send(user);

        assert.equal(registerResponse.status, 201);

        const agent = request.agent(app);

        const loginResponse = await agent
            .post("/api/auth/login")
            .send({
                email: user.email,
                password: user.password
            });

        assert.equal(loginResponse.status, 200);

        return {
            agent,
            user
        };
    }

    async function createAdminAgent() {
        const user = createTestUser();

        const registerResponse = await request(app)
            .post("/api/auth/register")
            .send(user);

        assert.equal(registerResponse.status, 201);

        const updateRole = database.prepare(`
            UPDATE users
            SET role = 'admin'
            WHERE email = ?
        `);

        updateRole.run(user.email);

        const agent = request.agent(app);

        const loginResponse = await agent
            .post("/api/auth/login")
            .send({
                email: user.email,
                password: user.password
            });

        assert.equal(loginResponse.status, 200);
        assert.equal(loginResponse.body.role, "admin");

        return {
            agent,
            user
        };
    }

    test("returns all scenarios", async () => {
        const response = await request(app)
            .get("/api/scenarios");

        assert.equal(response.status, 200);
        assert.equal(Array.isArray(response.body), true);
    });

    test("rejects scenario creation without authentication", async () => {
        const scenario = createTestScenario();

        const response = await request(app)
            .post("/api/scenarios")
            .send(scenario);

        assert.equal(response.status, 401);
        assert.equal(
            response.body.error,
            "Authentication required."
        );
    });

    test("rejects scenario creation for normal users", async () => {
        const {
            agent
        } = await createLoggedInUserAgent();

        const scenario = createTestScenario();

        const response = await agent
            .post("/api/scenarios")
            .send(scenario);

        assert.equal(response.status, 403);
        assert.equal(
            response.body.error,
            "Admin access required."
        );
    });

    test("allows admin to create a scenario", async () => {
        const {
            agent
        } = await createAdminAgent();

        const scenario = createTestScenario();

        const response = await agent
            .post("/api/scenarios")
            .send(scenario);

        assert.equal(response.status, 201);

        assert.equal(
            response.body.senderName,
            scenario.senderName
        );

        assert.equal(
            response.body.senderEmail,
            scenario.senderEmail
        );

        assert.equal(
            response.body.subject,
            scenario.subject
        );

        assert.equal(
            response.body.correctAnswer,
            scenario.correctAnswer
        );

        assert.equal(
            Array.isArray(response.body.clues),
            true
        );

        assert.equal(
            response.body.clues.length,
            1
        );

        assert.ok(response.body.id);

        await agent
            .delete(`/api/scenarios/${response.body.id}`);
    });

    test("allows admin to update a scenario", async () => {
        const {
            agent
        } = await createAdminAgent();

        const scenario = createTestScenario();

        const createResponse = await agent
            .post("/api/scenarios")
            .send(scenario);

        assert.equal(createResponse.status, 201);

        const scenarioId = createResponse.body.id;

        const updatedScenario = {
            ...scenario,
            subject: "Updated phishing subject",
            explanation: "Updated explanation.",
            clues: [
                {
                    id: "updated-clue",
                    title: "Updated clue",
                    description: "This clue was added during the update."
                },
                {
                    id: "second-clue",
                    title: "Second clue",
                    description: "Another suspicious indicator."
                }
            ]
        };

        const updateResponse = await agent
            .put(`/api/scenarios/${scenarioId}`)
            .send(updatedScenario);

        assert.equal(updateResponse.status, 200);

        assert.equal(
            updateResponse.body.id,
            scenarioId
        );

        assert.equal(
            updateResponse.body.subject,
            "Updated phishing subject"
        );

        assert.equal(
            updateResponse.body.explanation,
            "Updated explanation."
        );

        assert.equal(
            updateResponse.body.clues.length,
            2
        );

        assert.equal(
            updateResponse.body.clues[0].id,
            "updated-clue"
        );

        assert.equal(
            updateResponse.body.clues[1].id,
            "second-clue"
        );

        await agent
            .delete(`/api/scenarios/${scenarioId}`);
    });

    test("really replaces clues when updating a scenario", async () => {
        const {
            agent
        } = await createAdminAgent();

        const scenario = createTestScenario();

        const createResponse = await agent
            .post("/api/scenarios")
            .send(scenario);

        assert.equal(createResponse.status, 201);

        const scenarioId = createResponse.body.id;

        assert.equal(
            createResponse.body.clues.length,
            1
        );

        const updatedScenario = {
            ...scenario,
            clues: [
                {
                    id: "new-clue-one",
                    title: "New clue one",
                    description: "First replacement clue."
                },
                {
                    id: "new-clue-two",
                    title: "New clue two",
                    description: "Second replacement clue."
                }
            ]
        };

        const updateResponse = await agent
            .put(`/api/scenarios/${scenarioId}`)
            .send(updatedScenario);

        assert.equal(updateResponse.status, 200);

        assert.equal(
            updateResponse.body.clues.length,
            2
        );

        const clueIds = updateResponse.body.clues.map(
            clue => clue.id
        );

        assert.deepEqual(
            clueIds,
            [
                "new-clue-one",
                "new-clue-two"
            ]
        );

        assert.equal(
            clueIds.includes("suspicious-url"),
            false
        );

        await agent
            .delete(`/api/scenarios/${scenarioId}`);
    });

    test("allows admin to delete a scenario", async () => {
        const {
            agent
        } = await createAdminAgent();

        const scenario = createTestScenario();

        const createResponse = await agent
            .post("/api/scenarios")
            .send(scenario);

        assert.equal(createResponse.status, 201);

        const scenarioId = createResponse.body.id;

        const deleteResponse = await agent
            .delete(`/api/scenarios/${scenarioId}`);

        assert.equal(deleteResponse.status, 200);

        assert.equal(
            deleteResponse.body.message,
            "Scenario deleted successfully."
        );

        const getResponse = await request(app)
            .get(`/api/scenarios/${scenarioId}`);

        assert.equal(getResponse.status, 404);
    });

    test("rejects update without authentication", async () => {
        const scenario = createTestScenario();

        const response = await request(app)
            .put("/api/scenarios/1")
            .send(scenario);

        assert.equal(response.status, 401);
    });

    test("rejects delete without authentication", async () => {
        const response = await request(app)
            .delete("/api/scenarios/1");

        assert.equal(response.status, 401);
    });

    test("rejects invalid scenario ID", async () => {
        const response = await request(app)
            .get("/api/scenarios/not-a-number");

        assert.equal(response.status, 400);

        assert.equal(
            response.body.error,
            "Invalid scenario ID."
        );
    });

    test("returns 404 for unknown scenario", async () => {
        const response = await request(app)
            .get("/api/scenarios/999999999");

        assert.equal(response.status, 404);

        assert.equal(
            response.body.error,
            "Scenario not found."
        );
    });

    test("rejects scenario with missing required fields", async () => {
        const {
            agent
        } = await createAdminAgent();

        const response = await agent
            .post("/api/scenarios")
            .send({
                senderName: "Incomplete Scenario"
            });

        assert.equal(response.status, 400);

        assert.equal(
            response.body.error,
            "Required scenario fields are missing."
        );
    });

    test("rejects scenario with invalid correct answer", async () => {
        const {
            agent
        } = await createAdminAgent();

        const scenario = createTestScenario();

        scenario.correctAnswer = "definitely-safe";

        const response = await agent
            .post("/api/scenarios")
            .send(scenario);

        assert.equal(response.status, 400);

        assert.equal(
            response.body.error,
            "Invalid correct answer."
        );
    });

    test("rejects scenario when paragraphs is not an array", async () => {
        const {
            agent
        } = await createAdminAgent();

        const scenario = createTestScenario();

        scenario.paragraphs = "This should be an array.";

        const response = await agent
            .post("/api/scenarios")
            .send(scenario);

        assert.equal(response.status, 400);

        assert.equal(
            response.body.error,
            "Paragraphs must be an array."
        );
    });

    test("rejects scenario when clues is not an array", async () => {
        const {
            agent
        } = await createAdminAgent();

        const scenario = createTestScenario();

        scenario.clues = "invalid";

        const response = await agent
            .post("/api/scenarios")
            .send(scenario);

        assert.equal(response.status, 400);

        assert.equal(
            response.body.error,
            "Clues must be an array."
        );
    });

    test("returns 404 when admin updates unknown scenario", async () => {
        const {
            agent
        } = await createAdminAgent();

        const scenario = createTestScenario();

        const response = await agent
            .put("/api/scenarios/999999999")
            .send(scenario);

        assert.equal(response.status, 404);

        assert.equal(
            response.body.error,
            "Scenario not found."
        );
    });

    test("returns 404 when admin deletes unknown scenario", async () => {
        const {
            agent
        } = await createAdminAgent();

        const response = await agent
            .delete("/api/scenarios/999999999");

        assert.equal(response.status, 404);

        assert.equal(
            response.body.error,
            "Scenario not found."
        );
    });
});