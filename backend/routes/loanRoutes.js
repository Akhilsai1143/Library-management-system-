const express = require("express");

const router = express.Router();

const loanController = require("../controllers/loanController");

const {
    validateBorrow
} = require("../middlewares/validation");


// ===============================
// Borrow Book
// ===============================

router.post(
    "/borrow",
    validateBorrow,
    loanController.borrowBook
);


// ===============================
// Return Book
// ===============================

router.post(
    "/return/:loanId",
    loanController.returnBook
);


// ===============================
// Get All Borrowing History
// ===============================

router.get(
    "/",
    loanController.getLoans
);


// ===============================
// Get Active Loans
// ===============================

router.get(
    "/active",
    loanController.getActiveLoans
);


// ===============================
// Get Overdue Loans
// ===============================

router.get(
    "/overdue",
    loanController.getOverdueLoans
);


// ===============================
// Get Member Borrowing History
// ===============================

router.get(
    "/member/:memberId",
    loanController.getLoansByMember
);


// ===============================
// Get Loan By ID
// ===============================

router.get(
    "/:id",
    loanController.getLoanById
);


module.exports = router;