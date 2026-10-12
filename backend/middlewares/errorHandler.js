 function errorHandler(
    error,
    req,
    res,
    next
) {

    console.error(
        error
    );

    // Custom application errors
    if (error.status) {

        return res.status(
            error.status
        ).json({
            message:
                error.message
        });
    }

    // Duplicate ISBN/email
    if (
        error.code ===
        "ER_DUP_ENTRY"
    ) {

        return res.status(400).json({
            message:
                "Duplicate value. ISBN or email already exists."
        });
    }

    // Foreign key error
    if (
        error.code ===
        "ER_NO_REFERENCED_ROW_2"
    ) {

        return res.status(400).json({
            message:
                "Invalid book ID or member ID."
        });
    }

    // Cannot delete referenced record
    if (
        error.code ===
        "ER_ROW_IS_REFERENCED_2"
    ) {

        return res.status(400).json({
            message:
                "Cannot delete this record because it is being used."
        });
    }

    // Multer file error
    if (
        error.message &&
        error.message.includes(
            "Only JPG"
        )
    ) {

        return res.status(400).json({
            message:
                error.message
        });
    }

    res.status(500).json({
        message:
            "Internal server error"
    });
}

module.exports =
    errorHandler;