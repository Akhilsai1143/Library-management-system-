import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/loans";

function formatDate(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value).slice(0, 10);
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function MyLoans() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    let user = {};

    try {
        user = JSON.parse(
            localStorage.getItem("user") || "{}"
        );
    } catch {
        user = {};
    }

    useEffect(() => {
        async function fetchMyLoans() {
            if (!user.memberId) {
                setError(
                    "Your library member record was not found."
                );
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}/member/${user.memberId}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to load borrowing history"
                    );
                }

                setLoans(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("My borrowing history error:", error);
                setError(
                    "Unable to load your borrowing history. Please try again."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchMyLoans();
    }, [user.memberId]);

    const activeLoans = loans.filter(
        (loan) => loan.status !== "returned"
    );

    const returnedLoans = loans.filter(
        (loan) => loan.status === "returned"
    );

    return (
        <div className="reader-page">
            <section className="reader-page-heading">
                <div>
                    <p className="reader-eyebrow">
                        YOUR LIBRARY ACTIVITY
                    </p>

                    <h1>My Borrowings</h1>

                    <p>
                        View your borrowed books, due dates and
                        return history.
                    </p>
                </div>
            </section>

            <section className="reader-stats">
                <article className="reader-stat-card">
                    <span className="reader-stat-icon">📖</span>
                    <div>
                        <small>Currently Borrowed</small>
                        <strong>{activeLoans.length}</strong>
                    </div>
                </article>

                <article className="reader-stat-card">
                    <span className="reader-stat-icon">✅</span>
                    <div>
                        <small>Returned</small>
                        <strong>{returnedLoans.length}</strong>
                    </div>
                </article>

                <article className="reader-stat-card">
                    <span className="reader-stat-icon">📋</span>
                    <div>
                        <small>Total Transactions</small>
                        <strong>{loans.length}</strong>
                    </div>
                </article>
            </section>

            <section className="reader-history-card">
                <div className="reader-section-heading">
                    <div>
                        <h2>Borrowing History</h2>
                        <p>
                            Your borrowing records and due dates.
                        </p>
                    </div>
                </div>

                {loading && (
                    <div className="reader-message">
                        Loading your borrowing history...
                    </div>
                )}

                {error && (
                    <div className="reader-error">
                        {error}
                    </div>
                )}

                {!loading && !error && loans.length === 0 && (
                    <div className="reader-empty">
                        <span>📚</span>
                        <h3>No borrowing records yet</h3>
                        <p>
                            Borrow an available book and it will
                            appear here.
                        </p>
                    </div>
                )}

                {!loading && !error && loans.length > 0 && (
                    <div className="reader-table-scroll">
                        <table className="reader-table">
                            <thead>
                                <tr>
                                    <th>Book</th>
                                    <th>Borrowed On</th>
                                    <th>Due Date</th>
                                    <th>Returned On</th>
                                    <th>Status</th>
                                    <th>Fine</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loans.map((loan) => {
                                    const isReturned =
                                        loan.status === "returned";

                                    const isOverdue =
                                        !isReturned &&
                                        loan.due_date &&
                                        new Date(loan.due_date) <
                                            new Date(
                                                new Date().setHours(0, 0, 0, 0)
                                            );

                                    return (
                                        <tr key={loan.id}>
                                            <td>
                                                <strong>
                                                    {loan.book_title}
                                                </strong>
                                                <small>
                                                    Loan #{loan.id}
                                                </small>
                                            </td>

                                            <td>
                                                {formatDate(loan.borrow_date)}
                                            </td>

                                            <td>
                                                {formatDate(loan.due_date)}
                                            </td>

                                            <td>
                                                {formatDate(loan.return_date)}
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        isReturned
                                                            ? "reader-status returned"
                                                            : isOverdue
                                                                ? "reader-status overdue"
                                                                : "reader-status borrowed"
                                                    }
                                                >
                                                    {isReturned
                                                        ? "Returned"
                                                        : isOverdue
                                                            ? "Overdue"
                                                            : "Borrowed"}
                                                </span>
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    loan.fine_amount || 0
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default MyLoans;