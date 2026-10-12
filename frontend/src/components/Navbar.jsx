 import { useState } from "react";
import {
    NavLink,
    useNavigate
} from "react-router-dom";


function Navbar() {

    const navigate = useNavigate();

    const [drawerOpen, setDrawerOpen] =
        useState(false);

    const [profileOpen, setProfileOpen] =
        useState(false);


    const storedUser =
        localStorage.getItem("user");


    let user = {
        name: "Library Admin",
        email: "admin@library.com",
        role: "admin"
    };


    if (storedUser) {

        try {

            user = JSON.parse(storedUser);

        } catch (error) {

            console.error(
                "Unable to read user data"
            );

        }

    }


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };


    const closeDrawer = () => {

        setDrawerOpen(false);

    };


    return (

        <>

            {/* TOP NAVBAR */}

            <header className="top-navbar">


                {/* HAMBURGER */}

                <button
                    className="hamburger-button"
                    onClick={() =>
                        setDrawerOpen(true)
                    }
                >

                    <span></span>
                    <span></span>
                    <span></span>

                </button>


                {/* BRAND */}

                <div className="top-brand">

                    <div className="top-brand-icon">
                        📚
                    </div>

                    <div className="top-brand-text">

                        <strong>
                            LibraSys
                        </strong>

                        <span>
                            Library Management
                        </span>

                    </div>

                </div>


                {/* PROFILE */}

                <div className="profile-area">

                    <button
                        className="profile-button"
                        onClick={() =>
                            setProfileOpen(
                                !profileOpen
                            )
                        }
                    >

                        <div className="profile-avatar">
                            👤
                        </div>

                        <div className="profile-name">

                            <strong>
                                {user.name}
                            </strong>

                            <span>
                                Administrator
                            </span>

                        </div>

                        <span className="profile-arrow">
                            {profileOpen
                                ? "▲"
                                : "▼"}
                        </span>

                    </button>


                    {profileOpen && (

                        <div className="profile-dropdown">

                            <div className="profile-dropdown-header">

                                <div className="large-profile-avatar">
                                    👤
                                </div>

                                <div>

                                    <h3>
                                        {user.name}
                                    </h3>

                                    <p>
                                        Administrator
                                    </p>

                                </div>

                            </div>


                            <div className="profile-detail">

                                <span>
                                    ✉️
                                </span>

                                <div>

                                    <small>
                                        Email
                                    </small>

                                    <strong>
                                        {user.email}
                                    </strong>

                                </div>

                            </div>


                            <div className="profile-detail">

                                <span>
                                    🛡️
                                </span>

                                <div>

                                    <small>
                                        Role
                                    </small>

                                    <strong>
                                        {user.role}
                                    </strong>

                                </div>

                            </div>


                            <button
                                className="profile-logout"
                                onClick={handleLogout}
                            >

                                🚪 Logout

                            </button>

                        </div>

                    )}

                </div>

            </header>


            {/* OVERLAY */}

            {drawerOpen && (

                <div
                    className="drawer-overlay"
                    onClick={closeDrawer}
                />

            )}


            {/* DRAWER */}

            <aside
                className={
                    drawerOpen
                        ? "navigation-drawer open"
                        : "navigation-drawer"
                }
            >

                <div className="drawer-header">

                    <div className="drawer-brand">

                        <div className="drawer-brand-icon">
                            📚
                        </div>

                        <div>

                            <strong>
                                LibraSys
                            </strong>

                            <span>
                                Library Management
                            </span>

                        </div>

                    </div>


                    <button
                        className="drawer-close"
                        onClick={closeDrawer}
                    >
                        ×
                    </button>

                </div>


                <div className="drawer-section-title">
                    MAIN MENU
                </div>


                <nav className="drawer-navigation">

                    <NavLink
                        to="/dashboard"
                        onClick={closeDrawer}
                    >
                        <span>🏠</span>
                        Dashboard
                    </NavLink>


                    <NavLink
                        to="/books"
                        onClick={closeDrawer}
                    >
                        <span>📚</span>
                        Books
                    </NavLink>


                    <NavLink
                        to="/members"
                        onClick={closeDrawer}
                    >
                        <span>👥</span>
                        Members
                    </NavLink>


                    <NavLink
                        to="/loans"
                        onClick={closeDrawer}
                    >
                        <span>🔄</span>
                        Loans
                    </NavLink>


                    <NavLink
                        to="/reports"
                        onClick={closeDrawer}
                    >
                        <span>📊</span>
                        Reports
                    </NavLink>

                </nav>


                {/* ONLY LOGOUT AT BOTTOM */}

                <div className="drawer-bottom">

                    <button
                        className="drawer-logout"
                        onClick={handleLogout}
                    >
                        🚪 Logout
                    </button>

                </div>

            </aside>

        </>

    );
}


export default Navbar;