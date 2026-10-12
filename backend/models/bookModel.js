 const pool = require("../config/db");


// Get all books

async function getAllBooks() {

    const [rows] = await pool.query(
        `
        SELECT
            id,
            title,
            author,
            isbn,
            category,
            total_copies,
            available_copies,
            image,
            created_at,
            updated_at
        FROM books
        ORDER BY id DESC
        `
    );

    return rows;
}


// Get one book

async function getBookById(id) {

    const [rows] = await pool.query(
        `
        SELECT
            id,
            title,
            author,
            isbn,
            category,
            total_copies,
            available_copies,
            image,
            created_at,
            updated_at
        FROM books
        WHERE id = ?
        `,
        [id]
    );

    return rows;
}


// Create book

async function createBook(bookData) {

    const {
        title,
        author,
        isbn,
        category,
        total_copies,
        image
    } = bookData;

    const [result] = await pool.query(
        `
        INSERT INTO books
        (
            title,
            author,
            isbn,
            category,
            total_copies,
            available_copies,
            image
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            title,
            author,
            isbn || null,
            category || null,
            total_copies,
            total_copies,
            image || null
        ]
    );

    return result;
}


// Update book

async function updateBook(id, bookData) {

    const {
        title,
        author,
        isbn,
        category,
        total_copies,
        image
    } = bookData;

    const [existingRows] = await pool.query(
        `
        SELECT
            total_copies,
            available_copies,
            image
        FROM books
        WHERE id = ?
        `,
        [id]
    );

    if (existingRows.length === 0) {
        return null;
    }

    const existingBook =
        existingRows[0];

    const borrowedCopies =
        Number(existingBook.total_copies) -
        Number(existingBook.available_copies);

    const newTotal =
        Number(total_copies);

    const newAvailable =
        Math.max(
            newTotal - borrowedCopies,
            0
        );

    let query = `
        UPDATE books
        SET
            title = ?,
            author = ?,
            isbn = ?,
            category = ?,
            total_copies = ?,
            available_copies = ?
    `;

    const values = [
        title,
        author,
        isbn || null,
        category || null,
        newTotal,
        newAvailable
    ];

    if (image) {

        query += `,
            image = ?
        `;

        values.push(image);
    }

    query += `
        WHERE id = ?
    `;

    values.push(id);

    const [result] =
        await pool.query(
            query,
            values
        );

    return result;
}


// Delete book

async function deleteBook(id) {

    const [result] =
        await pool.query(
            `
            DELETE FROM books
            WHERE id = ?
            `,
            [id]
        );

    return result;
}


module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};