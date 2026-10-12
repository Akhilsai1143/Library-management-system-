 import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");


        if (!email.trim()) {

            setError(
                "Please enter your email"
            );

            return;
        }


        if (!password.trim()) {

            setError(
                "Please enter your password"
            );

            return;
        }


        try {

            setLoading(true);


            const response =
                await fetch(
                    "http://localhost:5000/api/auth/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                setError(
                    data.message ||
                    "Login failed"
                );

                return;
            }


            localStorage.setItem(
                "token",
                data.token
            );


            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            navigate("/dashboard");


        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            setError(
                "Unable to connect to server"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="login-page">

            <div className="login-background-shape shape-one">
            </div>

            <div className="login-background-shape shape-two">
            </div>


            <div className="login-container">


                {/* LEFT SIDE */}

                <div className="login-brand-section">

                    <div className="login-brand-icon">
                        📚
                    </div>

                    <h1>
                        LibraSys
                    </h1>

                    <p className="login-brand-subtitle">
                        Library Management System
                    </p>

                    <div className="login-brand-line">
                    </div>

                    <h2>
                        Manage your library
                        <br />
                        smarter and faster.
                    </h2>

                    <p className="login-brand-description">
                        Manage books, members,
                        borrowing, returns and
                        reports from one simple
                        platform.
                    </p>


                    <div className="login-features">

                        <div className="login-feature">
                            <span>✓</span>
                            <p>
                                Manage Books & Members
                            </p>
                        </div>

                        <div className="login-feature">
                            <span>✓</span>
                            <p>
                                Track Borrowing & Returns
                            </p>
                        </div>

                        <div className="login-feature">
                            <span>✓</span>
                            <p>
                                Monitor Library Reports
                            </p>
                        </div>

                    </div>

                </div>


                {/* LOGIN CARD */}

                <div className="login-card">

                    <div className="login-card-header">

                        <div className="mobile-login-icon">
                            📚
                        </div>

                        <h2>
                            Welcome Back
                        </h2>

                        <p>
                            Sign in to access your
                            library dashboard
                        </p>

                    </div>


                    <form
                        onSubmit={handleLogin}
                    >

                        {/* EMAIL */}

                        <div className="login-form-group">

                            <label>
                                Email Address
                            </label>

                            <div className="login-input-wrapper">

                                <span className="login-input-icon">
                                    ✉️
                                </span>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="login-form-group">

                            <label>
                                Password
                            </label>

                            <div className="login-input-wrapper">

                                <span className="login-input-icon">
                                    🔒
                                </span>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {showPassword
                                        ? "🙈"
                                        : "👁️"}
                                </button>

                            </div>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="login-error">
                                ⚠️ {error}
                            </div>

                        )}


                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Signing in..."
                                : "Sign In"}

                            {!loading && (
                                <span>→</span>
                            )}

                        </button>

                    </form>


                    <div className="login-footer">

                        <span>
                            🔐
                        </span>

                        <p>
                            Secure Library Management
                        </p>

                    </div>

                </div>

            </div>


            <div className="login-copyright">
                © 2026 LibraSys. Library Management System.
            </div>

        </div>

    );
}

export default Login;