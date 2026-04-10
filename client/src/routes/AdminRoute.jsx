import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/api/api";
import ProtectedRoute from "@/routes/ProtectedRoute";

function AdminRoute({ children }) {
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        api.get("/api/auth/me/")
            .then(res => setIsAdmin(res.data.role === "admin"))
            .catch(() => setIsAdmin(false));
    }, []);

    if (isAdmin === null) return <div className="flex items-center justify-center h-screen text-sm text-slate-500">Checking access…</div>;
    if (isAdmin) return <ProtectedRoute>{children}</ProtectedRoute>;
    return <Navigate to="/login" />;
}

export default AdminRoute;
