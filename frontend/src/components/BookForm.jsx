 import { useEffect, useState } from "react";

function BookForm({
    editingBook,
    onBookSaved,
    onCancel
}) {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        isbn: "",
        category: "",
        total_copies: ""
    });

    useEffect(() => {
        if (editingBook) {
            setFormData({
                title: editingBook.title || "",
                author: editingBook.author || "",
                isbn: editingBook.isbn || "",
                category: editingBook.category || "",
                total_copies: editingBook.total_copies || ""
            });
        } else {
            setFormData({
                title: "",
                author: "",
                isbn: "",
                category: "",
                total_copies: ""
            });
        }
    }, [editingBook]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const url = editingBook
                ? `http://localhost:5000/api/books/${editingBook.id}`
                : "http://localhost:5000/api/books";

            const method = editingBook ? "PUT" : "POST";

            const body = {
                ...formData,
                total_copies: Number(formData.total_copies),
                available_copies: editingBook
                    ? editingBook.available_copies
                    : Number(formData.total_copies)
            };

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Something went wrong");
                return;
            }

            alert(
                editingBook
                    ? "Book updated successfully"
                    : "Book added successfully"
            );

            onBookSaved();

        } catch (error) {
            console.error("Book save error:", error);
            alert("Unable to save book");
        }
    };

    return (
        <div className="form-card">

            <div className="card-header">

                <h3>
                    {editingBook
                        ? "Edit Book"
                        : "Add New Book"}
                </h3>

                <p>
                    {editingBook
                        ? "Update the selected book details."
                        : "Add a new book to your library collection."}
                </p>

            </div>

            <form onSubmit={handleSubmit}>

                <div className="form-grid">

                    <div className="form-group">
                        <label>
                            Book Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter book title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Author
                        </label>

                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            placeholder="Enter author name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            ISBN
                        </label>

                        <input
                            type="text"
                            name="isbn"
                            value={formData.isbn}
                            onChange={handleChange}
                            placeholder="Enter ISBN"
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Category
                        </label>

                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="e.g. Fiction"
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Total Copies
                        </label>

                        <input
                            type="number"
                            name="total_copies"
                            value={formData.total_copies}
                            onChange={handleChange}
                            min="1"
                            placeholder="Enter number of copies"
                            required
                        />
                    </div>

                </div>

                <button
                    type="submit"
                    className="form-button"
                >
                    {editingBook
                        ? "Update Book"
                        : "Add Book"}
                </button>

                {editingBook && (
                    <button
                        type="button"
                        className="action-button edit-button"
                        style={{
                            marginLeft: "8px"
                        }}
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                )}

            </form>

        </div>
    );
}

export default BookForm;