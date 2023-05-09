import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import AdminPage from "../Admin/AdminPage/AdminPage";

import { useContext } from "react"


const RequireAuth = ({ allowedRole }: { allowedRole: string }) => {

    const authContext = useContext(AuthContext)
    const location = useLocation();

    return (
        authContext?.auth?.role === allowedRole ?
            <Outlet />
            : authContext?.auth?.userid ?
                <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/" state={{ from: location }} replace />
    )
}

export default RequireAuth;