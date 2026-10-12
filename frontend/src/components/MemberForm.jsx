 import { useEffect, useState } from "react";

function MemberForm({
    editingMember,
    onMemberSaved,
    onCancel
}) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        status: "active"
    });

    useEffect(() => {

        if (editingMember) {

            setFormData({
                name: editingMember.name || "",
                email: editingMember.email || "",
                phone: editingMember.phone || "",
                status: editingMember.status || "active"
            });

        } else {

            setFormData({
                name: "",
                email: "",
                phone: "",
                status: "active"
            });

        }

    }, [editingMember]);

    const handleChange = (event) => {

        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            const url = editingMember
                ? `http://localhost:5000/api/members/${editingMember.id}`
                : "http://localhost:5000/api/members";

            const method = editingMember
                ? "PUT"
                : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Something went wrong");
                return;
            }

            alert(
                editingMember
                    ? "Member updated successfully"
                    : "Member added successfully"
            );

            onMemberSaved();

        } catch (error) {

            console.error(
                "Member save error:",
                error
            );

            alert("Unable to save member");
        }
    };

    return (
        <div className="form-card">

            <div className="card-header">

                <h3>
                    {editingMember
                        ? "Edit Member"
                        : "Register New Member"}
                </h3>

                <p>
                    {editingMember
                        ? "Update member information."
                        : "Register a new member in the library."}
                </p>

            </div>

            <form onSubmit={handleSubmit}>

                <div className="form-grid">

                    <div className="form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter member name"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Phone
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Status
                        </label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="active">
                                Active
                            </option>

                            <option value="suspended">
                                Suspended
                            </option>
                        </select>

                    </div>

                </div>

                <button
                    type="submit"
                    className="form-button"
                >
                    {editingMember
                        ? "Update Member"
                        : "Register Member"}
                </button>

                {editingMember && (

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

export default MemberForm;