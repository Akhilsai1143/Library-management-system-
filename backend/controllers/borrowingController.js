 const borrowingModel = require("../models/borrowingModel");


// Get all borrowings
async function getBorrowings(req, res, next) {
    try {

        const borrowings =
            await borrowingModel.getAllBorrowings();

        res.json(borrowings);

    } catch (error) {

        next(error);

    }
}


// Get borrowing by ID
async function getBorrowingById(req, res, next) {
    try {

        const borrowingId = req.params.id;

        const borrowing =
            await borrowingModel.getBorrowingById(borrowingId);


        if (!borrowing) {

            return res.status(404).json({
                message: "Borrowing record not found"
            });

        }


        res.json(borrowing);

    } catch (error) {

        next(error);

    }
}


// Issue book
async function createBorrowing(req, res, next) {
    try {

        const result =
            await borrowingModel.createBorrowing(req.body);


        res.status(201).json({

            message: "Book issued successfully",

            borrowingId: result.insertId

        });

    } catch (error) {

        next(error);

    }
}


// Return book
async function returnBook(req, res, next) {
    try {

        const borrowingId = req.params.id;

        const returnDate =
            req.body.return_date;


        if (!returnDate) {

            return res.status(400).json({

                message: "return_date is required"

            });

        }


        await borrowingModel.returnBook(
            borrowingId,
            returnDate
        );


        res.json({

            message: "Book returned successfully"

        });

    } catch (error) {

        next(error);

    }
}


module.exports = {

    getBorrowings,

    getBorrowingById,

    createBorrowing,

    returnBook

};
