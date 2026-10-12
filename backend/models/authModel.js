 const pool = require("../config/db");

async function findUserByEmail(email) {
    const [rows] = await pool.query(
        `SELECT
            users.id,
            users.name,
            users.email,
            users.password,
            users.role,
            members.id AS memberId
         FROM users
         LEFT JOIN members
            ON members.email = users.email
         WHERE users.email = ?`,
        [email]
    );

    return rows;
}

async function createUserAndMember({
    name,
    email,
    password,
    phone
}) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [memberResult] = await connection.query(
            `INSERT INTO members
                (name, email, phone, status)
             VALUES (?, ?, ?, 'active')`,
            [name, email, phone || null]
        );

        const memberId = memberResult.insertId;

        const [userResult] = await connection.query(
            `INSERT INTO users
                (name, email, password, role)
             VALUES (?, ?, ?, 'user')`,
            [name, email, password]
        );

        await connection.commit();

        return {
            userId: userResult.insertId,
            memberId
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    findUserByEmail,
    createUserAndMember
};