import '../../../../style/AccountPage/AccountBase.css'
import { AccountPage } from '../../AccountPage'
import { BreadCrumb } from '../../BreadCrumb'
import '../../../../style/AccountPage/components/Information.css'
import { useDispatch, useSelector } from 'react-redux'
import { AuthState } from '../../../../types/loginTypes'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormEvent, useEffect, useState } from 'react'
import dayjs from 'dayjs';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { FormControl, MenuItem, Select } from '@mui/material'
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { useLazyGetUserQuery, useUpdateUserMutation } from '../../../../redux/user/userApiSlice'
import { updateUser } from '../../../../redux/auth/authSlice'
import { showInvalidPhoneNumber, showUpdateUserModal, showUpdateUserModalWarning } from '../../../swalInfo/swalInfo'
import ClockLoader from 'react-spinners/ClockLoader'


export const Information = () => {

  const user = useSelector((state: {auth: AuthState}) => state.auth.user);

  const [selectedGender, setSelectedGender] = useState(user?.gender ? user.gender : "");
  const [selectedPhone, setSelectedPhone] = useState(user?.phoneNumber ? user.phoneNumber : "");

  const [selectedBirthDate, setBirthDate] = useState<Date | null>(user?.birthDate ? user.birthDate : null);
  const [convertedDate, setConvertedDate] = useState<Date | null>(selectedBirthDate);
  const [checkPrevDate, setCheckPrevDate] = useState<Date | null | undefined>(selectedBirthDate);

  const [isUpdated, setIsUpdated] = useState(false);

  const handleDateChange = (date: any) => {
    setBirthDate(date);
    const modifiedDate = date ? dayjs(date).add(1, 'day').toDate() : null;
    setConvertedDate(modifiedDate);
  };

  const [sendUpdateUser, {isLoading}] = useUpdateUserMutation();
  const [getUpdatedUser] = useLazyGetUserQuery();
  const dispatch = useDispatch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if(selectedPhone == "" || selectedPhone.length == 12){
      if(user && 
        ((selectedGender != '' && selectedGender != user.gender) || 
        (selectedPhone != '' && selectedPhone != user.phoneNumber) || 
        (selectedBirthDate != null && convertedDate != user.birthDate && (user?.birthDate ? checkPrevDate != user?.birthDate : true))))
        {
        try{
            await sendUpdateUser({
            id: user.id,
            credentials: {
              gender: selectedGender ?? user.gender,
              birthDate: selectedBirthDate ? convertedDate : user.birthDate,
              phoneNumber: selectedPhone ?? user.phoneNumber
            }
            })
            .unwrap();
            const userUpdated = await getUpdatedUser(user.id).unwrap();
            dispatch(updateUser(userUpdated));
            showUpdateUserModal();
            setIsUpdated(true);
        } catch(err: any){
          console.log(err);
        }
      }else{
        showUpdateUserModalWarning();
      }
    }else{
      showInvalidPhoneNumber();
    }
  }

  useEffect(() => {
    if(isUpdated){
      setCheckPrevDate(user?.birthDate);
    }
  }, [isUpdated])

  const openGenderSelection = () =>{
    const navDesktopElements = document.querySelectorAll('.nav-desktop');
    navDesktopElements.forEach((navDesktopElement) => {
      (navDesktopElement as HTMLElement).style.paddingRight = '17px';
    });  
  }

  const closeGenderSelection = () =>{
    const navDesktopElements = document.querySelectorAll('.nav-desktop');
      navDesktopElements.forEach((navDesktopElement) => {
        (navDesktopElement as HTMLElement).style.paddingRight = '0px';
      });
  }
  return (
    <div className='information mb-3'>
      <div className="container p-1">
        <div className="row h-100">
          <BreadCrumb path={["account", "information"]}/>
          <div className="col-2 d-none d-lg-inline">
            <div className="account-left">
              <AccountPage />
            </div>
          </div>
          <div className="col-10 account-right">
            <div className="row mb-3">
              <div className="col-12">
                <div className="page-title">
                    <h3>Information</h3>
                </div>
              </div>
            </div>
            <div className="content">
              <form onSubmit={(e: FormEvent) => handleSubmit(e)}>
                <div className="row mt-4 d-flex justify-content-center">
                  <div className="d-none d-lg-flex col-md-2 justify-content-center align-items-center">
                      <ContactPageIcon className="userIcon"/>
                  </div>
                  <div className="col-md-10">
                    <div className="row row-gap-4">
                      <div className="col-6 col-lg-3">
                        <div className="formGroup">
                          <label className="formLabel">First Name</label>
                          <input type="text" className="formControl" value={`${user?.firstName}`} disabled/>
                        </div>
                      </div>
                      <div className="col-6 col-lg-3">
                        <div className="formGroup">
                          <label className="formLabel">Last Name</label>
                          <input type="text" className="formControl" value={`${user?.lastName}`} disabled/>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6 formEmail">
                        <div className="formGroup">
                          <label className="formLabel">E-mail</label>
                          <input type="text" className="formControl formEmail" value={`${user?.email}`} disabled/>
                          <div className="email-icon"><i className="fa-solid fa-envelope-circle-check fs-5"/></div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-4">
                        <div className="formGroup">
                          <label className="formLabel">Phone Number</label>
                          <PhoneInput
                            onlyCountries={["gb","tr", "jp"]}
                            country={'tr'}
                            value={selectedPhone}
                            onChange={(e) => setSelectedPhone(e)}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-lg-4">
                        <div className="formGroup">
                          <label className="formLabel">Birth Date</label>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker 
                              format="DD/MM/YYYY"
                              disableFuture 
                              slotProps={{ textField: { size: 'small' } }}
                              value={dayjs(selectedBirthDate)}                              
                              onChange={handleDateChange}
                            />
                          </LocalizationProvider>
                        </div>
                      </div>
                      <div className="col-12 col-lg-4">
                        <div className="formGroup">
                          <label className="formLabel">Gender</label>
                          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select
                              displayEmpty
                              labelId="demo-select-small-label"
                              id="demo-select-small"
                              value={selectedGender}
                              onChange={(e) => setSelectedGender(e.target.value)}
                              onOpen={openGenderSelection}
                              onClose={closeGenderSelection}
                            >
                              <MenuItem value={''} disabled>Select Gender</MenuItem>
                              <MenuItem value={"male"}>Male</MenuItem>
                              <MenuItem value={"female"}>Female</MenuItem>
                              <MenuItem value={"other"}>Other</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  </div>      
                  <div className="row p-0 mt-3 d-flex justify-content-center">
                      <div className="col-12 col-md-10 col-lg-12 d-flex justify-content-end">
                        <button className='buttonRightSingle rightBottom' type='submit'>
                          {isLoading ? 
                            <span className='loadingUpdate'>
                              <ClockLoader color="#ffffff" size={14}/>
                            </span> 
                            : 
                            <>
                            <span>
                              <i className="fa-solid fa-floppy-disk"/>
                              Save
                            </span>
                            </>
                            }
                        </button>
                      </div>
                  </div>  
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



