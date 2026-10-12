 import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";
import UserNavbar from "./components/UserNavbar";
import ProtectedRoute from "./components/protectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import Loans from "./pages/Loans";
import Reports from "./pages/Reports";

import UserCatalog from "./pages/UserCatalog";
import MyLoans from "./pages/MyLoans";

 
function AdminLayout() {
    return (
        <ProtectedRoute role="admin">
            <div className="app-layout">
                <Navbar />

                <main className="main-content">
                    <Routes>
                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/books"
                            element={<Books />}
                        />

                        <Route
                            path="/members"
                            element={<Members />}
                        />

                        <Route
                            path="/loans"
                            element={<Loans />}
                        />

                        <Route
                            path="/reports"
                            element={<Reports />}
                        />

                        <Route
                            path="*"
                            element={
                                <Navigate
                                    to="/dashboard"
                                    replace
                                />
                            }
                        />
                    </Routes>
                </main>
            </div>
        </ProtectedRoute>
    );
}

function UserLayout() {
    return (
        <ProtectedRoute role="user">
            <div className="user-app-layout">
                <UserNavbar />

                <main className="user-main-content">
                    <Routes>
                        <Route
                            index
                            element={<UserCatalog />}
                        />

                        <Route
                            path="my-loans"
                            element={<MyLoans />}
                        />

                        <Route
                            path="*"
                            element={
                                <Navigate
                                    to="/user"
                                    replace
                                />
                            }
                        />
                    </Routes>
                </main>
            </div>
        </ProtectedRoute>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Landing />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/user/*"
                    element={<UserLayout />}
                />

                <Route
                    path="/*"
                    element={<AdminLayout />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;