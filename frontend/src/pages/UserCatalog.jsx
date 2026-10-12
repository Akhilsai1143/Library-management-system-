import { useEffect, useState } from "react";

const BOOKS_API = "http://localhost:5000/api/books";
const LOANS_API = "http://localhost:5000/api/loans";
const SERVER_URL = "http://localhost:5000";

function getLocalDate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function UserCatalog() {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [borrowingId, setBorrowingId] = useState(null);

    let user = {};

    try {
        user = JSON.parse(
            localStorage.getItem("user") || "{}"
        );
    } catch {
        user = {};
    }

    async function fetchBooks() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(BOOKS_API);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to load books"
                );
            }

            setBooks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Catalogue error:", error);
            setError(
                "Could not load books. Please check the backend server."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBooks();
    }, []);

    async function handleBorrow(book) {
        const memberId = Number(user.memberId);

        if (!memberId) {
            alert(
                "Your library member record was not found. Please contact the administrator."
            );
            return;
        }

        if (Number(book.available_copies) < 1) {
            alert("This book is currently unavailable.");
            return;
        }

        const borrowDate = getLocalDate();

        const due = new Date();
        due.setDate(due.getDate() + 14);

        const dueDate = getLocalDate(due);

        try {
            setBorrowingId(book.id);

            const response = await fetch(
                `${LOANS_API}/borrow`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        book_id: Number(book.id),
                        member_id: memberId,
                        borrow_date: borrowDate,
                        due_date: dueDate
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to borrow this book"
                );
            }

            alert(
                `Book borrowed successfully! Please return it by ${dueDate}.`
            );

            await fetchBooks();
        } catch (error) {
            console.error("Borrow error:", error);
            alert(error.message || "Unable to borrow book.");
        } finally {
            setBorrowingId(null);
        }
    }

    const categories = [
        "All",
        ...new Set(
            books
                .map((book) => book.category)
                .filter(Boolean)
        )
    ];

    const filteredBooks = books.filter((book) => {
        const query = search.toLowerCase();

        const matchesSearch =
            String(book.title || "").toLowerCase().includes(query) ||
            String(book.author || "").toLowerCase().includes(query) ||
            String(book.isbn || "").toLowerCase().includes(query);

        const matchesCategory =
            category === "All" || book.category === category;

        return matchesSearch && matchesCategory;
    });

    const availableTitles = books.filter(
        (book) => Number(book.available_copies) > 0
    ).length;

    const totalAvailableCopies = books.reduce(
        (total, book) =>
            total + Number(book.available_copies || 0),
        0
    );

    return (
        <div className="reader-page">
            <section className="reader-welcome">
                <div>
                    <p className="reader-eyebrow">
                        YOUR READER PORTAL
                    </p>

                    <h1>
                        Welcome, {user.name || "Reader"} 👋
                    </h1>

                    <p>
                        Find your next favourite book and keep
                        track of what you borrow.
                    </p>
                </div>

                <div className="reader-welcome-icon">📖</div>
            </section>

            <section className="reader-stats">
                <article className="reader-stat-card">
                    <span className="reader-stat-icon">📚</span>
                    <div>
                        <small>Book Titles</small>
                        <strong>{books.length}</strong>
                    </div>
                </article>

                <article className="reader-stat-card">
                    <span className="reader-stat-icon">✅</span>
                    <div>
                        <small>Available Titles</small>
                        <strong>{availableTitles}</strong>
                    </div>
                </article>

                <article className="reader-stat-card">
                    <span className="reader-stat-icon">📖</span>
                    <div>
                        <small>Available Copies</small>
                        <strong>{totalAvailableCopies}</strong>
                    </div>
                </article>
            </section>

            <section className="reader-catalogue">
                <div className="reader-section-heading">
                    <div>
                        <h2>Explore the Collection</h2>
                        <p>
                            Choose a book that is currently available.
                        </p>
                    </div>

                    <span className="reader-result-count">
                        {filteredBooks.length} books
                    </span>
                </div>

                <div className="reader-filters">
                    <input
                        type="search"
                        placeholder="Search by title, author or ISBN..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                    <select
                        value={category}
                        onChange={(event) =>
                            setCategory(event.target.value)
                        }
                    >
                        {categories.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {loading && (
                    <div className="reader-message">
                        Loading books...
                    </div>
                )}

                {error && (
                    <div className="reader-error">
                        {error}
                        <button onClick={fetchBooks}>
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && filteredBooks.length === 0 && (
                    <div className="reader-empty">
                        <span>🔎</span>
                        <h3>No books found</h3>
                        <p>Try a different title or category.</p>
                    </div>
                )}

                {!loading && !error && filteredBooks.length > 0 && (
                    <div className="reader-book-grid">
                        {filteredBooks.map((book) => {
                            const available =
                                Number(book.available_copies) > 0;

                            const imageUrl = book.image
                                ? book.image.startsWith("http")
                                    ? book.image
                                    : `${SERVER_URL}${book.image}`
                                : "";

                            return (
                                <article
                                    className="reader-book-card"
                                    key={book.id}
                                >
                                    <div className="reader-book-cover">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={book.title}
                                                onError={(event) => {
                                                    event.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <div className="reader-book-placeholder">
                                                📚
                                            </div>
                                        )}

                                        <span
                                            className={
                                                available
                                                    ? "reader-availability available"
                                                    : "reader-availability unavailable"
                                            }
                                        >
                                            {available
                                                ? "Available"
                                                : "Unavailable"}
                                        </span>
                                    </div>

                                    <div className="reader-book-details">
                                        <span className="reader-book-category">
                                            {book.category || "General"}
                                        </span>

                                        <h3>{book.title}</h3>

                                        <p className="reader-book-author">
                                            by {book.author}
                                        </p>

                                        <div className="reader-book-copy-count">
                                            <span>Copies available</span>
                                            <strong>
                                                {book.available_copies}
                                            </strong>
                                        </div>

                                        <button
                                            className="reader-borrow-button"
                                            disabled={
                                                !available ||
                                                borrowingId === book.id
                                            }
                                            onClick={() =>
                                                handleBorrow(book)
                                            }
                                        >
                                            {!available
                                                ? "Currently Unavailable"
                                                : borrowingId === book.id
                                                    ? "Processing..."
                                                    : "Borrow Book →"}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}

export default UserCatalog;