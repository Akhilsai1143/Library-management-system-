 // ===============================
// Validate Book
// ===============================

function validateBook(req, res, next) {

    const {
        title,
        author,
        total_copies
    } = req.body;


    if (!title || title.trim() === "") {

        return res.status(400).json({
            message: "Book title is required"
        });

    }


    if (!author || author.trim() === "") {

        return res.status(400).json({
            message: "Book author is required"
        });

    }


    if (
        total_copies === undefined ||
        total_copies === null ||
        total_copies === ""
    ) {

        return res.status(400).json({
            message: "Total copies is required"
        });

    }


    if (
        !Number.isInteger(Number(total_copies)) ||
        Number(total_copies) < 1
    ) {

        return res.status(400).json({
            message: "Total copies must be a positive number"
        });

    }


    next();

}


// ===============================
// Validate Member
// ===============================

function validateMember(req, res, next) {

    const {
        name,
        email
    } = req.body;


    if (!name || name.trim() === "") {

        return res.status(400).json({
            message: "Member name is required"
        });

    }


    if (!email || email.trim() === "") {

        return res.status(400).json({
            message: "Member email is required"
        });

    }


    if (!email.includes("@")) {

        return res.status(400).json({
            message: "Please enter a valid email"
        });

    }


    next();

}


// ===============================
// Validate Borrow
// ===============================

function validateBorrow(req, res, next) {

    const {
        book_id,
        member_id,
        borrow_date,
        due_date
    } = req.body;


    if (!book_id) {

        return res.status(400).json({
            message: "Book ID is required"
        });

    }


    if (!member_id) {

        return res.status(400).json({
            message: "Member ID is required"
        });

    }


    if (!borrow_date) {

        return res.status(400).json({
            message: "borrow_date is required"
        });

    }


    if (!due_date) {

        return res.status(400).json({
            message: "due_date is required"
        });

    }


    next();

}


module.exports = {

    validateBook,
    validateMember,
    validateBorrow

};