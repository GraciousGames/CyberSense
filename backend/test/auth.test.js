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

});