 import { Link } from "react-router-dom";

const features = [
    {
        icon: "📚",
        title: "Explore Books",
        text: "Browse the collection and find books that interest you."
    },
    {
        icon: "🔄",
        title: "Borrow Books",
        text: "See availability and keep track of your borrowing."
    },
    {
        icon: "📅",
        title: "Track Due Dates",
        text: "Review your borrowed books and their due dates."
    },
    {
        icon: "🛡️",
        title: "Role-Based Access",
        text: "Dedicated management tools for admins and a simple experience for readers."
    }
];

function Landing() {
    return (
        <div className="landing-page">
            <nav className="landing-navbar">
                <Link
                    to="/"
                    className="landing-logo"
                >
                    <div className="landing-logo-icon">
                        📚
                    </div>

                    <div>
                        <strong>LibraSys</strong>
                        <span>Library Management</span>
                    </div>
                </Link>

                <div className="landing-nav-links">
                    <a href="#features">Features</a>
                    <a href="#collection">Collection</a>
                    <a href="#how-it-works">How It Works</a>
                </div>

                <div className="landing-auth-buttons">
                    <Link
                        to="/login"
                        className="landing-login-button"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="landing-register-button"
                    >
                        Register
                    </Link>
                </div>
            </nav>

            <section className="landing-hero">
                <div className="landing-hero-content">
                    <div className="hero-badge">
                        ✦ A smarter way to explore books
                    </div>

                    <h1>
                        Your library,
                        <br />
                        <span>beautifully organized.</span>
                    </h1>

                    <p>
                        Discover available books, borrow what you
                        love, and track your reading journey.
                        Library administrators get the tools they
                        need to manage the collection.
                    </p>

                    <div className="hero-buttons">
                        <Link
                            to="/register"
                            className="hero-primary-button"
                        >
                            Create Account <span>→</span>
                        </Link>

                        <Link
                            to="/login"
                            className="hero-secondary-button"
                        >
                            Sign In
                        </Link>
                    </div>

                    <div className="landing-trust-note">
                        <span>✓</span>
                        Separate experiences for readers and admins
                    </div>
                </div>

                <div className="landing-hero-visual">
                    <div className="hero-glow" />

                    <div className="landing-book-stack">
                        <div className="landing-book book-one">
                            STORIES
                        </div>
                        <div className="landing-book book-two">
                            KNOWLEDGE
                        </div>
                        <div className="landing-book book-three">
                            DISCOVER
                        </div>
                        <div className="landing-book book-four">
                            LEARN
                        </div>
                    </div>

                    <div className="landing-floating-card floating-card-one">
                        <span>📖</span>
                        <div>
                            <strong>Find your next read</strong>
                            <small>Browse available books</small>
                        </div>
                    </div>

                    <div className="landing-floating-card floating-card-two">
                        <span>✓</span>
                        <div>
                            <strong>Easy borrowing</strong>
                            <small>Keep track of due dates</small>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="landing-section"
                id="features"
            >
                <div className="section-heading landing-section-heading">
                    <span>LIBRASYS FEATURES</span>
                    <h2>Everything you need in one library.</h2>
                    <p>
                        Simple tools for readers and powerful
                        management features for administrators.
                    </p>
                </div>

                <div className="landing-feature-grid">
                    {features.map((feature) => (
                        <article
                            className="landing-feature-card"
                            key={feature.title}
                        >
                            <div className="landing-feature-icon">
                                {feature.icon}
                            </div>

                            <h3>{feature.title}</h3>
                            <p>{feature.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section
                className="landing-collection-section"
                id="collection"
            >
                <div>
                    <span className="landing-eyebrow">
                        YOUR NEXT CHAPTER
                    </span>

                    <h2>
                        Find a book.
                        <br />
                        Start something new.
                    </h2>

                    <p>
                        Register to explore the available collection
                        and manage your borrowing history in one place.
                    </p>

                    <Link
                        to="/register"
                        className="hero-primary-button"
                    >
                        Explore the Library →
                    </Link>
                </div>

                <div className="landing-collection-illustration">
                    <span>📚</span>
                    <span>📖</span>
                    <span>📘</span>
                </div>
            </section>

            <section
                className="landing-how-section"
                id="how-it-works"
            >
                <div className="section-heading landing-section-heading">
                    <span>GET STARTED</span>
                    <h2>Three simple steps.</h2>
                </div>

                <div className="landing-steps">
                    <article>
                        <span>01</span>
                        <h3>Create an account</h3>
                        <p>Register as a library user.</p>
                    </article>

                    <article>
                        <span>02</span>
                        <h3>Explore the collection</h3>
                        <p>See books and available copies.</p>
                    </article>

                    <article>
                        <span>03</span>
                        <h3>Borrow and track</h3>
                        <p>Borrow books and check their due dates.</p>
                    </article>
                </div>
            </section>

            <section className="landing-final-cta">
                <h2>Ready to explore your library?</h2>
                <p>
                    Create your account and discover the collection.
                </p>

                <Link
                    to="/register"
                    className="landing-register-button"
                >
                    Register Now →
                </Link>
            </section>

            <footer className="landing-footer">
                <div className="landing-logo">
                    <div className="landing-logo-icon">📚</div>
                    <div>
                        <strong>LibraSys</strong>
                        <span>Library Management</span>
                    </div>
                </div>

                <p>
                    A simple platform for books, readers and library
                    management.
                </p>

                <span>© 2026 LibraSys</span>
            </footer>
        </div>
    );
}

export default Landing;