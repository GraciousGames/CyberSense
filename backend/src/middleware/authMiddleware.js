import { findUserById } from "../repositories/userRepository.js";

export function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({
            error: "Authentication required."
        });
    }

    next();
}

export function requireAdmin(req, res, next) {
    const user = findUserById(req.session.userId);

    if (!user) {
        return res.status(401).json({
            error: "Authentication required."
        });
    }

    if (user.role !== "admin") {
        return res.status(403).json({
            error: "Admin access required."
        });
    }

    next();
}
