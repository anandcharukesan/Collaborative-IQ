import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'; // Import UUID
import * as userModel from '../models/userModel.js';

// Register user
export const register = async (req, res) => {
    const { name, email, password, is_entrepreneur } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Generate UUID and hash password
        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = [userId, name, email, hashedPassword, is_entrepreneur];

        userModel.registerUser(userData, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Email already exists.' });
                }
                return res.status(500).json({ message: 'Database error.', error: err });
            }

            res.status(201).json({ message: 'User registered successfully!' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error });
    }
};

// Login user
export const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    userModel.findUserByEmail(email, async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.', error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = results[0];

        // Compare password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        res.status(200).json({
            message: 'Login successful!',
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                is_entrepreneur: user.is_entrepreneur,
            },
        });
    });
};
