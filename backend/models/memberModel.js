 const pool = require("../config/db");

async function getAllMembers() {
    const [rows] = await pool.query(
        "SELECT * FROM members"
    );

    return rows;
}

async function getMemberById(id) {
    const [rows] = await pool.query(
        "SELECT * FROM members WHERE id = ?",
        [id]
    );

    return rows[0];
}

async function createMember(memberData) {
    const {
        name,
        email,
        phone,
        membership_date,
        status
    } = memberData;

    const [result] = await pool.query(
        `INSERT INTO members
        (name, email, phone, membership_date, status)
        VALUES (?, ?, ?, ?, ?)`,
        [
            name,
            email,
            phone,
            membership_date,
            status
        ]
    );

    return result;
}

async function updateMember(id, memberData) {
    const {
        name,
        email,
        phone,
        membership_date,
        status
    } = memberData;

    const [result] = await pool.query(
        `UPDATE members
         SET name = ?,
             email = ?,
             phone = ?,
             membership_date = ?,
             status = ?
         WHERE id = ?`,
        [
            name,
            email,
            phone,
            membership_date,
            status,
            id
        ]
    );

    return result;
}

async function deleteMember(id) {
    const [result] = await pool.query(
        "DELETE FROM members WHERE id = ?",
        [id]
    );

    return result;
}

module.exports = {
    getAllMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember
};