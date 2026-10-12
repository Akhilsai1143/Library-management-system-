const loanModel = require("../models/loanModel");


// ===============================
// Borrow Book
// ===============================

async function borrowBook(req, res, next) {

    try {

        const {
            book_id,
            member_id,
            borrow_date,
            due_date
        } = req.body;


        const result = await loanModel.borrowBook(
            book_id,
            member_id,
            borrow_date,
            due_date
        );


        res.status(201).json({
            message: "Book borrowed successfully",
            loanId: result.insertId
        });

    } catch (error) {

        next(error);

    }
}


// ===============================
// Get All Loans
// ===============================

async function getLoans(req, res, next) {

    try {

        const loans = await loanModel.getAllLoans();

        res.json(loans);

    } catch (error) {

        next(error);

    }
}


// ===============================
// Get Loan By ID
// ===============================

async function getLoanById(req, res, next) {

    try {

        const loanId = req.params.id;

        const loans = await loanModel.getLoanById(loanId);


        if (loans.length === 0) {

            return res.status(404).json({
                message: "Loan not found"
            });

        }


        res.json(loans[0]);

    } catch (error) {

        next(error);

    }
}


// ===============================
// Return Book
// ===============================

async function returnBook(req, res, next) {

    try {

        const loanId = req.params.loanId;

        const {
            return_date
        } = req.body;


        if (!return_date) {

            return res.status(400).json({
                message: "return_date is required"
            });

        }


        const result = await loanModel.returnBook(
            loanId,
            return_date
        );


        res.json({
            message: "Book returned successfully",
            fine: result.fine
        });

    } catch (error) {

        next(error);

    }
}


// ===============================
// Active Loans
// ===============================

async function getActiveLoans(req, res, next) {

    try {

        const loans = await loanModel.getActiveLoans();

        res.json(loans);

    } catch (error) {

        next(error);

    }
}


// ===============================
// Overdue Loans
// ===============================

async function getOverdueLoans(req, res, next) {

    try {

        const loans = await loanModel.getOverdueLoans();

        res.json(loans);

    } catch (error) {

        next(error);

    }
}


// ===============================
// Member Borrowing History
// ===============================

async function getLoansByMember(req, res, next) {

    try {

        const memberId = req.params.memberId;

        const loans =
            await loanModel.getLoansByMember(memberId);


        res.json(loans);

    } catch (error) {

        next(error);

    }
}


module.exports = {

    borrowBook,
    getLoans,
    getLoanById,
    returnBook,
    getActiveLoans,
    getOverdueLoans,
    getLoansByMember

};