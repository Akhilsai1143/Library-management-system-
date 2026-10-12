 const bookModel =
    require("../models/bookModel");


// GET ALL BOOKS

async function getBooks(req, res, next) {

    try {

        const books =
            await bookModel.getAllBooks();

        res.json(books);

    } catch (error) {

        console.error(
            "Get books error:",
            error
        );

        next(error);
    }
}


// GET ONE BOOK

async function getBook(req, res, next) {

    try {

        const { id } =
            req.params;

        const books =
            await bookModel.getBookById(id);

        if (books.length === 0) {

            return res.status(404).json({
                message: "Book not found"
            });

        }

        res.json(books[0]);

    } catch (error) {

        console.error(
            "Get book error:",
            error
        );

        next(error);
    }
}


// CREATE BOOK

async function createBook(req, res, next) {

    try {

        const {
            title,
            author,
            isbn,
            category,
            total_copies
        } = req.body;


        if (!title || !author) {

            return res.status(400).json({
                message:
                    "Title and author are required"
            });

        }


        if (!total_copies) {

            return res.status(400).json({
                message:
                    "Total copies are required"
            });

        }


        const image =
            req.file
                ? `/uploads/${req.file.filename}`
                : null;


        const result =
            await bookModel.createBook({

                title,
                author,
                isbn,
                category,
                total_copies:
                    Number(total_copies),

                image
            });


        res.status(201).json({

            message:
                "Book created successfully",

            bookId:
                result.insertId

        });

    } catch (error) {

        console.error(
            "Create book error:",
            error
        );


        if (
            error.code ===
            "ER_DUP_ENTRY"
        ) {

            return res.status(400).json({
                message:
                    "ISBN already exists"
            });

        }


        next(error);
    }
}


// UPDATE BOOK

async function updateBook(req, res, next) {

    try {

        const { id } =
            req.params;


        const {
            title,
            author,
            isbn,
            category,
            total_copies
        } = req.body;


        if (!title || !author) {

            return res.status(400).json({
                message:
                    "Title and author are required"
            });

        }


        if (!total_copies) {

            return res.status(400).json({
                message:
                    "Total copies are required"
            });

        }


        const image =
            req.file
                ? `/uploads/${req.file.filename}`
                : null;


        const result =
            await bookModel.updateBook(
                id,
                {
                    title,
                    author,
                    isbn,
                    category,
                    total_copies:
                        Number(total_copies),
                    image
                }
            );


        if (!result) {

            return res.status(404).json({
                message:
                    "Book not found"
            });

        }


        res.json({
            message:
                "Book updated successfully"
        });

    } catch (error) {

        console.error(
            "Update book error:",
            error
        );


        if (
            error.code ===
            "ER_DUP_ENTRY"
        ) {

            return res.status(400).json({
                message:
                    "ISBN already exists"
            });

        }


        next(error);
    }
}


// DELETE BOOK

async function deleteBook(req, res, next) {

    try {

        const { id } =
            req.params;


        const result =
            await bookModel.deleteBook(id);


        if (result.affectedRows === 0) {

            return res.status(404).json({
                message:
                    "Book not found"
            });

        }


        res.json({
            message:
                "Book deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete book error:",
            error
        );


        if (
            error.code ===
            "ER_ROW_IS_REFERENCED_2"
        ) {

            return res.status(400).json({
                message:
                    "Cannot delete this book because it has loan records"
            });

        }


        next(error);
    }
}


module.exports = {

    getBooks,
    getBook,

    createBook,
    updateBook,
    deleteBook

};