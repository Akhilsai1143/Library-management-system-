 const pool = require("../config/db");

// Get all borrowing records
async function getAllBorrowings() {
    const [rows] = await pool.query(`
        SELECT
            borrowings.id,
            borrowings.book_id,
            books.title AS book_title,
            borrowings.member_id,
            members.name AS member_name,
            borrowings.issue_date,
            borrowings.due_date,
            borrowings.return_date,
            borrowings.status
        FROM borrowings
        JOIN books ON borrowings.book_id = books.id
        JOIN members ON borrowings.member_id = members.id
        ORDER BY borrowings.id DESC
    `);

    return rows;
}


// Get borrowing record by ID
async function getBorrowingById(id) {
    const [rows] = await pool.query(`
        SELECT
            borrowings.id,
            borrowings.book_id,
            books.title AS book_title,
            borrowings.member_id,
            members.name AS member_name,
            borrowings.issue_date,
            borrowings.due_date,
            borrowings.return_date,
            borrowings.status
        FROM borrowings
        JOIN books ON borrowings.book_id = books.id
        JOIN members ON borrowings.member_id = members.id
        WHERE borrowings.id = ?
    `, [id]);

    return rows[0];
}


// Create borrowing / Issue book
async function createBorrowing(borrowingData) {
    const {
        book_id,
        member_id,
        issue_date,
        due_date
    } = borrowingData;


    // Check whether book exists
    const [books] = await pool.query(
        `SELECT available_copies
         FROM books
         WHERE id = ?`,
        [book_id]
    );

    if (books.length === 0) {
        throw new Error("Book not found");
    }


    // Check whether copies are available
    if (books[0].available_copies <= 0) {
        throw new Error("Book is not available");
    }


    // Check whether member exists
    const [members] = await pool.query(
        `SELECT id
         FROM members
         WHERE id = ?`,
        [member_id]
    );

    if (members.length === 0) {
        throw new Error("Member not found");
    }


    // Create borrowing record
    const [result] = await pool.query(
        `INSERT INTO borrowings
        (
            book_id,
            member_id,
            issue_date,
            due_date,
            status
        )
        VALUES (?, ?, ?, ?, 'borrowed')`,
        [
            book_id,
            member_id,
            issue_date,
            due_date
        ]
    );


    // Decrease available book copies
    await pool.query(
        `UPDATE books
         SET available_copies = available_copies - 1
         WHERE id = ?`,
        [book_id]
    );


    return result;
}


// Return book
async function returnBook(id, returnDate) {

    // Find borrowing record
    const [borrowings] = await pool.query(
        `SELECT book_id, status
         FROM borrowings
         WHERE id = ?`,
        [id]
    );

    if (borrowings.length === 0) {
        throw new Error("Borrowing record not found");
    }


    // Check whether already returned
    if (borrowings[0].status === "returned") {
        throw new Error("Book has already been returned");
    }


    const bookId = borrowings[0].book_id;


    // Update borrowing record
    await pool.query(
        `UPDATE borrowings
         SET return_date = ?,
             status = 'returned'
         WHERE id = ?`,
        [
            returnDate,
            id
        ]
    );


    // Increase available book copies
    await pool.query(
        `UPDATE books
         SET available_copies = available_copies + 1
         WHERE id = ?`,
        [bookId]
    );


    return true;
}


module.exports = {
    getAllBorrowings,
    getBorrowingById,
    createBorrowing,
    returnBook
};