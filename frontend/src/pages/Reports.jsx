 import { useEffect, useState } from "react";

function Reports() {

    const [report, setReport] = useState({
        totalBooks: 0,
        availableBooks: 0,
        borrowedBooks: 0,
        totalMembers: 0,
        activeMembers: 0,
        inactiveMembers: 0,
        activeLoans: 0,
        returnedLoans: 0,
        overdueLoans: 0
    });

    useEffect(() => {

        fetch(
            "http://localhost:5000/api/reports"
        )
            .then((response) =>
                response.json()
            )
            .then((data) => {
                setReport(data);
            })
            .catch((error) => {
                console.error(
                    "Reports error:",
                    error
                );
            });

    }, []);

    return (

        <div className="page reports-page">

            {/* HEADER */}

            <div className="report-header">

                <div>

                    <p className="page-label">
                        LIBRARY ANALYTICS
                    </p>

                    <h1>
                        Library Reports
                    </h1>

                    <p>
                        Overall library statistics
                        and activity summary.
                    </p>

                </div>

            </div>


            {/* STATS */}

            <div className="report-stats">

                <div className="report-stat-card">

                    <div className="report-stat-icon">
                        📚
                    </div>

                    <div className="report-stat-info">

                        <span>
                            Total Books
                        </span>

                        <strong>
                            {report.totalBooks}
                        </strong>

                    </div>

                </div>


                <div className="report-stat-card">

                    <div className="report-stat-icon">
                        📖
                    </div>

                    <div className="report-stat-info">

                        <span>
                            Available Books
                        </span>

                        <strong>
                            {report.availableBooks}
                        </strong>

                    </div>

                </div>


                <div className="report-stat-card">

                    <div className="report-stat-icon">
                        🔄
                    </div>

                    <div className="report-stat-info">

                        <span>
                            Borrowed Books
                        </span>

                        <strong>
                            {report.borrowedBooks}
                        </strong>

                    </div>

                </div>


                <div className="report-stat-card">

                    <div className="report-stat-icon">
                        👥
                    </div>

                    <div className="report-stat-info">

                        <span>
                            Total Members
                        </span>

                        <strong>
                            {report.totalMembers}
                        </strong>

                    </div>

                </div>

            </div>


            {/* SUMMARY */}

            <div className="report-summary-card">

                <div className="report-summary-header">

                    <h2>
                        Overall Library Summary
                    </h2>

                    <p>
                        Current status of books,
                        members and loans.
                    </p>

                </div>


                <div className="report-summary-list">

                    <div className="report-summary-item">

                        <span>
                            Total Books
                        </span>

                        <strong>
                            {report.totalBooks}
                        </strong>

                    </div>


                    <div className="report-summary-item">

                        <span>
                            Available Books
                        </span>

                        <strong>
                            {report.availableBooks}
                        </strong>

                    </div>


                    <div className="report-summary-item">

                        <span>
                            Borrowed Books
                        </span>

                        <strong>
                            {report.borrowedBooks}
                        </strong>

                    </div>


                    <div className="report-summary-item">

                        <span>
                            Total Members
                        </span>

                        <strong>
                            {report.totalMembers}
                        </strong>

                    </div>


                    <div className="report-summary-item">

                        <span>
                            Active Members
                        </span>

                        <strong>
                            {report.activeMembers}
                        </strong>

                    </div>


                    <div className="report-summary-item">

                        <span>
                            Inactive Members
                        </span>

                        <strong>
                            {report.inactiveMembers}
                        </strong>

                    </div>


                    <div className="report-summary-item">

                        <span>
                            Active Loans
                        </span>

                        <strong>
                            {report.activeLoans}
                        </strong>

                    </div>


                    <div className="report-summary-item">

                        <span>
                            Returned Loans
                        </span>

                        <strong>
                            {report.returnedLoans}
                        </strong>

                    </div>


                    <div className="report-summary-item">

                        <span>
                            Overdue Loans
                        </span>

                        <strong>
                            {report.overdueLoans}
                        </strong>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Reports;