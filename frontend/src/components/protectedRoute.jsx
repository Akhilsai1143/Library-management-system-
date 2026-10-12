 import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
    const token = localStorage.getItem("token");

    let user = null;

    try {
        user = JSON.parse(
            localStorage.getItem("user") || "null"
        );
    } catch {
        user = null;
    }

    if (!token || !user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (role && user.role !== role) {
        if (user.role === "admin") {
            return (
                <Navigate
                    to="/dashboard"
                    replace
                />
            );
        }

        return (
            <Navigate
                to="/user"
                replace
            />
        );
    }

    return children;
}

export default ProtectedRoute;