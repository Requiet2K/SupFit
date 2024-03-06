import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout, selectCurrentToken } from "./authSlice"
import { showTimeoutModal } from "../../components/swalInfo/swalInfo";

export const RequireNonAuth = () => {
    const token = useSelector(selectCurrentToken);
    const logged = localStorage.getItem("userLoggedIn");
    return (
        (token && logged == "true")
            ? <Navigate to="/home" replace />
            : <Outlet />
    )
}

export const RequireAuth = () => {
    const token = useSelector(selectCurrentToken);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const isTokenValid = () => {
        if (token) {
            try {
                const storedExp = localStorage.getItem('exp');
                if (storedExp !== null) {
                    const parsedExp = parseInt(storedExp, 10);
                    const currentTimestamp = Math.floor(Date.now() / 1000);
                    if(parsedExp > currentTimestamp){
                        return true;
                    }else{
                        showTimeoutModal();
                        dispatch(logout({}));
                        navigate("/login");
                    }
                }
            } catch (error) {
                return false;
            }
        }
        return false;
    };

    return (
        isTokenValid()
            ? <Outlet />
            : <Navigate to="/login" replace />
    );
};
