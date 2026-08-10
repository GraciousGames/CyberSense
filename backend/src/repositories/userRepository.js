import database from "../database/database.js";

export function findUserByEmail(email) {
    return database
        .prepare(`
            SELECT id, username, email, password_hash, role, created_at
            FROM users
            WHERE email = ?
        `)
        .get(email);
}

export function createUser({ username, email, passwordHash }) {
    const result = database
        .prepare(`
            INSERT INTO users (username, email, password_hash)
            VALUES (?, ?, ?)
        `)
        .run(username, email, passwordHash);

    return database
        .prepare(`
            SELECT id, username, email, role, created_at
            FROM users
            WHERE id = ?
        `)
        .get(result.lastInsertRowid);
}