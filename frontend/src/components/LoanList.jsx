 function LoanList({
    loans,
    onReturn
}) {

    const handleReturn = async (loanId) => {

        const returnDate = new Date()
            .toISOString()
            .split("T")[0];

        const confirmReturn = window.confirm(
            "Return this book today?"
        );

        if (!confirmReturn) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:5000/api/loans/return/${loanId}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        return_date: returnDate
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to return book"
                );

                return;
            }

            alert(
                `Book returned successfully. Fine: ₹${data.fine}`
            );

            onReturn();

        } catch (error) {

            console.error(
                "Return error:",
                error
            );

            alert(
                "Unable to return book"
            );
        }
    };

    const getStatus = (loan) => {

        if (loan.status === "returned") {
            return {
                text: "Returned",
                className: "status-returned"
            };
        }

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        if (
            loan.due_date &&
            loan.due_date < today
        ) {
            return {
                text: "Overdue",
                className: "status-overdue"
            };
        }

        return {
            text: "Borrowed",
            className: "status-borrowed"
        };
    };

    return (
        <div className="table-card">

            <div
                className="card-header"
                style={{
                    padding: "22px 22px 0"
                }}
            >

                <h3>
                    Loan History
                </h3>

                <p>
                    Track borrowed and returned books.
                </p>

            </div>

            {loans.length === 0 ? (

                <div className="empty-state">

                    <div className="empty-state-icon">
                        🔄
                    </div>

                    <h3>
                        No loan records
                    </h3>

                    <p>
                        Borrowed books will appear here.
                    </p>

                </div>

            ) : (

                <div className="table-wrapper">

                    <table>

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Book</th>
                                <th>Member</th>
                                <th>Borrow Date</th>
                                <th>Due Date</th>
                                <th>Return Date</th>
                                <th>Status</th>
                                <th>Fine</th>
                                <th>Action</th>
                            </tr>

                        </thead>

                        <tbody>

                            {loans.map((loan) => {

                                const status =
                                    getStatus(loan);

                                return (

                                    <tr key={loan.id}>

                                        <td>
                                            #{loan.id}
                                        </td>

                                        <td>
                                            <strong>
                                                {loan.book_title}
                                            </strong>
                                        </td>

                                        <td>
                                            {loan.member_name}
                                        </td>

                                        <td>
                                            {loan.borrow_date}
                                        </td>

                                        <td>
                                            {loan.due_date}
                                        </td>

                                        <td>
                                            {loan.return_date || "-"}
                                        </td>

                                        <td>

                                            <span
                                                className={`status-badge ${status.className}`}
                                            >
                                                {status.text}
                                            </span>

                                        </td>

                                        <td>
                                            ₹{loan.fine_amount}
                                        </td>

                                        <td>

                                            {loan.status !==
                                                "returned" ? (

                                                <button
                                                    className="action-button return-button"
                                                    onClick={() =>
                                                        handleReturn(
                                                            loan.id
                                                        )
                                                    }
                                                >
                                                    Return
                                                </button>

                                            ) : (

                                                <span
                                                    style={{
                                                        color: "#9ca3af",
                                                        fontSize: "11px"
                                                    }}
                                                >
                                                    Completed
                                                </span>

                                            )}

                                        </td>

                                    </tr>

                                );
                            })}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default LoanList;