 function ReportCards({ summary }) {

    return (
        <div className="report-grid">

            <div className="report-card">

                <span>
                    📚 Total Books
                </span>

                <h2>
                    {summary.total_books}
                </h2>

            </div>

            <div className="report-card">

                <span>
                    👥 Total Members
                </span>

                <h2>
                    {summary.total_members}
                </h2>

            </div>

            <div className="report-card">

                <span>
                    🔄 Active Loans
                </span>

                <h2>
                    {summary.active_loans}
                </h2>

            </div>

            <div className="report-card">

                <span>
                    ✅ Returned Loans
                </span>

                <h2>
                    {summary.returned_loans}
                </h2>

            </div>

            <div className="report-card">

                <span>
                    ⚠️ Overdue Loans
                </span>

                <h2>
                    {summary.overdue_loans}
                </h2>

            </div>

            <div className="report-card">

                <span>
                    💰 Total Fines
                </span>

                <h2>
                    ₹{summary.total_fines}
                </h2>

            </div>

        </div>
    );
}

export default ReportCards;