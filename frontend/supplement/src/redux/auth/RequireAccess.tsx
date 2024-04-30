import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout, selectCurrentToken } from "./authSlice"
import { showErrorModal, showTimeoutModal } from "../../components/swalInfo/swalInfo";
import { useLazyGetLoggedUserQuery } from "./authApiSlice";
import { useEffect } from "react";

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
    const [getLoggedUser] = useLazyGetLoggedUserQuery();

    useEffect(() => {
        const checkUser = async () => {
            try {
                if (typeof token !== 'string') {
                    console.log(typeof token);
                    throw new Error('Invalid token type');
                }
                await getLoggedUser(token).unwrap();
            } catch (err: any) {
                console.log("error:"+err);
                if (err.status === "FETCH_ERROR") {
                    showErrorModal("No server response!", "Server is under maintenance, please try again later.");
                }else if(err == "Error: Invalid token type"){
                    dispatch(logout({}));
                    navigate("/login", { state: { signBoolean: false } });
                    showErrorModal("Login required!", "Please log in or create a new account.");
                }else{
                    dispatch(logout({}));
                    navigate("/login", { state: { signBoolean: true } });
                    showErrorModal("Your account does not exist!", "Please create a new account.");
                }
            }
        };

        checkUser();
    }, [token, navigate, dispatch, getLoggedUser]);

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
