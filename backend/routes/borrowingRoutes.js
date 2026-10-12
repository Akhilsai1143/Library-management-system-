 const express = require("express");

const router = express.Router();

const borrowingController =
    require("../controllers/borrowingController");


// Get all borrowings
router.get(
    "/",
    borrowingController.getBorrowings
);


// Get borrowing by ID
router.get(
    "/:id",
    borrowingController.getBorrowingById
);


// Issue book
router.post(
    "/",
    borrowingController.createBorrowing
);


// Return book
router.put(
    "/:id/return",
    borrowingController.returnBook
);


module.exports = router;