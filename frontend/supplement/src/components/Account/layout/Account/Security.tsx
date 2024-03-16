import { AccountPage } from '../../AccountPage'
import { BreadCrumb } from '../../BreadCrumb'
import '../../../../style/AccountPage/AccountBase.css'
import '../../../../style/AccountPage/components/Security.css'
import changePass from '../../../../images/changePass.png'
import changeToken from '../../../../images/changeToken.png'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { changePassSchema } from './changePassYup'
import { useUpdatePasswordMutation } from '../../../../redux/user/userApiSlice'
import { AuthState } from '../../../../types/loginTypes'
import { useDispatch, useSelector } from 'react-redux'
import { showErrorModal, showSuccessModal } from '../../../swalInfo/swalInfo'
import ClockLoader from 'react-spinners/ClockLoader'
import { login } from '../../../../redux/auth/authSlice'

export const Security = () => {

  const [passModal, setPassModel] = useState(false);
  const [tokenModal, setTokenModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [tokenDuration, setTokenDuration] = useState(0);

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
              console.log(err);
              console.log(localStorage.getItem('user'));
              console.log(localStorage.getItem('token'));
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

  return (
    <div className='dashboard mb-3'>
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
                    <img src={changePass} alt="" className='w-50'/>
                  </div>
                </div>
                <div className="col-12 col-lg-6 d-flex justify-content-center">
                  <div className="changeTimeout" onClick={() => setTokenModal(true)}>
                    <div className="security-text d-flex flex-column gap-3 w-50">
                      <h4>Configure Session Timeout</h4>
                      <span className='text-span'>Configure your session timeout. After the specified duration, your JWT token will expire.</span>
                    </div>
                    <img src={changeToken} alt="" className='w-50'/>
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
                    <img src={changePass} alt=""/>
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
                <div className="modal-left">
                    <div className="modal-field field-token">
                      <label className="modal-label">Your Current Duration</label>
                      <input
                      type="number"
                      className="modal-input" disabled value={30}
                      min={5}/>
                    </div>
                    <div className="modal-field field-token">
                      <label className="modal-label">New Duration</label>
                      <input
                      type="number"
                      className="modal-input"/>
                    </div>
                    <div className="modal-field field-token">
                      <button className='changeBtn'>
                        Set Validation
                      </button>
                    </div>
                </div>
                <div className="modal-right tokenImg d-none d-lg-flex">
                    <img src={changeToken} alt=""/>
                </div>
                  <div className="closeModal">
                    <i className="fa-regular fa-circle-xmark" onClick={() => setTokenModal(false)}/>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
