import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from '../../context/Auth'

function ProtectedRoute() {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated){
        return <Navigate to="/" replace />
    }
    return <Outlet/>
}

export default ProtectedRoute