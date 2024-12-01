import db from '../database.js';

// Insert new user into the database
export const registerUser = (userData, callback) => {
    const query = `
        INSERT INTO users (user_id, name, email, password, created_at, is_entrepreneur)
        VALUES (?, ?, ?, ?, NOW(), ?)
    `;
    db.query(query, userData, callback);
};

// Find user by email
export const findUserByEmail = (email, callback) => {
    const query = `SELECT * FROM users WHERE email = ?`;
    db.query(query, [email], callback);
};
