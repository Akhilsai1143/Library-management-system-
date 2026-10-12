import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    }

    async function handleRegister(event) {
        event.preventDefault();
        setError("");

        if (form.password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: form.name,
                        email: form.email,
                        phone: form.phone,
                        password: form.password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message || "Registration failed."
                );
                return;
            }

            navigate("/login", {
                replace: true,
                state: {
                    message:
                        "Account created successfully. Please sign in."
                }
            });
        } catch (error) {
            console.error("Registration error:", error);
            setError("Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-decoration auth-decoration-one" />
            <div className="auth-decoration auth-decoration-two" />

            <Link to="/" className="auth-back-link">
                ← Back to home
            </Link>

            <div className="auth-layout">
                <section className="auth-intro">
                    <div className="auth-logo">📚</div>
                    <p className="auth-eyebrow">JOIN LIBRASYS</p>
                    <h1>Make room for a new favourite.</h1>
                    <p>
                        Create your reader account to explore available
                        books and track your borrowing activity.
                    </p>

                    <div className="auth-benefits">
                        <span>✓ Browse the collection</span>
                        <span>✓ Borrow available books</span>
                        <span>✓ Check due dates and history</span>
                    </div>
                </section>

                <section className="auth-card">
                    <div className="auth-card-heading">
                        <span className="auth-card-icon">✨</span>
                        <h2>Create your account</h2>
                        <p>
                            Fill in your details to join the library.
                        </p>
                    </div>

                    <form onSubmit={handleRegister}>
                        <label className="auth-field">
                            <span>Full name</span>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                autoComplete="name"
                                required
                            />
                        </label>

                        <label className="auth-field">
                            <span>Email address</span>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                            />
                        </label>

                        <label className="auth-field">
                            <span>Phone number (optional)</span>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                autoComplete="tel"
                            />
                        </label>

                        <label className="auth-field">
                            <span>Password</span>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="At least 6 characters"
                                autoComplete="new-password"
                                minLength={6}
                                required
                            />
                        </label>

                        <label className="auth-field">
                            <span>Confirm password</span>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Enter your password again"
                                autoComplete="new-password"
                                required
                            />
                        </label>

                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        <button
                            className="auth-submit"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating account..."
                                : "Create Account →"}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already registered?{" "}
                        <Link to="/login">Sign in</Link>
                    </p>

                    <p className="auth-role-note">
                        Public registration creates a standard user account.
                    </p>
                </section>
            </div>
        </div>
    );
}

export default Register;