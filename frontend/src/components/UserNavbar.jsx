import { NavLink, useNavigate } from "react-router-dom";

function UserNavbar() {
    const navigate = useNavigate();

    let user = {};

    try {
        user = JSON.parse(
            localStorage.getItem("user") || "{}"
        );
    } catch {
        user = {};
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    }

    return (
        <header className="reader-navbar">
            <NavLink to="/user" className="reader-brand">
                <span className="reader-brand-icon">📚</span>

                <span>
                    <strong>LibraSys</strong>
                    <small>Reader Portal</small>
                </span>
            </NavLink>

            <nav className="reader-navigation">
                <NavLink to="/user" end>
                    Available Books
                </NavLink>

                <NavLink to="/user/my-loans">
                    My Borrowings
                </NavLink>
            </nav>

            <div className="reader-profile">
                <div className="reader-avatar">
                    {(user.name || "R").charAt(0).toUpperCase()}
                </div>

                <div className="reader-profile-details">
                    <strong>{user.name || "Reader"}</strong>
                    <small>Library Member</small>
                </div>

                <button
                    className="reader-logout"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </header>
    );
}

export default UserNavbar;