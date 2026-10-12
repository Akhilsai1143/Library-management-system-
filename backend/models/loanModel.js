 const pool = require("../config/db");

// ===============================
// BORROW BOOK
// ===============================

async function borrowBook(
    bookId,
    memberId,
    borrowDate,
    dueDate
) {
    const connection =
        await pool.getConnection();

    try {

        await connection.beginTransaction();

        // Check book
        const [books] =
            await connection.query(
                `SELECT
                    id,
                    available_copies
                 FROM books
                 WHERE id = ?
                 FOR UPDATE`,
                [bookId]
            );

        if (books.length === 0) {
            const error =
                new Error("Book not found");

            error.status = 404;

            throw error;
        }

        const book = books[0];

        // Check available copies
        if (
            Number(book.available_copies) <= 0
        ) {
            const error =
                new Error(
                    "Book is not available"
                );

            error.status = 400;

            throw error;
        }

        // Check member
        const [members] =
            await connection.query(
                `SELECT
                    id,
                    status
                 FROM members
                 WHERE id = ?`,
                [memberId]
            );

        if (members.length === 0) {
            const error =
                new Error(
                    "Member not found"
                );

            error.status = 404;

            throw error;
        }

        const member = members[0];

        // Check member status
        if (
            member.status !== "active"
        ) {
            const error =
                new Error(
                    "Member is not active"
                );

            error.status = 400;

            throw error;
        }

        // Create loan
        const [result] =
            await connection.query(
                `INSERT INTO loans
                (
                    book_id,
                    member_id,
                    borrow_date,
                    due_date,
                    status,
                    fine_amount
                )
                VALUES (?, ?, ?, ?, 'borrowed', 0.00)`,
                [
                    bookId,
                    memberId,
                    borrowDate,
                    dueDate
                ]
            );

        // Decrease available copies
        await connection.query(
            `UPDATE books
             SET available_copies =
                 available_copies - 1
             WHERE id = ?`,
            [bookId]
        );

        await connection.commit();

        return result;

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();
    }
}

// ===============================
// GET ALL LOANS
// ===============================

async function getAllLoans() {

    const [rows] =
        await pool.query(
            `SELECT
                loans.id,
                loans.book_id,
                books.title AS book_title,
                loans.member_id,
                members.name AS member_name,
                loans.borrow_date,
                loans.due_date,
                loans.return_date,
                loans.status,
                loans.fine_amount
             FROM loans
             JOIN books
             ON loans.book_id = books.id
             JOIN members
             ON loans.member_id = members.id
             ORDER BY loans.id DESC`
        );

    return rows;
}

// ===============================
// GET LOAN BY ID
// ===============================

async function getLoanById(id) {

    const [rows] =
        await pool.query(
            `SELECT
                loans.id,
                loans.book_id,
                books.title AS book_title,
                loans.member_id,
                members.name AS member_name,
                loans.borrow_date,
                loans.due_date,
                loans.return_date,
                loans.status,
                loans.fine_amount
             FROM loans
             JOIN books
             ON loans.book_id = books.id
             JOIN members
             ON loans.member_id = members.id
             WHERE loans.id = ?`,
            [id]
        );

    return rows;
}

// ===============================
// RETURN BOOK
// ===============================

async function returnBook(
    id,
    returnDate
) {
    const connection =
        await pool.getConnection();

    try {

        await connection.beginTransaction();

        // Find loan
        const [loans] =
            await connection.query(
                `SELECT *
                 FROM loans
                 WHERE id = ?
                 FOR UPDATE`,
                [id]
            );

        if (loans.length === 0) {
            const error =
                new Error(
                    "Loan not found"
                );

            error.status = 404;

            throw error;
        }

        const loan = loans[0];

        // Prevent duplicate return
        if (
            loan.status === "returned"
        ) {
            const error =
                new Error(
                    "Book already returned"
                );

            error.status = 400;

            throw error;
        }

        // Calculate fine
        let fine = 0;

        const dueDate =
            new Date(
                loan.due_date
            );

        const actualReturnDate =
            new Date(returnDate);

        if (
            actualReturnDate >
            dueDate
        ) {

            const difference =
                actualReturnDate.getTime() -
                dueDate.getTime();

            const daysLate =
                Math.ceil(
                    difference /
                    (1000 * 60 * 60 * 24)
                );

            // ₹10 per late day
            fine =
                daysLate * 10;
        }

        // Update loan
        await connection.query(
            `UPDATE loans
             SET
                return_date = ?,
                status = 'returned',
                fine_amount = ?
             WHERE id = ?`,
            [
                returnDate,
                fine,
                id
            ]
        );

        // Increase available copies
        await connection.query(
            `UPDATE books
             SET available_copies =
                 available_copies + 1
             WHERE id = ?`,
            [loan.book_id]
        );

        await connection.commit();

        return {
            fine
        };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();
    }
}

// ===============================
// ACTIVE LOANS
// ===============================

async function getActiveLoans() {

    const [rows] =
        await pool.query(
            `SELECT
                loans.id,
                loans.book_id,
                books.title AS book_title,
                loans.member_id,
                members.name AS member_name,
                loans.borrow_date,
                loans.due_date,
                loans.return_date,
                loans.status,
                loans.fine_amount
             FROM loans
             JOIN books
             ON loans.book_id = books.id
             JOIN members
             ON loans.member_id = members.id
             WHERE loans.status = 'borrowed'
             ORDER BY loans.due_date ASC`
        );

    return rows;
}

// ===============================
// OVERDUE LOANS
// ===============================

async function getOverdueLoans() {

    const [rows] =
        await pool.query(
            `SELECT
                loans.id,
                loans.book_id,
                books.title AS book_title,
                loans.member_id,
                members.name AS member_name,
                loans.borrow_date,
                loans.due_date,
                loans.return_date,
                loans.status,
                loans.fine_amount
             FROM loans
             JOIN books
             ON loans.book_id = books.id
             JOIN members
             ON loans.member_id = members.id
             WHERE loans.status = 'borrowed'
             AND loans.due_date < CURDATE()
             ORDER BY loans.due_date ASC`
        );

    return rows;
}

// ===============================
// MEMBER BORROWING HISTORY
// ===============================

async function getLoansByMember(
    memberId
) {

    const [rows] =
        await pool.query(
            `SELECT
                loans.id,
                loans.book_id,
                books.title AS book_title,
                loans.member_id,
                members.name AS member_name,
                loans.borrow_date,
                loans.due_date,
                loans.return_date,
                loans.status,
                loans.fine_amount
             FROM loans
             JOIN books
             ON loans.book_id = books.id
             JOIN members
             ON loans.member_id = members.id
             WHERE loans.member_id = ?
             ORDER BY loans.id DESC`,
            [memberId]
        );

    return rows;
}

module.exports = {
    borrowBook,
    getAllLoans,
    getLoanById,
    returnBook,
    getActiveLoans,
    getOverdueLoans,
    getLoansByMember
};