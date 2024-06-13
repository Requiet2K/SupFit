import '../../style/LoginPage/ForgetPassword.css';
import { useFormik } from "formik";
import { forgetEmailSchema } from "./yup/forgetEmailYup";
import { useEffect, useRef, useState } from "react";
import { useChangeUserPasswordMutation, useLazyGetUserIdQuery } from "../../redux/user/userApiSlice";
import { showErrorModal, showSuccessModal } from "../swalInfo/swalInfo";
import logo from "../../images/logoWhite.png";
import { Alert, Snackbar } from '@mui/material';
import emailjs from '@emailjs/browser'
import ClockLoader from 'react-spinners/ClockLoader';
import { forgetNewPassYup } from './yup/forgetNewPassYup';

interface Props {
    onCancel: () => void;
}

export const ForgetPassword: React.FC<Props> = ({ onCancel }) => {

    const [emailSent, setEmailSent] = useState(false);
    const [codeInput, setCodeInput] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [openErrorSnack, setOpenErrorSnack] = useState(false);
    const [userId, setUserId] = useState(0);

    const formikEmail= useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: forgetEmailSchema,
        onSubmit: async (_values, actions) => {
            actions.resetForm();
            handleSendMail();
        },
    });

    const handleCloseSnack = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenSnack(false);
        setOpenErrorSnack(false);
      };
      

    const [getUserId] = useLazyGetUserIdQuery();
    const [confirmationCode, setConfirmationCode] = useState("");
    const [loadingMailSent, setLoadingMailSent] = useState(false);
    const [timer, setTimer] = useState(60);

    const handleSendMail = async () => {
        try{
            const data = await getUserId(formikEmail.values.email).unwrap();
            setUserId(data);
            setLoadingMailSent(true);
            const generatedCode = generateRandomCode();
            setConfirmationCode(generatedCode);
            await emailjs.send("service_mthtion", "template_hu8mwuh", {
                to_email: formikEmail.values.email, 
                confirmationCode: generatedCode 
            }, "hrlKbEW9FJJ2lA3Vh").then(
                () => {
                    setOpenSnack(true);
                    setCodeInput(true);
                    startTimer();
                },
                (error) => {
                    setOpenErrorSnack(true);
                },
              );
            setLoadingMailSent(false);
            setEmailSent(true);
        }catch(err: any){
            if (err.status === "FETCH_ERROR") {
                showErrorModal("No server response!", "Server is under maintenance, please try again later.");
            } else {
                if (err.status === 409) {
                    showErrorModal("Wrong email!", "Please check your email and try again.");
                } else {
                    showErrorModal("Oops!", "Please try again.");
                }
            }
        }
    }

    const startTimer = () => {
        setTimer(60);
    };

    useEffect(() => {
        if(timer == 0){
            showErrorModal("The confirmation code has expired!", "Please retry the process again!");
            setCodeInput(false);
            setEmailSent(false);
        }
        let interval: NodeJS.Timeout;
        if (timer > 0 && emailSent && codeInput) {
          interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
          }, 1000);
        }
        return () => clearInterval(interval);
      }, [timer, emailSent, codeInput]);

    const codeInputs = useRef<(HTMLInputElement | null)[]>(Array.from({ length: 6 }, () => null));

    const handleCodeInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (value.length === 1 && index < 5) {
            codeInputs.current[index + 1]?.focus();
        } else if (value.length === 0 && index > 0) {
            codeInputs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text');
        const pasteValues = pasteData.split('').slice(0, 6);
        pasteValues.forEach((value, index) => {
            if (codeInputs.current[index]) {
                codeInputs.current[index]!.value = value;
                handleCodeInputChange(index, { target: { value } } as React.ChangeEvent<HTMLInputElement>);
            }
        });
    };

    function generateRandomCode() {
        let code = '';
        const characters = '0123456789';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }
        return code;
    }

    const handleCheckCode = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userEnteredCode = codeInputs.current.map(input => input?.value).join('');
        if (userEnteredCode === confirmationCode) {
            setCodeInput(false);
            setCodeAccepted(true);
        } else {
            showErrorModal("Invalid Code!","The confirmation code you entered is incorrect!");
        }
    }

    const [codeAccepted, setCodeAccepted] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewRetryPassword, setShowNewRetryPassword] = useState(false);

    const formikForgetNewPass = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: forgetNewPassYup,
        onSubmit: async (values, actions) => {
            actions.resetForm();
            handleForgetPasswordChange();
        },
    });

    const [newPasswordMut, isLoading] = useChangeUserPasswordMutation();

    const handleForgetPasswordChange = async () => {
        try{
            await newPasswordMut({
              id: userId,
              newPassword: formikForgetNewPass.values.newPassword
            }).unwrap();
            onCancel();
            showSuccessModal("Successfully changed!", "Your new password has been changed.");
          }catch(err: any){
            console.log(err);
            if (err.status === "FETCH_ERROR") {
              showErrorModal("No server response!", "Server is under maintenance, please try again later.");
            } else {
              showErrorModal("Oops!", "Please try again.");
            }
          }
    }

    return(
        <div className="forgetPassword">
                <div className="forgetPasswordCenter">
                    <h1>
                        {emailSent == false && "Forgot Password"}
                        {emailSent && codeInput && "Enter your code"}
                        {codeAccepted && "Change your password"}
                    </h1>
                    <div className="forgetEmail">
                    {emailSent == false && <form onSubmit={formikEmail.handleSubmit}>
                            <label className="forgetLabel ms-1">E-mail address</label>
                            <div className="inputFieldForget">
                                <div className="inputFieldForgetItem">
                                    <input type="text" className="forgetInputEmail" 
                                    placeholder="Enter email"
                                    name="email"
                                    value={formikEmail.values.email}
                                    onChange={formikEmail.handleChange}
                                    />
                                    <div className="forgetIcon">
                                        <i className="fa-solid fa-envelope fs-5"/>
                                    </div>
                                </div>
                                {formikEmail.errors.email ? (
                                <div className="emailError">{formikEmail.errors.email}</div>
                                ) : <div className="emailError"></div>}
                            </div>
                            <button className="forgetSubmit" type='submit'>{loadingMailSent ? <ClockLoader color="#ffffff" size={24}/> : "Submit"}</button>
                        </form>
                    }
                    {emailSent && codeInput && 
                    <form onSubmit={handleCheckCode}>
                        <div className="codeInput">
                                {[...Array(6)].map((_, index) => (
                                    <input
                                        key={index}
                                        type="tel"
                                        maxLength={1}
                                        pattern="[0-9]"
                                        className="codeInputItem"
                                        ref={(input) => {
                                            codeInputs.current[index] = input;
                                        }}
                                        onChange={(e) => handleCodeInputChange(index, e)}
                                        onPaste={handlePaste}
                                    />
                                ))}
                        </div>
                        <button className="forgetSubmit" type='submit'>Verify Code</button>
                    </form> 
                    }
                    {codeAccepted && 
                    <form onSubmit={formikForgetNewPass.handleSubmit}>
                        <div className="passwordInput">
                            <div className='passwordInputDiv'>
                                <span>New Password</span>
                                <input 
                                type={showNewPassword ? "text" : "password"} 
                                className='passwordInputItem' 
                                placeholder='Enter password'
                                id='newPassword'
                                onChange={formikForgetNewPass.handleChange}
                                value={formikForgetNewPass.values.newPassword}
                                onBlur={formikForgetNewPass.handleBlur}/>
                                {formikForgetNewPass.touched.newPassword && formikForgetNewPass.errors.newPassword ? (
                                <div className='error-forgetPass'>{formikForgetNewPass.errors.newPassword}</div>
                                ) : <div className='error-forgetPass'></div>}
                                <i
                                    className={showNewPassword ? "fa-regular fa-eye-slash showPasswordModalIcon" : "fa-regular fa-eye hidePasswordModalIcon"}
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                />
                            </div>
                            <div className='passwordInputDiv'>
                                <span>Retry New Password</span>
                                <input 
                                type={showNewRetryPassword ? "text" : "password"} 
                                className='passwordInputItem' 
                                placeholder='Confirm password'
                                id='confirmPassword'
                                onChange={formikForgetNewPass.handleChange}
                                value={formikForgetNewPass.values.confirmPassword}
                                onBlur={formikForgetNewPass.handleBlur}/>
                                {formikForgetNewPass.touched.confirmPassword && formikForgetNewPass.errors.confirmPassword ? (
                                <div className='error-forgetPass'>{formikForgetNewPass.errors.confirmPassword}</div>
                                ) : <div className='error-forgetPass'></div>}
                                <i
                                    className={showNewRetryPassword ? "fa-regular fa-eye-slash showPasswordModalIcon" : "fa-regular fa-eye hidePasswordModalIcon"}
                                    onClick={() => setShowNewRetryPassword(!showNewRetryPassword)}
                                />
                            </div>
                        </div>
                        <button className="forgetSubmit" type='submit'>Change Password</button>
                    </form> 
                    }
                    </div>
                    <i className="fa-regular fa-circle-xmark closePasswordModal" onClick={onCancel}/>
                </div>
                <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
                    <Alert
                    onClose={handleCloseSnack}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                    >
                    Confirmation code has been sent to your email.
                    </Alert>
                </Snackbar>
                <Snackbar open={openErrorSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
                    <Alert
                    onClose={handleCloseSnack}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                    >
                    An error occurred while sending the verification code!
                    </Alert>
                </Snackbar>
                {emailSent && codeInput && <div className='timerForgotPassword'>{timer}</div>}
                <img src={logo} className="forgetSupfit"/>
        </div>
    )
}