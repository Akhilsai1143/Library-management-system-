 import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

function Dashboard() {

    const [summary, setSummary] =
        useState({
            totalBooks: 0,
            totalMembers: 0,
            activeLoans: 0,
            overdueLoans: 0,
            returnedLoans: 0,
            totalFines: 0
        });

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const fetchSummary =
            async () => {

                try {

                    const response =
                        await fetch(
                            "http://localhost:5000/api/reports"
                        );

                    const data =
                        await response.json();

                    if (!response.ok) {
                        throw new Error(
                            data.message ||
                            "Unable to load dashboard"
                        );
                    }

                    setSummary(data);

                } catch (error) {

                    console.error(
                        "Dashboard error:",
                        error
                    );

                } finally {

                    setLoading(false);
                }
            };

        fetchSummary();

    }, []);

    return (

        <div className="page">

            <div className="top-header">

                <div>

                    <p className="page-label">
                        LIBRARY MANAGEMENT
                    </p>

                    <h1>
                        Good morning 👋
                    </h1>

                    <p className="page-description">
                        Here's what's happening in
                        your library today.
                    </p>

                </div>

                <div className="header-date">
                    📅{" "}
                    {new Date().toLocaleDateString()}
                </div>

            </div>

            <section className="welcome-card">

                <div>

                    <span className="welcome-small">
                        LIBRARY OVERVIEW
                    </span>

                    <h2>
                        Manage your library smarter.
                    </h2>

                    <p>
                        Keep track of books,
                        members, loans and reports
                        from one place.
                    </p>

                    <Link
                        to="/books"
                        className="primary-button"
                    >
                        Manage Books →
                    </Link>

                </div>

                <div className="welcome-icon">
                    📚
                </div>

            </section>

            <div className="section-heading">

                <div>

                    <h2>
                        Overview
                    </h2>

                    <p>
                        Your library statistics
                        at a glance.
                    </p>

                </div>

            </div>

            <div className="stats-grid">

                <div className="stat-card">

                    <div className="stat-icon blue">
                        📚
                    </div>

                    <div>

                        <p>
                            Total Books
                        </p>

                        <h3>
                            {loading
                                ? "..."
                                : summary.totalBooks}
                        </h3>

                        <span className="stat-info">
                            Books in library
                        </span>

                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-icon purple">
                        👥
                    </div>

                    <div>

                        <p>
                            Total Members
                        </p>

                        <h3>
                            {loading
                                ? "..."
                                : summary.totalMembers}
                        </h3>

                        <span className="stat-info">
                            Registered members
                        </span>

                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-icon green">
                        🔄
                    </div>

                    <div>

                        <p>
                            Active Loans
                        </p>

                        <h3>
                            {loading
                                ? "..."
                                : summary.activeLoans}
                        </h3>

                        <span className="stat-info">
                            Currently borrowed
                        </span>

                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-icon orange">
                        ⚠️
                    </div>

                    <div>

                        <p>
                            Overdue
                        </p>

                        <h3>
                            {loading
                                ? "..."
                                : summary.overdueLoans}
                        </h3>

                        <span className="stat-info">
                            Need attention
                        </span>

                    </div>

                </div>

            </div>

            <div className="dashboard-grid">

                <div className="content-card">

                    <div className="card-header">

                        <div>

                            <h3>
                                Quick Actions
                            </h3>

                            <p>
                                Frequently used
                                operations
                            </p>

                        </div>

                    </div>

                    <div className="quick-actions">

                        <Link
                            to="/books"
                            className="quick-action"
                        >

                            <span>
                                📚
                            </span>

                            <div>

                                <strong>
                                    Manage Books
                                </strong>

                                <small>
                                    Add, edit or
                                    remove books
                                </small>

                            </div>

                        </Link>

                        <Link
                            to="/members"
                            className="quick-action"
                        >

                            <span>
                                👥
                            </span>

                            <div>

                                <strong>
                                    Manage Members
                                </strong>

                                <small>
                                    Manage library
                                    members
                                </small>

                            </div>

                        </Link>

                        <Link
                            to="/loans"
                            className="quick-action"
                        >

                            <span>
                                🔄
                            </span>

                            <div>

                                <strong>
                                    Manage Loans
                                </strong>

                                <small>
                                    Borrow and return
                                    books
                                </small>

                            </div>

                        </Link>

                        <Link
                            to="/reports"
                            className="quick-action"
                        >

                            <span>
                                📊
                            </span>

                            <div>

                                <strong>
                                    View Reports
                                </strong>

                                <small>
                                    Check library
                                    statistics
                                </small>

                            </div>

                        </Link>

                    </div>

                </div>

                <div className="content-card">

                    <div className="card-header">

                        <div>

                            <h3>
                                Library Summary
                            </h3>

                            <p>
                                Current system status
                            </p>

                        </div>

                    </div>

                    <div className="summary-list">

                        <div>
                            <span>
                                Returned Loans
                            </span>

                            <strong>
                                {summary.returnedLoans}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Active Loans
                            </span>

                            <strong>
                                {summary.activeLoans}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Overdue Loans
                            </span>

                            <strong className="danger-text">
                                {summary.overdueLoans}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Total Fines
                            </span>

                            <strong>
                                ₹
                                {summary.totalFines}
                            </strong>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;