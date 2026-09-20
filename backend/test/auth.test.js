import { describe, test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../src/app.js";

describe("Auth API", () => {

    function createTestUser() {
        return {
            username: "TestUser",
            email: `test-${Date.now()}-${Math.random()}@test.de`,
            password: "Test123!"
        };
    }

    test("registers a new user", async () => {
        const user = createTestUser();

        const response = await request(app)
            .post("/api/auth/register")
            .send(user);

        assert.equal(response.status, 201);
        assert.equal(response.body.username, user.username);
        assert.equal(response.body.email, user.email);
        assert.equal(response.body.role, "user");

        assert.equal(response.body.password, undefined);
        assert.equal(response.body.password_hash, undefined);
    });


    test("rejects duplicate email", async () => {
        const user = createTestUser();

        await request(app)
            .post("/api/auth/register")
            .send(user);

        const response = await request(app)
            .post("/api/auth/register")
            .send(user);

        assert.equal(response.status, 409);
    });


    test("rejects registration with missing fields", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                email: "incomplete@test.de"
            });

        assert.equal(response.status, 400);
    });


    test("logs in with correct credentials", async () => {
        const user = createTestUser();

        await request(app)
            .post("/api/auth/register")
            .send(user);

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: user.email,
                password: user.password
            });

        assert.equal(response.status, 200);
        assert.equal(response.body.email, user.email);
        assert.equal(response.body.username, user.username);

        assert.equal(response.body.password, undefined);
        assert.equal(response.body.password_hash, undefined);
    });


    test("rejects login with wrong password", async () => {
        const user = createTestUser();

        await request(app)
            .post("/api/auth/register")
            .send(user);

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: user.email,
                password: "WrongPassword!"
            });

        assert.equal(response.status, 401);
    });


    test("rejects login for unknown user", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: `unknown-${Date.now()}@test.de`,
                password: "Test123!"
            });

        assert.equal(response.status, 401);
    });

    test("keeps user authenticated after login", async () => {
        const user = createTestUser();

        await request(app)
            .post("/api/auth/register")
            .send(user);

        const agent = request.agent(app);

        const loginResponse = await agent
            .post("/api/auth/login")
            .send({
                email: user.email,
                password: user.password
            });

        assert.equal(loginResponse.status, 200);

        const meResponse = await agent
            .get("/api/auth/me");

        assert.equal(meResponse.status, 200);
        assert.equal(meResponse.body.email, user.email);
    });

    test("rejects /me without authentication", async () => {
        const response = await request(app)
            .get("/api/auth/me");

        assert.equal(response.status, 401);
    });

    test("logs out authenticated user", async () => {
        const user = createTestUser();

        await request(app)
            .post("/api/auth/register")
            .send(user);

        const agent = request.agent(app);

        // Login
        const loginResponse = await agent
            .post("/api/auth/login")
            .send({
                email: user.email,
                password: user.password
            });

        assert.equal(loginResponse.status, 200);

        // Vor Logout muss /me funktionieren
        const beforeLogout = await agent
            .get("/api/auth/me");

        assert.equal(beforeLogout.status, 200);

        // Logout
        const logoutResponse = await agent
            .post("/api/auth/logout");

        assert.equal(logoutResponse.status, 200);

        // Nach Logout darf /me nicht mehr funktionieren
        const afterLogout = await agent
            .get("/api/auth/me");

        assert.equal(afterLogout.status, 401);
    });
});