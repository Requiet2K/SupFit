import { AccountPage } from '../../AccountPage'
import { BreadCrumb } from '../../BreadCrumb'
import '../../../../style/AccountPage/AccountBase.css'
import '../../../../style/AccountPage/components/Security.css'
import changePass from '../../../../images/changePass.png'
import changeToken from '../../../../images/changeToken.png'
import { FormEvent, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { changePassSchema } from './changePassYup'
import { useLazyGetTokenValidationQuery, useUpdatePasswordMutation, useUpdateTokenValidationMutation } from '../../../../redux/user/userApiSlice'
import { AuthState } from '../../../../types/loginTypes'
import { useDispatch, useSelector } from 'react-redux'
import { showErrorModal, showSuccessModal } from '../../../swalInfo/swalInfo'
import ClockLoader from 'react-spinners/ClockLoader'
import { login, updateToken } from '../../../../redux/auth/authSlice'
import { useNavigate } from 'react-router-dom'

export const Security = () => {

  const [passModal, setPassModel] = useState(false);
  const [tokenModal, setTokenModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [newTokenDuration, setNewTokenDuration] = useState<number>(0);
  const [currentTokenDuration, setCurrentTokenDuration] = useState(0);
  const [tokenTimer, setTokenTimer] = useState("0");

  const user = useSelector((state: {auth: AuthState}) => state.auth.user);

  const dispatch = useDispatch();
  const [updatePassword, { isLoading: isLoadingPassword }] = useUpdatePasswordMutation();

  const handlePasswordChange = async () => {
    if(user){
      try{
        const newToken = await updatePassword({
          id: user.id,
          credentials: {
            currentPassword: formikChangePass.values.currentPassword,
            newPassword: formikChangePass.values.newPassword,
          }
        })
        .unwrap();
        dispatch(login({ token: newToken.token, user: user }));
        showSuccessModal("Successfully updated.", "Your password has successfully changed.");
        setPassModel(false);
      } catch(err: any){
        if (err.status === "FETCH_ERROR") {
          showErrorModal("No server response!", "Server is under maintenance, please try again later.");
        } else {
          if (err.status === 409) {
              showErrorModal("Incorrect Password!", "Please retry again.");
          } else {
              showErrorModal("Oops!", "Please try again.");
          }
        }
      }
      
    }
  }

  const formikChangePass = useFormik({
    initialValues: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    },
    validationSchema: changePassSchema,
    onSubmit: async (values, actions) => {
        actions.resetForm();
        handlePasswordChange();
    },
  });

  useEffect(() => {
    if(passModal || tokenModal){
      document.body.style.overflow = 'hidden';
    }else{
      document.body.style.overflow = 'visible';
    }
  },[passModal, tokenModal])

  const handleTokenValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredValue = parseInt(e.target.value, 10);
    if (enteredValue <= 1 || isNaN(enteredValue)) { 
      setNewTokenDuration(1);
    } else {
      setNewTokenDuration(enteredValue);
    }
  }

  const [getCurrentTokenValidationTime] = useLazyGetTokenValidationQuery();

  const getCurrentTokenDuration = async () => {
    const currentTokenValidationTime = await getCurrentTokenValidationTime(user?.id).unwrap();
    setCurrentTokenDuration(currentTokenValidationTime);  
  }

  useEffect(() => {
    getCurrentTokenDuration();
  }, [newTokenDuration])

  const [updateTokenValidation, { isLoading: isLoadingTokenValidation }] = useUpdateTokenValidationMutation();

  const handleTokenChange = async (e: FormEvent) => {
    e.preventDefault();
    if(user && newTokenDuration != 0 && newTokenDuration >= 1){
      try{
        const updatedToken = await updateTokenValidation({
          id: user.id,
          credentials: newTokenDuration
        }).unwrap();
        setCurrentTokenDuration(newTokenDuration);
        showSuccessModal("Successfully changed!", "Your new token duration has been saved.");
        dispatch(updateToken(updatedToken));
        setTokenModal(false);
        setNewTokenDuration(0);
      }catch(err: any){
        console.log(err);
        if (err.status === "FETCH_ERROR") {
          showErrorModal("No server response!", "Server is under maintenance, please try again later.");
        } else {
          showErrorModal("Oops!", "Please try again.");
        }
      }
    }else{
      showErrorModal("Invalid input!","Token duration must be at least 1 minute!");
    }
  }

  useEffect(() => {

    const interval = setInterval(() => {
      const formattedRemainingTime = formatTime();
      setTokenTimer(formattedRemainingTime);
    }, 1000);
  
    return () => clearInterval(interval);

  }, []);

  const navigate = useNavigate();

  function formatTime() {
    const unixTimestampString: string | null = localStorage.getItem('exp');
    const unixTimestamp: number = unixTimestampString ? parseInt(unixTimestampString) : 0;
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = unixTimestamp - currentTime;
    if(remainingTime <= 0) navigate('/account');
    const days = Math.floor(remainingTime / (3600 * 24));
    const hours = Math.floor((remainingTime % (3600 * 24)) / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const remainingSeconds = remainingTime % 60;
    let formattedTime = "";
    if (days > 0) {
      formattedTime += `${days} day${days > 1 ? 's' : ''} `;
    }
    if (hours > 0 || formattedTime) {
      formattedTime += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    if (minutes > 0 || formattedTime) {
      formattedTime += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    }
    if (remainingSeconds > 0 || formattedTime === "") {
      formattedTime += `${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''} `;
    }
    return formattedTime.trim();
  }

  return (
    <div className='security mb-3'>
      <div className="container p-1">
        <div className="row h-100">
          <BreadCrumb path={["account", "security"]}/>
          <div className="col-2 d-none d-lg-inline">
            <div className="account-left">
              <AccountPage />
            </div>
          </div>
          <div className="col-10 account-right">
            <div className="row mb-3">
              <div className="col-12">
                <div className="page-title">
                    <h3>Security</h3>
                </div>
              </div>
            </div>
            <div className="content">
              <div className="row security-selection">
                <div className="col-12 col-lg-6 d-flex justify-content-center">
                  <div className="changePass" onClick={() => setPassModel(true)}>
                    <div className="security-text d-flex flex-column gap-3 w-50">
                      <h4>Change Your Password</h4>
                      <span className='text-span'>Your passwords are securely encrypted using JWT technology.</span>
                    </div>
                    <img src={changePass} alt="" className='w-50 sec-picture'/>
                  </div>
                </div>
                <div className="col-12 col-lg-6 d-flex justify-content-center">
                  <div className="changeTimeout" onClick={() => setTokenModal(true)}>
                    <div className="security-text d-flex flex-column gap-3 w-50">
                      <h4>Configure Session Timeout</h4>
                      <span className='text-span'>Configure your session timeout. After the specified duration, your JWT token will expire.</span>
                    </div>
                    <img src={changeToken} alt="" className='w-50 sec-picture'/>
                  </div>
                </div>
              </div>
              <div className={`${passModal ? "showPassModal" : ""} modalPass`}>
                  <div className="modal-left">
                    <form action="" onSubmit={formikChangePass.handleSubmit} className='modalForm'>
                      <div className="modal-field">
                        <label className="modal-label">Current Password</label>
                        <input
                        id='currentPassword'
                        placeholder="Current Password"
                        type={showPassword ? "text" : "password"}
                        className="modal-input"
                        onChange={formikChangePass.handleChange} value={formikChangePass.values.currentPassword} onBlur={formikChangePass.handleBlur}
                        />
                        {formikChangePass.touched.currentPassword && formikChangePass.errors.currentPassword ? (
                          <div className='error-security'>{formikChangePass.errors.currentPassword}</div>
                        ) : <div className='error-security'></div>}
                      </div>
                      <div className="modal-field">
                        <label className="modal-label">New Password</label>
                        <input
                        id='newPassword'
                        type={showPassword ? "text" : "password"}
                        className="modal-input"
                        placeholder="New password" 
                        onChange={formikChangePass.handleChange} value={formikChangePass.values.newPassword} onBlur={formikChangePass.handleBlur}
                        />
                        {formikChangePass.touched.newPassword && formikChangePass.errors.newPassword ? (
                          <div className='error-security'>{formikChangePass.errors.newPassword}</div>
                        ) : <div className='error-security'></div>}
                      </div>
                      <div className="modal-field">
                        <label className="modal-label">Retry Password</label>
                        <input 
                        id='confirmPassword'
                        type={showPassword ? "text" : "password"}
                        className="modal-input"
                        placeholder="Confirm password"
                        onChange={formikChangePass.handleChange} value={formikChangePass.values.confirmPassword} onBlur={formikChangePass.handleBlur}
                        />
                        {formikChangePass.touched.confirmPassword && formikChangePass.errors.confirmPassword ? (
                            <div className='error-security'>{formikChangePass.errors.confirmPassword}</div>
                        ) : <div className='error-security'></div>}
                      </div>
                      <div className="modal-field">
                        <button className="changeBtn" disabled={isLoadingPassword} type='submit'>
                          {isLoadingPassword ? 
                          <>
                          <ClockLoader color="#ffffff" size={24}/>
                          </> 
                          :
                          <>
                          <i className="fa-solid fa-gear"/>
                          <span>Change Password</span>
                          </>
                          }
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="modal-right d-none d-lg-flex">
                    <img src={changePass} alt="" className='sec-picture'/>
                  </div>
                  <div className="closeModal">
                    <i className="fa-regular fa-circle-xmark" onClick={() => setPassModel(false)}/>
                  </div>
                  <div className="showPassIcon">
                    {showPassword ? 
                      <i className="bi bi-eye" onClick={() => setShowPassword(false)}/>
                      :
                      <i className="bi bi-eye-slash" onClick={() => setShowPassword(true)} />
                    }
                  </div>
              </div>
              <div className={`${tokenModal ? "showPassModal" : ""} modalPass`}>
                <div className="modal-left tokenItem">
                  <form action="" onSubmit={handleTokenChange} className='tokenForm'>
                    <div className="modal-field field-token">
                      <label className="modal-label">Your Current Duration</label>
                      <input
                      type="number"
                      className="modal-input" disabled value={currentTokenDuration}
                      min={5}/>
                    </div>
                    <div className="modal-field field-token">
                      <label className="modal-label">New Duration</label>
                      <input
                      type="number"
                      className="modal-input"
                      value={newTokenDuration}
                      onChange={(e) => handleTokenValueChange(e)}
                      />
                    </div>
                    <div className="modal-field field-token">
                      <button className='changeBtn'>
                      {isLoadingTokenValidation ? 
                          <>
                          <ClockLoader color="#ffffff" size={24}/>
                          </> 
                          :
                          <>
                          <i className="fa-solid fa-gear"/>
                          <span>Set Validation</span>
                          </>
                          }
                      </button>
                    </div>
                  </form>
                </div>
                <div className="modal-right tokenImg d-none d-lg-flex tokenItem">
                    <img src={changeToken} alt="" className='sec-picture'/>
                </div>
                  <div className="closeModal">
                    <i className="fa-regular fa-circle-xmark" onClick={() => setTokenModal(false)}/>
                  </div>
                  <div className="tokenTimer">
                    <span className='timerTitle'>Your session timeout duration remaining</span>
                    <span className="timerValue">{tokenTimer}</span>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
