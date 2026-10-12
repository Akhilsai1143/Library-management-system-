 import {
    useEffect,
    useState
} from "react";

function Members() {

    const [members, setMembers] =
        useState([]);

    const [showModal, setShowModal] =
        useState(false);

    const [editingMember, setEditingMember] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [formData, setFormData] =
        useState({
            name: "",
            email: "",
            phone: "",
            membership_date: "",
            status: "active"
        });

    const fetchMembers =
        async () => {

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/members"
                    );

                const data =
                    await response.json();

                setMembers(data);

            } catch (error) {

                console.error(
                    "Members error:",
                    error
                );
            }
        };

    useEffect(() => {
        fetchMembers();
    }, []);

    const openAddModal =
        () => {

            setEditingMember(null);

            setFormData({
                name: "",
                email: "",
                phone: "",
                membership_date: new Date()
                    .toISOString()
                    .split("T")[0],
                status: "active"
            });

            setShowModal(true);
        };

    const openEditModal =
        (member) => {

            setEditingMember(member);

            setFormData({
                name: member.name || "",
                email: member.email || "",
                phone: member.phone || "",
                membership_date:
                    member.membership_date ||
                    "",
                status:
                    member.status ||
                    "active"
            });

            setShowModal(true);
        };

    const closeModal =
        () => {

            if (loading) {
                return;
            }

            setShowModal(false);

            setEditingMember(null);
        };

    const handleChange =
        (event) => {

            setFormData(
                (previous) => ({
                    ...previous,

                    [event.target.name]:
                        event.target.value
                })
            );
        };

    const handleSubmit =
        async (event) => {

            event.preventDefault();

            setLoading(true);

            try {

                const url =
                    editingMember
                        ? `http://localhost:5000/api/members/${editingMember.id}`
                        : "http://localhost:5000/api/members";

                const response =
                    await fetch(
                        url,
                        {
                            method:
                                editingMember
                                    ? "PUT"
                                    : "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    formData
                                )
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Unable to save member"
                    );

                    return;
                }

                alert(
                    editingMember
                        ? "Member updated successfully"
                        : "Member added successfully"
                );

                closeModal();

                fetchMembers();

            } catch (error) {

                console.error(
                    "Member save error:",
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
                    "Are you sure you want to delete this member?"
                );

            if (!confirmDelete) {
                return;
            }

            try {

                const response =
                    await fetch(
                        `http://localhost:5000/api/members/${id}`,
                        {
                            method: "DELETE"
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Unable to delete member"
                    );

                    return;
                }

                alert(
                    "Member deleted successfully"
                );

                fetchMembers();

            } catch (error) {

                console.error(
                    "Delete member error:",
                    error
                );

                alert(
                    "Unable to delete member"
                );
            }
        };

    const activeMembers =
        members.filter(
            (member) =>
                member.status === "active"
        ).length;

    const inactiveMembers =
        members.length -
        activeMembers;

    return (

        <div className="page">

            {/* ===============================
                HEADER
            =============================== */}

            <div className="collection-header">

                <div>

                    <p className="page-label">
                        LIBRARY MEMBERS
                    </p>

                    <h1>
                        Members
                    </h1>

                    <p>
                        Manage registered library
                        members in one place.
                    </p>

                </div>

                <div className="collection-header-actions">

                    <button
                        className="add-button"
                        onClick={openAddModal}
                    >
                        + Add Member
                    </button>

                </div>

            </div>

            {/* ===============================
                STATS
            =============================== */}

            <div className="collection-stats">

                <div className="collection-stat">

                    <div className="collection-stat-icon">
                        👥
                    </div>

                    <div className="collection-stat-info">

                        <span>
                            Total Members
                        </span>

                        <strong>
                            {members.length}
                        </strong>

                    </div>

                </div>

                <div className="collection-stat">

                    <div className="collection-stat-icon">
                        ✅
                    </div>

                    <div className="collection-stat-info">

                        <span>
                            Active Members
                        </span>

                        <strong>
                            {activeMembers}
                        </strong>

                    </div>

                </div>

                <div className="collection-stat">

                    <div className="collection-stat-icon">
                        ⏸️
                    </div>

                    <div className="collection-stat-info">

                        <span>
                            Inactive Members
                        </span>

                        <strong>
                            {inactiveMembers}
                        </strong>

                    </div>

                </div>

                <div className="collection-stat">

                    <div className="collection-stat-icon">
                        🪪
                    </div>

                    <div className="collection-stat-info">

                        <span>
                            Registered
                        </span>

                        <strong>
                            {members.length}
                        </strong>

                    </div>

                </div>

            </div>

            {/* ===============================
                MEMBERS TABLE
            =============================== */}

            <section className="members-section">

                <div className="collection-section-header">

                    <div>

                        <h2>
                            Member Directory
                        </h2>

                        <p>
                            All registered library
                            members.
                        </p>

                    </div>

                    <span className="collection-count">
                        {members.length} Members
                    </span>

                </div>

                {members.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-state-icon">
                            👥
                        </div>

                        <h3>
                            No members found
                        </h3>

                        <p>
                            Click "Add Member" to
                            register your first member.
                        </p>

                    </div>

                ) : (

                    <div className="members-table-wrapper">

                        <table className="members-table">

                            <thead>

                                <tr>

                                    <th>
                                        Member
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Phone
                                    </th>

                                    <th>
                                        Membership Date
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {members.map(
                                    (member) => (

                                        <tr
                                            key={
                                                member.id
                                            }
                                        >

                                            <td>

                                                <div className="member-name-cell">

                                                    <div className="member-avatar">
                                                        {member.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                member.name
                                                            }
                                                        </strong>

                                                        <small>
                                                            Member #
                                                            {
                                                                member.id
                                                            }
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>

                                            <td>
                                                {
                                                    member.email
                                                }
                                            </td>

                                            <td>
                                                {
                                                    member.phone ||
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    member.membership_date ||
                                                    "-"
                                                }
                                            </td>

                                            <td>

                                                <span
                                                    className={`member-status ${
                                                        member.status ===
                                                        "active"
                                                            ? "active"
                                                            : "inactive"
                                                    }`}
                                                >
                                                    {
                                                        member.status
                                                    }
                                                </span>

                                            </td>

                                            <td>

                                                <div className="book-actions">

                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            openEditModal(
                                                                member
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                member.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

            {/* ===============================
                MEMBER MODAL
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
                                    {editingMember
                                        ? "Edit Member"
                                        : "Add New Member"}
                                </h2>

                                <p>
                                    {editingMember
                                        ? "Update member information."
                                        : "Enter the details of the new member."}
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
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Enter full name"
                                            value={
                                                formData.name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Enter email address"
                                            value={
                                                formData.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Phone Number
                                        </label>

                                        <input
                                            type="text"
                                            name="phone"
                                            placeholder="Enter phone number"
                                            value={
                                                formData.phone
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Membership Date
                                        </label>

                                        <input
                                            type="date"
                                            name="membership_date"
                                            value={
                                                formData.membership_date
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Member Status
                                        </label>

                                        <select
                                            name="status"
                                            value={
                                                formData.status
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        >

                                            <option value="active">
                                                Active
                                            </option>

                                            <option value="inactive">
                                                Inactive
                                            </option>

                                        </select>

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
                                        : editingMember
                                            ? "Update Member"
                                            : "Add Member"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Members;