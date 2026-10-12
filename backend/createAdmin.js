const bcrypt = require("bcryptjs");
const pool = require("./config/db");

async function createAdmin() {
    try {
        const name = "Library Admin";
        const email = "admin@library.com";
        const password = "admin123";

        const [existingUsers] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            console.log("Admin user already exists.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        await pool.query(
            `INSERT INTO users
            (name, email, password, role)
            VALUES (?, ?, ?, ?)`,
            [
                name,
                email,
                hashedPassword,
                "admin"
            ]
        );

        console.log("Admin user created successfully.");
        console.log("Email: admin@library.com");
        console.log("Password: admin123");

        process.exit(0);

    } catch (error) {
        console.error(
            "Error creating admin:",
            error.message
        );

        process.exit(1);
    }
}

createAdmin();