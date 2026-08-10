import express from "express";
import bcrypt from "bcrypt";
import { requireAuth } from "../middleware/authMiddleware.js";

import {
    createUser,
    findUserByEmail,
    findUserById
} from "../repositories/userRepository.js";

const router = express.Router();


router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            error: "Username, email and password are required."
        });
    }

    const existingUser = findUserByEmail(email);

    if (existingUser) {
        return res.status(409).json({
            error: "A user with this email already exists."
        });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = createUser({
        username,
        email,
        passwordHash
    });

    return res.status(201).json(user);
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required."
        });
    }

    const user = findUserByEmail(email);

    if (!user) {
        return res.status(401).json({
            error: "Invalid email or password."
        });
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatches) {
        return res.status(401).json({
            error: "Invalid email or password."
        });
    }

    req.session.userId = user.id;

    return res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    });
});


router.get("/me", requireAuth, (req, res) => {
    const user = findUserById(req.session.userId);

    if (!user) {
        return res.status(401).json({
            error: "Not authenticated."
        });
    }

    return res.status(200).json(user);
});


router.post("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                error: "Logout failed."
            });
        }

        res.clearCookie("connect.sid");

        return res.status(200).json({
            message: "Logged out successfully."
        });
    });
});

export default router;