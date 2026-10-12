 import {
    useEffect,
    useState
} from "react";

function Books() {

    const [books, setBooks] =
        useState([]);

    const [showModal, setShowModal] =
        useState(false);

    const [editingBook, setEditingBook] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [formData, setFormData] =
        useState({
            title: "",
            author: "",
            isbn: "",
            category: "",
            total_copies: 1,
            image: null
        });

    const fetchBooks =
        async () => {

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/books"
                    );

                const data =
                    await response.json();

                setBooks(data);

            } catch (error) {

                console.error(
                    "Books error:",
                    error
                );
            }
        };

    useEffect(() => {
        fetchBooks();
    }, []);

    const openAddModal =
        () => {

            setEditingBook(null);

            setFormData({
                title: "",
                author: "",
                isbn: "",
                category: "",
                total_copies: 1,
                image: null
            });

            setShowModal(true);
        };

    const openEditModal =
        (book) => {

            setEditingBook(book);

            setFormData({
                title: book.title || "",
                author: book.author || "",
                isbn: book.isbn || "",
                category: book.category || "",
                total_copies:
                    book.total_copies || 1,
                image: null
            });

            setShowModal(true);
        };

    const closeModal =
        () => {

            if (loading) {
                return;
            }

            setShowModal(false);

            setEditingBook(null);
        };

    const handleChange =
        (event) => {

            const {
                name,
                value,
                files
            } = event.target;

            setFormData(
                (previous) => ({
                    ...previous,

                    [name]:
                        name === "image"
                            ? files[0]
                            : value
                })
            );
        };

    const handleSubmit =
        async (event) => {

            event.preventDefault();

            setLoading(true);

            try {

                const body =
                    new FormData();

                body.append(
                    "title",
                    formData.title
                );

                body.append(
                    "author",
                    formData.author
                );

                body.append(
                    "isbn",
                    formData.isbn
                );

                body.append(
                    "category",
                    formData.category
                );

                body.append(
                    "total_copies",
                    formData.total_copies
                );

                if (formData.image) {

                    body.append(
                        "image",
                        formData.image
                    );
                }

                const url =
                    editingBook
                        ? `http://localhost:5000/api/books/${editingBook.id}`
                        : "http://localhost:5000/api/books";

                const response =
                    await fetch(
                        url,
                        {
                            method:
                                editingBook
                                    ? "PUT"
                                    : "POST",

                            body
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Unable to save book"
                    );

                    return;
                }

                alert(
                    editingBook
                        ? "Book updated successfully"
                        : "Book added successfully"
                );

                closeModal();

                fetchBooks();

            } catch (error) {

                console.error(
                    "Save book error:",
                    error
                );

                alert(
                    "Unable to connect to server"
                );

            } finally {

                setLoading(false);
            }
        };

    const handleDelete =
        async (id) => {

            const confirmDelete =
                window.confirm(
                    "Are you sure you want to delete this book?"
                );

            if (!confirmDelete) {
                return;
            }

            try {

                const response =
                    await fetch(
                        `http://localhost:5000/api/books/${id}`,
                        {
                            method: "DELETE"
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Unable to delete book"
                    );

                    return;
                }

                alert(
                    "Book deleted successfully"
                );

                fetchBooks();

            } catch (error) {

                console.error(
                    "Delete book error:",
                    error
                );

                alert(
                    "Unable to delete book"
                );
            }
        };

    const totalBooks =
        books.reduce(
            (
                total,
                book
            ) =>
                total +
                Number(
                    book.total_copies || 0
                ),
            0
        );

    const availableBooks =
        books.reduce(
            (
                total,
                book
            ) =>
                total +
                Number(
                    book.available_copies || 0
                ),
            0
        );

    const borrowedBooks =
        totalBooks -
        availableBooks;

    return (
        <div className="page">

            {/* ===============================
                HEADER
            =============================== */}

            <div className="collection-header">

                <div>

                    <p className="page-label">
                        LIBRARY COLLECTION
                    </p>

                    <h1>
                        Books
                    </h1>

                    <p>
                        Manage your library
                        collection in one place.
                    </p>

                </div>

                <div className="collection-header-actions">

                    <button
                        className="add-button"
                        onClick={openAddModal}
                    >
                        + Add Book
                    </button>

                </div>

            </div>

            {/* ===============================
                STATS
            =============================== */}

            <div className="collection-stats">

                <div className="collection-stat">

                    <div className="collection-stat-icon">
                        📚
                    </div>

                    <div className="collection-stat-info">

                        <span>
                            Total Books
                        </span>

                        <strong>
                            {totalBooks}
                        </strong>

                    </div>

                </div>

                <div className="collection-stat">

                    <div className="collection-stat-icon">
                        ✅
                    </div>

                    <div className="collection-stat-info">

                        <span>
                            Available Books
                        </span>

                        <strong>
                            {availableBooks}
                        </strong>

                    </div>

                </div>

                <div className="collection-stat">

                    <div className="collection-stat-icon">
                        🔄
                    </div>

                    <div className="collection-stat-info">

                        <span>
                            Borrowed Books
                        </span>

                        <strong>
                            {borrowedBooks}
                        </strong>

                    </div>

                </div>

                <div className="collection-stat">

                    <div className="collection-stat-icon">
                        📖
                    </div>

                    <div className="collection-stat-info">

                        <span>
                            Book Titles
                        </span>

                        <strong>
                            {books.length}
                        </strong>

                    </div>

                </div>

            </div>

            {/* ===============================
                BOOK COLLECTION
            =============================== */}

            <section className="collection-section">

                <div className="collection-section-header">

                    <div>

                        <h2>
                            Book Collection
                        </h2>

                        <p>
                            All books registered
                            in the library.
                        </p>

                    </div>

                    <span className="collection-count">
                        {books.length} Titles
                    </span>

                </div>

                {books.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-state-icon">
                            📚
                        </div>

                        <h3>
                            No books found
                        </h3>

                        <p>
                            Click "Add Book" to
                            add your first book.
                        </p>

                    </div>

                ) : (

                    <div className="book-grid">

                        {books.map(
                            (book) => (

                                <div
                                    className="book-card"
                                    key={book.id}
                                >

                                    <div className="book-cover">

                                        {book.image ? (

                                            <img
                                                src={
                                                    book.image.startsWith(
                                                        "http"
                                                    )
                                                        ? book.image
                                                        : `http://localhost:5000${book.image}`
                                                }
                                                alt={
                                                    book.title
                                                }
                                            />

                                        ) : (

                                            <div className="book-cover-placeholder">
                                                📚
                                            </div>

                                        )}

                                    </div>

                                    <div className="book-details">

                                        <h3>
                                            {book.title}
                                        </h3>

                                        <p className="book-author">
                                            by{" "}
                                            {book.author}
                                        </p>

                                        <div className="book-meta">

                                            <span>
                                                {book.category ||
                                                    "General"}
                                            </span>

                                            <span>
                                                {book.available_copies}
                                                /
                                                {book.total_copies}
                                                {" "}
                                                available
                                            </span>

                                        </div>

                                        <div className="book-actions">

                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    openEditModal(
                                                        book
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        book.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

            {/* ===============================
                ADD / EDIT BOOK MODAL
            =============================== */}

            {showModal && (

                <div
                    className="modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeModal();
                        }

                    }}
                >

                    <div className="modal">

                        <div className="modal-header">

                            <div>

                                <h2>
                                    {editingBook
                                        ? "Edit Book"
                                        : "Add New Book"}
                                </h2>

                                <p>
                                    {editingBook
                                        ? "Update book information."
                                        : "Enter the details of the new book."}
                                </p>

                            </div>

                            <button
                                className="modal-close"
                                onClick={closeModal}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                        >

                            <div className="modal-body">

                                <div className="modal-form">

                                    <div className="form-field">

                                        <label>
                                            Book Title
                                        </label>

                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="Enter book title"
                                            value={
                                                formData.title
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Author
                                        </label>

                                        <input
                                            type="text"
                                            name="author"
                                            placeholder="Enter author name"
                                            value={
                                                formData.author
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            ISBN
                                        </label>

                                        <input
                                            type="text"
                                            name="isbn"
                                            placeholder="Enter ISBN"
                                            value={
                                                formData.isbn
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Category
                                        </label>

                                        <input
                                            type="text"
                                            name="category"
                                            placeholder="e.g. Programming"
                                            value={
                                                formData.category
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Total Copies
                                        </label>

                                        <input
                                            type="number"
                                            name="total_copies"
                                            min="1"
                                            value={
                                                formData.total_copies
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Book Cover
                                        </label>

                                        <input
                                            className="file-input"
                                            type="file"
                                            name="image"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>

                                </div>

                            </div>

                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={closeModal}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Saving..."
                                        : editingBook
                                            ? "Update Book"
                                            : "Add Book"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Books;