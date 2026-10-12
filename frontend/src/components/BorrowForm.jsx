 import { useState } from "react";

function BorrowForm({
    books,
    members,
    onBorrow
}) {

    const getToday = () => {
        return new Date()
            .toISOString()
            .split("T")[0];
    };

    const getDueDate = () => {

        const date = new Date();

        date.setDate(
            date.getDate() + 14
        );

        return date
            .toISOString()
            .split("T")[0];
    };

    const [formData, setFormData] = useState({
        book_id: "",
        member_id: "",
        borrow_date: getToday(),
        due_date: getDueDate()
    });

    const handleChange = (event) => {

        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:5000/api/loans/borrow",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        ...formData,
                        book_id: Number(formData.book_id),
                        member_id: Number(formData.member_id)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to borrow book"
                );

                return;
            }

            alert(
                "Book borrowed successfully"
            );

            setFormData({
                book_id: "",
                member_id: "",
                borrow_date: getToday(),
                due_date: getDueDate()
            });

            onBorrow();

        } catch (error) {

            console.error(
                "Borrow error:",
                error
            );

            alert(
                "Unable to borrow book"
            );
        }
    };

    const availableBooks =
        books.filter(
            (book) =>
                Number(book.available_copies) > 0
        );

    const activeMembers =
        members.filter(
            (member) =>
                member.status === "active"
        );

    return (
        <div className="form-card">

            <div className="card-header">

                <h3>
                    Issue a Book
                </h3>

                <p>
                    Select an available book and active member.
                </p>

            </div>

            <form onSubmit={handleSubmit}>

                <div className="form-grid">

                    <div className="form-group">

                        <label>
                            Select Book
                        </label>

                        <select
                            name="book_id"
                            value={formData.book_id}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Choose a book
                            </option>

                            {availableBooks.map(
                                (book) => (

                                    <option
                                        key={book.id}
                                        value={book.id}
                                    >
                                        {book.title}
                                        {" "}
                                        ({book.available_copies}
                                        {" "}
                                        available)
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                    <div className="form-group">

                        <label>
                            Select Member
                        </label>

                        <select
                            name="member_id"
                            value={formData.member_id}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Choose a member
                            </option>

                            {activeMembers.map(
                                (member) => (

                                    <option
                                        key={member.id}
                                        value={member.id}
                                    >
                                        {member.name}
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                    <div className="form-group">

                        <label>
                            Borrow Date
                        </label>

                        <input
                            type="date"
                            name="borrow_date"
                            value={formData.borrow_date}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Due Date
                        </label>

                        <input
                            type="date"
                            name="due_date"
                            value={formData.due_date}
                            onChange={handleChange}
                            required
                        />

                    </div>

                </div>

                <button
                    type="submit"
                    className="form-button"
                >
                    Borrow Book
                </button>

            </form>

        </div>
    );
}

export default BorrowForm; 