import { useContext, useEffect, useState } from 'react';
import '../../style/LoginPage/LoginPage.css';
import { useFormik } from 'formik';
import { signUpSchema } from './yup/signUpYup';
import { signInSchema } from './yup/signInYup';
import ClockLoader  from "react-spinners/ClockLoader";
import { useLocation } from 'react-router-dom';
import { showErrorModal, showSuccessLoginModal, showSuccessRegisteredMethod } from '../swalInfo/swalInfo';
import { useLoginMutation, useLazyGetLoggedUserQuery, useRegisterMutation } from '../../redux/auth/authApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/auth/authSlice';
import { useNavigate } from 'react-router-dom'
import { AuthState, UserState } from '../../types/userTypes';
import { ForgetPassword } from './ForgetPassword';
import { CartContext } from '../../context/CartContext';

export const LoginPage: React.FC<{signBoolean?: boolean}> = (props) => {

    const [forgotPassword, setForgotPassword] = useState(false);

    const handleCancelForgetPassword = () => {
        setForgotPassword(false);
      };

    const { signBoolean = false } = props;

    const [signUpPage, setSignUpPage] = useState<boolean>();

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [signIn, { isLoading: isLoadingSignIn }] = useLoginMutation();
    const [signUp, { isLoading: isLoadingSignUp }] = useRegisterMutation();

    const [getLoggedUser] = useLazyGetLoggedUserQuery();

    const user = useSelector((state: {auth: AuthState}) => state.auth.user);
    const { getBoxItems, boxProducts, takeUserCartItems, saveBeforeLoginCartItems} = useContext(CartContext);
    
    const handleLoginSubmit = async () => {
        try {
            const userData = await signIn({ email: formikSignIn.values.signEmail , password: formikSignIn.values.signPassword }).unwrap();
            const data: UserState = await getLoggedUser(userData.token).unwrap();
            dispatch(login({ ...userData, user: data }));
            data.cartItems.forEach((item) => (
                takeUserCartItems(item.product, item.quantity)
            ));
            getBoxItems();
        } catch (err: any) {
            if (err.status === "FETCH_ERROR") {
                showErrorModal("No server response!", "Server is under maintenance, please try again later.");
            } else {
                if (err.status === 403) {
                    showErrorModal("Wrong email or password", "Please check your login informations again.");
                } else {
                    console.log(err);
                    showErrorModal("Login failed!", "Please try again.");
                }
            }
        }
    }

    const handleRegisterSubmit = async () => {
        try{
            await signUp({
                email: formikSignUp.values.email,
                firstName: formikSignUp.values.firstName,
                lastName: formikSignUp.values.lastName,
                password: formikSignUp.values.password
            }).unwrap();
            showSuccessRegisteredMethod();
            setTimeout(() => {
                navigate('/login', { state: { signBoolean: false } } as any);
            }, 2000);
        } catch(err: any){
            if (err.status === "FETCH_ERROR") {
                showErrorModal("No server response!", "Server is under maintenance, please try again later.");
            } else {
                if (err.status === 409) {
                    showErrorModal("This email is using!", "If you have already an account please go to login page.");
                } else {
                    showErrorModal("Login failed!", "Please try again.");
                }
            }
        }
    }

    useEffect(() => {
        setSignUpPage(location.state?.signBoolean ?? signBoolean);
    }, [location.state, signBoolean])

    useEffect(() => {
        if(user){
            showSuccessLoginModal('Successfully logged in!', `${user?.firstName + " " +user?.lastName} welcome back!`);
            localStorage.setItem("userLoggedIn", "true");
            setTimeout(() => {
                navigate('/home');
            }, 2000);
            const itemsToAdd = boxProducts.filter(
                (boxItem) =>
                  !user.cartItems.some((cartItem) => cartItem.product.id === boxItem.product.id)
              );
              boxProducts.forEach((item) => saveBeforeLoginCartItems(item.product, item.quantity));
        }
    }, [user])

    const formikSignUp = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: signUpSchema,
        onSubmit: async (_values, actions) => {
            actions.resetForm();
            handleRegisterSubmit();
        },
    });

    const formikSignIn = useFormik({
        initialValues: {
            signEmail: '',
            signPassword: '',
        },
        validationSchema: signInSchema,
        onSubmit: async (values, actions) => {
            actions.resetForm();
            handleLoginSubmit();
        },
      });

  return (
    <div className="loginPage">
      <div className={`containerLogin ${signUpPage ? 'active' : ''}`} id="container">
        <div className="form-container sign-up">
            <form onSubmit={formikSignUp.handleSubmit}>
                <h1 className='createAcc'>Create Account</h1>
                <div className="social-icons">
                    <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
                    <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
                </div>
                <span>or use your email for registeration</span>
                <input type="text" placeholder="First Name" id="firstName" onChange={formikSignUp.handleChange} value={formikSignUp.values.firstName} onBlur={formikSignUp.handleBlur}/>
                {formikSignUp.touched.firstName && formikSignUp.errors.firstName ? (
                    <div className='errors'>{formikSignUp.errors.firstName}</div>
                ) : null}
                <input type="text" placeholder="Last Name" id="lastName" onChange={formikSignUp.handleChange} value={formikSignUp.values.lastName} onBlur={formikSignUp.handleBlur}/>
                {formikSignUp.touched.lastName && formikSignUp.errors.lastName ? (
                    <div className='errors'>{formikSignUp.errors.lastName}</div>
                ) : null}
                <input type="email" placeholder="Email" id="email" onChange={formikSignUp.handleChange} value={formikSignUp.values.email} onBlur={formikSignUp.handleBlur}/>
                {formikSignUp.touched.email && formikSignUp.errors.email ? (
                    <div className='errors'>{formikSignUp.errors.email}</div>
                ) : null}
                <input type="password" placeholder="Password" id="password" onChange={formikSignUp.handleChange} value={formikSignUp.values.password} onBlur={formikSignUp.handleBlur}/>
                {formikSignUp.touched.password && formikSignUp.errors.password ? (
                    <div className='errors'>{formikSignUp.errors.password}</div>
                ) : null}
                <input type="password" placeholder="Confirm password" id="confirmPassword" onChange={formikSignUp.handleChange} value={formikSignUp.values.confirmPassword} onBlur={formikSignUp.handleBlur}/>
                {formikSignUp.touched.confirmPassword && formikSignUp.errors.confirmPassword ? (
                    <div className='errors'>{formikSignUp.errors.confirmPassword}</div>
                ) : null}
                <button className={`loginB signButton ${((!formikSignUp.dirty) || Object.keys(formikSignUp.errors).length > 0) ? 'buttonDisable' : ""} ${isLoadingSignUp ? 'buttonSubmitting' : ''}`} disabled={(!formikSignUp.dirty) || Object.keys(formikSignUp.errors).length > 0 || isLoadingSignUp} type='submit'>
                    {isLoadingSignUp ? <ClockLoader color="#ffffff" size={18}/> : <>Register</>}
                </button>
            </form>
        </div>
        <div className="form-container sign-in">
            <form onSubmit={formikSignIn.handleSubmit}>
                <h1>Sign In</h1>
                <div className="social-icons">
                    <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
                    <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
                </div>
                <span>or use your email password</span>
                <input type="email" placeholder="Email" id='signEmail' onChange={formikSignIn.handleChange} value={formikSignIn.values.signEmail} onBlur={formikSignIn.handleBlur}/>
                {formikSignIn.touched.signEmail && formikSignIn.errors.signEmail ? (
                    <div className='errors'>{formikSignIn.errors.signEmail}</div>
                ) : null}
                <input type="password" placeholder="Password" id='signPassword' onChange={formikSignIn.handleChange} value={formikSignIn.values.signPassword} onBlur={formikSignIn.handleBlur}/>
                {formikSignIn.touched.signPassword && formikSignIn.errors.signPassword ? (
                    <div className='errors'>{formikSignIn.errors.signPassword}</div>
                ) : null}
                <button className='fpass' onClick={() => setForgotPassword(true)}>Forget Your Password?</button>
                <button className={`loginB signButton ${((!formikSignIn.dirty) || Object.keys(formikSignIn.errors).length > 0) ? 'buttonDisable' : ""} ${isLoadingSignIn ? 'buttonSubmitting' : ''}`} disabled={(!formikSignIn.dirty) || Object.keys(formikSignIn.errors).length > 0 || isLoadingSignIn} type='submit'>
                    {isLoadingSignIn ? <ClockLoader color="#ffffff" size={18}/> : <>Login</> }
                </button>
            </form>
        </div>
        <div className="toggle-container">
            <div className="toggle">
                <div className="toggle-panel toggle-left">
                    <h1>Hello, Friend!</h1>
                    <p>Register with your personal details to use all of site features</p>
                    <button className="loginB hidden switchButtons" onClick={() => setSignUpPage(false)}>Sign In</button>
                </div>
                <div className="toggle-panel toggle-right">
                    <h1>Welcome Back!</h1>
                    <p>Enter your personal details to use all of site features</p>
                    <button className="loginB hidden switchButtons" onClick={() => setSignUpPage(true)}>Sign Up</button>
                </div>
            </div>
        </div>
        </div>
        {forgotPassword && <ForgetPassword onCancel={handleCancelForgetPassword} />}
    </div>
  )
}
