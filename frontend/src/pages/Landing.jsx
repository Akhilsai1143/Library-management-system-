 
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api/books";
const SERVER_URL = "http://localhost:5000";

const featuredBooks = [
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "9780743273565",
        category: "Classic",
        image:
            "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg",
    },
    {
        title: "Atomic Habits",
        author: "James Clear",
        isbn: "9780735211292",
        category: "Self Improvement",
        image:
            "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
    },
    {
        title: "The Alchemist",
        author: "Paulo Coelho",
        isbn: "9780061122415",
        category: "Fiction",
        image:
            "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg",
    },
    {
        title: "Rich Dad Poor Dad",
        author: "Robert T. Kiyosaki",
        isbn: "9781612680194",
        category: "Finance",
        image:
            "https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg",
    },
];

function getBookImage(book) {
    const rawImage =
        book.image ||
        book.image_url ||
        book.cover_image ||
        book.coverImage ||
        book.imageUrl ||
        "";

    if (typeof rawImage === "string" && rawImage.trim()) {
        const image = rawImage.trim();

        if (
            image.startsWith("https://") ||
            image.startsWith("http://") ||
            image.startsWith("data:image/")
        ) {
            return image;
        }

        if (image.startsWith("/")) {
            return `${SERVER_URL}${image}`;
        }

        if (image.startsWith("uploads/")) {
            return `${SERVER_URL}/${image}`;
        }

        return `${SERVER_URL}/uploads/${image}`;
    }

    const isbn = String(book.isbn || "").replace(/[^0-9Xx]/g, "");

    if (isbn) {
        return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(
            isbn
        )}-L.jpg`;
    }

    return "";
}

function BookCover({ book }) {
    const [imageSource, setImageSource] = useState(() =>
        getBookImage(book)
    );
    const [showFallback, setShowFallback] = useState(!getBookImage(book));
    const triedOnlineCover = useRef(false);

    useEffect(() => {
        setImageSource(getBookImage(book));
        setShowFallback(!getBookImage(book));
        triedOnlineCover.current = false;
    }, [
        book.id,
        book.image,
        book.image_url,
        book.cover_image,
        book.coverImage,
        book.isbn,
    ]);

    function handleImageError() {
        const isbn = String(book.isbn || "").replace(/[^0-9Xx]/g, "");

        if (
            isbn &&
            !triedOnlineCover.current &&
            !imageSource.includes("covers.openlibrary.org")
        ) {
            triedOnlineCover.current = true;
            setImageSource(
                `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(
                    isbn
                )}-L.jpg`
            );
            return;
        }

        setShowFallback(true);
    }

    return (
        <div className="book-cover-wrapper">
            {!showFallback && imageSource && (
                <img
                    className="book-cover-image"
                    src={imageSource}
                    alt={`Cover of ${book.title || "book"}`}
                    loading="lazy"
                    onError={handleImageError}
                />
            )}

            {showFallback && (
                <div className="book-cover-fallback">
                    <span>📚</span>
                    <span>{book.title || "Book cover unavailable"}</span>
                </div>
            )}
        </div>
    );
}

function Landing() {
    const [books, setBooks] = useState([]);
    const [loadingBooks, setLoadingBooks] = useState(true);
    const [booksError, setBooksError] = useState(false);
    const [carouselPaused, setCarouselPaused] = useState(false);
    const carouselRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchBooks() {
            try {
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error("Unable to fetch books");
                }

                const data = await response.json();

                const bookList = Array.isArray(data)
                    ? data
                    : Array.isArray(data.books)
                      ? data.books
                      : Array.isArray(data.data)
                        ? data.data
                        : [];

                if (isMounted) {
                    setBooks(bookList);
                    setBooksError(false);
                }
            } catch (error) {
                console.error("Landing page books error:", error);

                if (isMounted) {
                    setBooksError(true);
                }
            } finally {
                if (isMounted) {
                    setLoadingBooks(false);
                }
            }
        }

        fetchBooks();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const carousel = carouselRef.current;

        if (!carousel || carouselPaused) {
            return undefined;
        }

        const interval = window.setInterval(() => {
            const maxScroll =
                carousel.scrollWidth - carousel.clientWidth;

            if (maxScroll <= 0) {
                return;
            }

            if (carousel.scrollLeft >= maxScroll - 5) {
                carousel.scrollTo({
                    left: 0,
                    behavior: "smooth",
                });
            } else {
                carousel.scrollBy({
                    left: 280,
                    behavior: "smooth",
                });
            }
        }, 3000);

        return () => window.clearInterval(interval);
    }, [carouselPaused, books.length]);

    function moveCarousel(direction) {
        if (!carouselRef.current) {
            return;
        }

        carouselRef.current.scrollBy({
            left: direction * 280,
            behavior: "smooth",
        });
    }

    const displayedBooks = books.length > 0 ? books : featuredBooks;

    return (
        <div className="landing-page">
            <nav className="landing-navbar">
                <Link to="/" className="landing-logo">
                    <div className="landing-logo-icon">📚</div>
                    <div>
                        <strong>LibraSys</strong>
                        <span>Library Management System</span>
                    </div>
                </Link>

                <div className="landing-nav-links">
                    <a href="#home">Home</a>
                    <a href="#collection">Collection</a>
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How It Works</a>
                </div>

                 <div className="landing-auth-buttons">
                     <Link to="/login" className="landing-login-button">
                        Login
                    </Link>

                 <Link to="/register" className="landing-register-button">
                      Register
                          </Link>
                  </div>
            </nav>

            <section className="landing-hero" id="home">
                <div className="landing-hero-content">
                    <span className="page-eyebrow">
                        YOUR DIGITAL LIBRARY
                    </span>

                    <h1>
                        Every Book.
                        <br />
                        Every Reader.
                        <br />
                        <span>One Place.</span>
                    </h1>

                    <p>
                        Discover books, explore knowledge, and manage your
                        library with LibraSys — a simpler way to bring
                        readers and books together.
                    </p>

                    <div className="landing-hero-actions">
                        <Link to="/login" className="landing-login-button">
                            Explore Library →
                        </Link>

                        <a href="#features" className="landing-secondary-button">
                            Discover Features
                        </a>
                    </div>

                    <div className="landing-hero-stats">
                        <div>
                            <strong>{books.length || "—"}</strong>
                            <span>Library Books</span>
                        </div>
                        <div>
                            <strong>24/7</strong>
                            <span>Easy Access</span>
                        </div>
                        <div>
                            <strong>100%</strong>
                            <span>Organized</span>
                        </div>
                    </div>
                </div>

                <div className="landing-hero-visual">
                    <div className="landing-hero-book-card">
                        <div className="landing-hero-book-icon">📖</div>
                        <span>READ · DISCOVER · GROW</span>
                        <h2>A world of knowledge awaits.</h2>
                        <p>Your next favourite book is waiting for you.</p>
                    </div>
                </div>
            </section>

            <section className="landing-collection" id="collection">
                <div className="landing-section-heading">
                    <div>
                        <span className="page-eyebrow">BOOK COLLECTION</span>
                        <h2>Explore the shelves</h2>
                        <p>
                            Discover books from your library collection.
                        </p>
                    </div>

                    <div className="landing-carousel-controls">
                        <button
                            type="button"
                            onClick={() => moveCarousel(-1)}
                            aria-label="Scroll books left"
                        >
                            ←
                        </button>
                        <button
                            type="button"
                            onClick={() => moveCarousel(1)}
                            aria-label="Scroll books right"
                        >
                            →
                        </button>
                    </div>
                </div>

                {loadingBooks && (
                    <p className="landing-books-message">
                        Loading books from your library…
                    </p>
                )}

                {booksError && books.length === 0 && (
                    <p className="landing-books-message">
                        Showing featured books. Start the backend to load
                        your library collection.
                    </p>
                )}

                {!loadingBooks && books.length === 0 && !booksError && (
                    <p className="landing-books-message">
                        Showing featured books.
                    </p>
                )}

                <div
                    className="landing-book-carousel"
                    ref={carouselRef}
                    onMouseEnter={() => setCarouselPaused(true)}
                    onMouseLeave={() => setCarouselPaused(false)}
                    onFocus={() => setCarouselPaused(true)}
                    onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget)) {
                            setCarouselPaused(false);
                        }
                    }}
                >
                    {displayedBooks.map((book, index) => (
                        <article
                            className="landing-book-card"
                            key={book.id || `${book.title}-${index}`}
                        >
                            <Link
                                to="/login"
                                className="landing-book-cover-link"
                                aria-label={`Login to explore ${book.title}`}
                            >
                                <BookCover book={book} />
                            </Link>

                            <div className="landing-book-details">
                                <span className="landing-book-category">
                                    {book.category || "Library Collection"}
                                </span>
                                <h3>{book.title || "Untitled Book"}</h3>
                                <p>{book.author || "Unknown Author"}</p>
                                <Link to="/login" className="landing-book-link">
                                    Explore book →
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="landing-collection-action">
                    <Link to="/login" className="landing-login-button">
                        Explore Full Collection →
                    </Link>
                </div>
            </section>

            <section className="landing-features" id="features">
                <div className="landing-section-heading centered">
                    <span className="page-eyebrow">WHY LIBRASYS</span>
                    <h2>Library management made simpler</h2>
                    <p>
                        Everything you need to keep books and readers organized.
                    </p>
                </div>

                <div className="landing-feature-grid">
                    <article className="landing-feature-card">
                        <div className="landing-feature-icon">📚</div>
                        <h3>Book Management</h3>
                        <p>
                            Keep book details, categories, and availability
                            organized in one place.
                        </p>
                    </article>

                    <article className="landing-feature-card">
                        <div className="landing-feature-icon">👥</div>
                        <h3>Member Management</h3>
                        <p>
                            Maintain member records and make library
                            administration easier.
                        </p>
                    </article>

                    <article className="landing-feature-card">
                        <div className="landing-feature-icon">🔄</div>
                        <h3>Borrow and Return</h3>
                        <p>
                            Track borrowed books, due dates, and returned
                            books efficiently.
                        </p>
                    </article>

                    <article className="landing-feature-card">
                        <div className="landing-feature-icon">📊</div>
                        <h3>Useful Reports</h3>
                        <p>
                            View library activity and keep track of your
                            collection.
                        </p>
                    </article>
                </div>
            </section>

            <section className="landing-how-it-works" id="how-it-works">
                <div>
                    <span className="page-eyebrow">GET STARTED</span>
                    <h2>Your library, one simple step away.</h2>
                    <p>
                        Sign in to access your LibraSys library experience
                        and explore the books available to you.
                    </p>
                    <Link to="/login" className="landing-login-button">
                        Get Started →
                    </Link>
                </div>
            </section>

            <footer className="landing-footer">
                <Link to="/" className="landing-logo">
                    <div className="landing-logo-icon">📚</div>
                    <div>
                        <strong>LibraSys</strong>
                        <span>Library Management System</span>
                    </div>
                </Link>

                <p>
                    Making library management simple, organized, and
                    accessible.
                </p>

                <span>
                    © {new Date().getFullYear()} LibraSys. All rights reserved.
                </span>
            </footer>
        </div>
    );
}

export default Landing;
