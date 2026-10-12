import { useEffect, useRef, useState } from "react";

function AdminProfile() {

    const [open, setOpen] = useState(false);

    const profileRef = useRef(null);

    const [user, setUser] = useState({
        name: "Library Admin",
        email: "admin@library.com",
        role: "admin"
    });


    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {

            try {

                const parsedUser =
                    JSON.parse(storedUser);

                setUser(parsedUser);

            } catch (error) {

                console.error(
                    "Unable to read user details",
                    error
                );

            }

        }

    }, []);


    useEffect(() => {

        function handleOutsideClick(event) {

            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {

                setOpen(false);

            }

        }

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, []);


    const displayName =
        user.name || "Library Admin";

    const displayEmail =
        user.email || "admin@library.com";

    const displayRole =
        user.role || "admin";


    return (

        <div
            className="admin-profile"
            ref={profileRef}
        >

            <button
                className="admin-profile-button"
                onClick={() =>
                    setOpen(!open)
                }
                aria-label="Admin profile"
            >

                <div className="admin-avatar">
                    {displayName
                        .charAt(0)
                        .toUpperCase()}
                </div>

                <div className="admin-profile-name">

                    <strong>
                        {displayName}
                    </strong>

                    <span>
                        Administrator
                    </span>

                </div>

                <span className="profile-arrow">
                    {open ? "▲" : "▼"}
                </span>

            </button>


            {open && (

                <div className="admin-profile-menu">

                    <div className="profile-menu-header">

                        <div className="profile-large-avatar">
                            {displayName
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>

                            <h3>
                                {displayName}
                            </h3>

                            <p>
                                {displayEmail}
                            </p>

                        </div>

                    </div>


                    <div className="profile-menu-divider">
                    </div>


                    <div className="profile-detail">

                        <span>
                            👤
                        </span>

                        <div>
                            <small>
                                Name
                            </small>

                            <strong>
                                {displayName}
                            </strong>
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
                                {displayEmail}
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
                                {displayRole}
                            </strong>
                        </div>

                    </div>


                    <div className="profile-status">

                        <span>
                            ●
                        </span>

                        Account Active

                    </div>

                </div>

            )}

        </div>

    );
}

export default AdminProfile;