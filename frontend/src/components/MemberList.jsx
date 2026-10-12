 function MemberList({
    members,
    onEdit,
    onDelete
}) {

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this member?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:5000/api/members/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

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

            onDelete();

        } catch (error) {

            console.error(
                "Member delete error:",
                error
            );

            alert("Unable to delete member");
        }
    };

    return (
        <div className="table-card">

            <div
                className="card-header"
                style={{
                    padding: "22px 22px 0"
                }}
            >

                <h3>
                    Registered Members
                </h3>

                <p>
                    All members registered in the library.
                </p>

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
                        Register your first member above.
                    </p>

                </div>

            ) : (

                <div className="table-wrapper">

                    <table>

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Membership Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {members.map((member) => (

                                <tr key={member.id}>

                                    <td>
                                        #{member.id}
                                    </td>

                                    <td>
                                        <strong>
                                            {member.name}
                                        </strong>
                                    </td>

                                    <td>
                                        {member.email}
                                    </td>

                                    <td>
                                        {member.phone || "-"}
                                    </td>

                                    <td>
                                        {member.membership_date
                                            ? new Date(
                                                member.membership_date
                                            ).toLocaleDateString()
                                            : "-"}
                                    </td>

                                    <td>

                                        <span
                                            className={
                                                member.status === "active"
                                                    ? "status-badge status-active"
                                                    : "status-badge status-overdue"
                                            }
                                        >
                                            {member.status}
                                        </span>

                                    </td>

                                    <td>

                                        <button
                                            className="action-button edit-button"
                                            onClick={() =>
                                                onEdit(member)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="action-button delete-button"
                                            onClick={() =>
                                                handleDelete(member.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default MemberList;