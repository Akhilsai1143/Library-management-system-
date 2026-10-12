 const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authModel = require("../models/authModel");

// LOGIN
async function login(req, res, next) {
    try {
        const email = String(req.body.email || "")
            .trim()
            .toLowerCase();

        const password = String(req.body.password || "");

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const users = await authModel.findUserByEmail(email);

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                memberId: user.memberId || null
            }
        });
    } catch (error) {
        next(error);
    }
}

// REGISTER
async function register(req, res, next) {
    try {
        const name = String(req.body.name || "").trim();

        const email = String(req.body.email || "")
            .trim()
            .toLowerCase();

        const password = String(req.body.password || "");

        const phone = String(req.body.phone || "").trim();

        const role = "user";

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must contain at least 6 characters"
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        const existingUsers =
            await authModel.findUserByEmail(email);

        if (existingUsers.length > 0) {
            return res.status(409).json({
                message: "An account with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await authModel.createUserAndMember({
            name,
            email,
            password: hashedPassword,
            phone,
            role
        });

        return res.status(201).json({
            message: "Registration successful. Please log in."
        });
    } catch (error) {
        console.error("Registration error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "This email is already registered"
            });
        }

        next(error);
    }
}

// EXPORT FUNCTIONS
module.exports = {
    login,
    register
};