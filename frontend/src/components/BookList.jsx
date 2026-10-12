 function BookList({
    books,
    onEdit,
    onDelete
}) {
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this book?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/books/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Unable to delete book");
                return;
            }

            alert("Book deleted successfully");

            onDelete();

        } catch (error) {
            console.error("Delete error:", error);
            alert("Unable to delete book");
        }
    };

    return (
        <div className="table-card">

            <div className="card-header" style={{ padding: "22px 22px 0" }}>
                <h3>
                    Book Collection
                </h3>

                <p>
                    All books currently registered in the library.
                </p>
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
                        Add your first book using the form above.
                    </p>

                </div>

            ) : (

                <div className="table-wrapper">

                    <table>

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Book</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Total</th>
                                <th>Available</th>
                                <th>Availability</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {books.map((book) => {

                                const available =
                                    Number(book.available_copies);

                                const total =
                                    Number(book.total_copies);

                                return (
                                    <tr key={book.id}>

                                        <td>
                                            #{book.id}
                                        </td>

                                        <td>
                                            <strong>
                                                {book.title}
                                            </strong>
                                        </td>

                                        <td>
                                            {book.author}
                                        </td>

                                        <td>
                                            {book.category || "-"}
                                        </td>

                                        <td>
                                            {total}
                                        </td>

                                        <td>
                                            {available}
                                        </td>

                                        <td>

                                            {available > 0 ? (
                                                <span className="status-badge status-active">
                                                    Available
                                                </span>
                                            ) : (
                                                <span className="status-badge status-overdue">
                                                    Unavailable
                                                </span>
                                            )}

                                        </td>

                                        <td>

                                            <button
                                                className="action-button edit-button"
                                                onClick={() =>
                                                    onEdit(book)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="action-button delete-button"
                                                onClick={() =>
                                                    handleDelete(book.id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>
                                );
                            })}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default BookList;