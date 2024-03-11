import '../../../style/AccountPage/AccountBase.css'
import { AccountPage } from '../AccountPage'
import { BreadCrumb } from '../BreadCrumb'
import '../../../style/AccountPage/components/Information.css'
import { useSelector } from 'react-redux'
import { AuthState } from '../../../types/loginTypes'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { FormControl, MenuItem, Select } from '@mui/material'
import ContactPageIcon from '@mui/icons-material/ContactPage';

export const Information = () => {

  const [selectedGender, setSelectedGender] = useState('');
  const [selectedPhone, setSelectedPhone] = useState('');
  const [selectedBirthDate, setBirthDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setBirthDate(date);
  };

  useEffect(() => {
    console.log(selectedGender);
    console.log(selectedPhone);
    console.log(selectedBirthDate);
  }, [selectedPhone, selectedGender, selectedBirthDate])

  const user = useSelector((state: {auth: AuthState}) => state.auth.user);
  const today = dayjs();

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
              <form action="" method='post'>
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
                            onlyCountries={['fr', 'us', "br", "ca", "gb", "de", "tr", "se", "pl", "jp"]}
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
                              value={selectedBirthDate}
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
                          <span>
                            <i className="fa-solid fa-floppy-disk"/>
                            Save
                          </span>
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



