import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { REFRESH_TOKEN } from "@/constants";

function isTokenExpired(token) {
    if (!token) return true;
    return jwtDecode(token).exp < Date.now() / 1000;
}

function ProtectedRoute({ children }) {
    const refresh = localStorage.getItem(REFRESH_TOKEN);

    if (isTokenExpired(refresh)) {
        localStorage.clear();
        return <Navigate to="/login" />;
    }
    return children;
}

export default ProtectedRoute;
