 const pool =
    require("../config/db");

async function getOverallReport(
    req,
    res,
    next
) {

    try {

        // ===============================
        // BOOK SUMMARY
        // ===============================

        const [bookRows] =
            await pool.query(`
                SELECT
                    COALESCE(
                        SUM(total_copies),
                        0
                    ) AS totalBooks,

                    COALESCE(
                        SUM(available_copies),
                        0
                    ) AS availableBooks

                FROM books
            `);

        // ===============================
        // MEMBER SUMMARY
        // ===============================

        const [memberRows] =
            await pool.query(`
                SELECT
                    COUNT(*) AS totalMembers,

                    COALESCE(
                        SUM(
                            CASE
                                WHEN status = 'active'
                                THEN 1
                                ELSE 0
                            END
                        ),
                        0
                    ) AS activeMembers,

                    COALESCE(
                        SUM(
                            CASE
                                WHEN status != 'active'
                                THEN 1
                                ELSE 0
                            END
                        ),
                        0
                    ) AS inactiveMembers

                FROM members
            `);

        // ===============================
        // LOAN SUMMARY
        // ===============================

        const [loanRows] =
            await pool.query(`
                SELECT

                    COALESCE(
                        SUM(
                            CASE
                                WHEN status = 'borrowed'
                                THEN 1
                                ELSE 0
                            END
                        ),
                        0
                    ) AS activeLoans,

                    COALESCE(
                        SUM(
                            CASE
                                WHEN status = 'returned'
                                THEN 1
                                ELSE 0
                            END
                        ),
                        0
                    ) AS returnedLoans,

                    COALESCE(
                        SUM(
                            CASE
                                WHEN status = 'borrowed'
                                AND due_date < CURDATE()
                                THEN 1
                                ELSE 0
                            END
                        ),
                        0
                    ) AS overdueLoans,

                    COALESCE(
                        SUM(fine_amount),
                        0
                    ) AS totalFines

                FROM loans
            `);

        // ===============================
        // CONVERT VALUES TO NUMBERS
        // ===============================

        const totalBooks =
            Number(
                bookRows[0].totalBooks
            );

        const availableBooks =
            Number(
                bookRows[0].availableBooks
            );

        const borrowedBooks =
            totalBooks -
            availableBooks;

        const totalMembers =
            Number(
                memberRows[0].totalMembers
            );

        const activeMembers =
            Number(
                memberRows[0].activeMembers
            );

        const inactiveMembers =
            Number(
                memberRows[0].inactiveMembers
            );

        const activeLoans =
            Number(
                loanRows[0].activeLoans
            );

        const returnedLoans =
            Number(
                loanRows[0].returnedLoans
            );

        const overdueLoans =
            Number(
                loanRows[0].overdueLoans
            );

        const totalFines =
            Number(
                loanRows[0].totalFines
            );

        // ===============================
        // RESPONSE
        // ===============================

        res.json({

            totalBooks,
            availableBooks,
            borrowedBooks,

            totalMembers,
            activeMembers,
            inactiveMembers,

            activeLoans,
            returnedLoans,
            overdueLoans,

            totalFines

        });

    } catch (error) {

        console.error(
            "Overall report error:",
            error
        );

        next(error);
    }
}

module.exports = {
    getOverallReport
};