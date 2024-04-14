import { AccountPage } from '../AccountPage'
import { BreadCrumb } from '../BreadCrumb'
import '../../../style/AccountPage/AccountBase.css'
import '../../../style/AccountPage/components/Address.css'
import { useDispatch, useSelector } from 'react-redux'
import { AddressState, AuthState } from '../../../types/loginTypes'
import { FormEvent, useEffect, useState } from 'react'
import { useLazyGetUserQuery } from '../../../redux/user/userApiSlice'
import { updateUser } from '../../../redux/auth/authSlice'
import { useCreateAddressMutation, useDeleteAddressMutation, useSetAddressDefaultMutation, useUpdateAddressMutation } from '../../../redux/user/addressApiSlice'
import Swal from 'sweetalert2'
import { overflowHidden, overflowShow } from '../../../utils/handleOverflow'
import PhoneInput from 'react-phone-input-2'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import axios from 'axios';
import { showErrorModal, showSuccessModal } from '../../swalInfo/swalInfo'
import { useFormik } from 'formik'
import { addressModalSchema } from './yup/addressModalYup'

interface City {
  id: number;
  name: string;
}

export const Addresses = () => {

  const user = useSelector((state: {auth: AuthState}) => state.auth.user);
  const [addresses , setAddresses] = useState<AddressState[] | null>();

  useEffect(() => {
    setAddresses(user?.addresses);
  },[]);

  useEffect(() => {
    if (user) {
      setAddresses(user.addresses);
    }
  }, [user]);

  const [getUpdatedUser] = useLazyGetUserQuery();
  const dispatch = useDispatch();
  
  const getAddresses = async () => {
    if(user){
      try{
        const userUpdated = await getUpdatedUser(user.id).unwrap();
        dispatch(updateUser(userUpdated));
        setAddresses(user.addresses);
      }catch(err: any){
        console.log(err);
      }
    }
  }

  const [deleteAddressMutation] = useDeleteAddressMutation();

  const handleDeleteAddress = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#416D19",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        if(user){
          try{
            await deleteAddressMutation(id);
            getAddresses();
          }catch(err: any){
            console.log(err);
          }
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  }

  const [setAddressDefaultMutation] = useSetAddressDefaultMutation();

  const handleDefaultAddress = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Your default address will be changed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#416D19",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        if(user){
          try{
            await setAddressDefaultMutation(id).unwrap();
            getAddresses();
          }catch(err: any){
            console.log(err);
          }
        }
        Swal.fire({
          title: "Changed!",
          text: "Your default address is changed.",
          icon: "success"
        });
      }
    });
  }

  const [newAddressModal, setNewAddressModal] = useState(false);

  useEffect(() => {
    if(newAddressModal){
      overflowHidden(true);
    }else{
      overflowShow();
    }
  }, [newAddressModal])

  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<City[]>([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('https://turkiyeapi.dev/api/v1/provinces');
        setCities(response.data.data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchCities();
  }, []);

  const formikAddressModal = useFormik({
    initialValues: {
        addressTitle: '',
        addressFirstName: '',
        addressLastName: '',
        addressCountry: 'Turkey',
        addressCity: '',
        addressDistrict: '',
        addressAddress: '',
    },
    validationSchema: addressModalSchema,
    onSubmit: async (values, actions) => {
      if(selectedPhoneNumber.length == 12){
        actions.resetForm();
        handleAddressSubmit();
        setSelectedPhoneNumber("");
      }
    },
  });

  useEffect(() => {
    if (formikAddressModal.values.addressCity !== "") {
      const selectedCityObj: any = cities.find(city => city.name === formikAddressModal.values.addressCity);
      if (selectedCityObj) {
        setDistricts(selectedCityObj.districts);
      }
    }
  }, [cities, formikAddressModal.values.addressCity]);

  const handleCityChange = (item: string) => {
    formikAddressModal.setFieldValue('addressCity', item);
    formikAddressModal.setFieldValue('addressDistrict', '');
  }

  const [createAddressMutation] = useCreateAddressMutation();
  const [updateAddressMutation] = useUpdateAddressMutation();

  const handleAddressSubmit = async () => {
    if(!editMode && user && addresses){
      if(addresses.length < 3){
        try{
          await createAddressMutation({
            id: user?.id,
            credentials: {
              default: false,
              title: formikAddressModal.values.addressTitle,
              recipientFirstName: formikAddressModal.values.addressFirstName,
              recipientLastName: formikAddressModal.values.addressLastName,
              recipientPhoneNumber: selectedPhoneNumber,
              country: formikAddressModal.values.addressCountry,
              city: formikAddressModal.values.addressCity,
              district: formikAddressModal.values.addressDistrict,
              address: formikAddressModal.values.addressAddress
            } 
          }).unwrap();
          getAddresses();
          setNewAddressModal(false);
          showSuccessModal("Successfully Created!","Your new address successfully created.");
        }catch(err: any){
          console.log(err);
        }
      }else{
        showErrorModal("Address Limit!","A new address was not created because you cannot have more than three addresses.");
        setNewAddressModal(false);
      }
    }else if(editMode && user && addresses){
      try{
        await updateAddressMutation({
          id: clickedAddressId,
          credentials: {
            id: clickedAddressId,
            default: clickedAddressIsDefault,
            title: formikAddressModal.values.addressTitle,
            recipientFirstName: formikAddressModal.values.addressFirstName,
            recipientLastName: formikAddressModal.values.addressLastName,
            recipientPhoneNumber: selectedPhoneNumber,
            country: formikAddressModal.values.addressCountry,
            city: formikAddressModal.values.addressCity,
            district: formikAddressModal.values.addressDistrict,
            address: formikAddressModal.values.addressAddress
          }
        }).unwrap();
        getAddresses();
        setNewAddressModal(false);
        showSuccessModal("Successfully Updated!","Your selected address successfully updated.");
      }catch(err: any){
        console.log(err);
      }
    }
  }

  const [editMode, setEditMode] = useState(false);
  const [clickedAddressId, setClickedAddressId] = useState(0);
  const [clickedAddressIsDefault, setClickedAddressIsDefault] = useState(false);

  const handleEditMode = (addressId: number) => {
    setEditMode(true);
    setNewAddressModal(true);
    setClickedAddressId(addressId);
    addresses?.map(address => {
      if(address.id == addressId){
        const selectedCityObj: any = cities.find(city => city.name === address.city);
        if (selectedCityObj) {
          setDistricts(selectedCityObj.districts);
        }
        setClickedAddressIsDefault(address.default);
        formikAddressModal.values.addressTitle = address.title;
        formikAddressModal.values.addressFirstName = address.recipientFirstName;
        formikAddressModal.values.addressLastName = address.recipientLastName;
        setSelectedPhoneNumber(address.recipientPhoneNumber); 
        formikAddressModal.values.addressCountry = address.country;
        formikAddressModal.values.addressCity = address.city;
        formikAddressModal.values.addressDistrict = address.district;
        formikAddressModal.values.addressAddress = address.address;
      }
    });
  }

  const handleAddMode = () => {
    setEditMode(false);
    setNewAddressModal(true);
    formikAddressModal.values.addressTitle = "";
    formikAddressModal.values.addressFirstName = "";
    formikAddressModal.values.addressLastName = "";
    setSelectedPhoneNumber("");
    formikAddressModal.values.addressCountry = "Turkey";
    formikAddressModal.values.addressCity = "";
    formikAddressModal.values.addressDistrict = "";
    formikAddressModal.values.addressAddress = "";
    setDistricts([]);
  }

  return (
    <div className={`addresses mb-3 ${addresses?.length == 0 ? "addressEmpty" : "addressNotEmpty"}`}>
      <div className="container p-1">
        <div className="row h-100">
          <BreadCrumb path={["addresses"]}/>
          <div className="col-2 d-none d-lg-inline">
            <div className="account-left">
              <AccountPage />
            </div>
          </div>
          <div className="col-10 account-right">
            <div className="row mb-3">
              <div className="col-12">
                <div className="page-title">
                    <h3>My Addresses</h3>
                    <div className="add-address">
                      <a className='create-address' onClick={handleAddMode}> 
                        <span>
                          <i className='fa-solid fa-circle-plus'/>
                          <p>Add New Address</p>
                       </span>
                      </a>
                    </div>
                </div>
              </div>
            </div>
            <div className="content">
              <div className="col-12">
                <div className="row">
                  {addresses?.length == 0 &&         
                  <>
                    <h3 className='d-flex w-100 justify-content-center mt-5 pt-5'> You don't have any address. </h3>
                    <i className="fa-solid fa-map-location-dot addressEmptyIcon"/>
                  </>
                  }
                  {addresses?.map((address, index) => (
                    <div className="col-12 col-lg-4 addressCol" key={index}>
                      <div className="addressItemWrapper">
                        <div className="addressItem">
                          <div className="addressItemHeader">
                            {address.default ? <i className='fa-solid fa-star'/> : ""}
                            <h4 className='m-0'>{address.title}</h4>
                            <a className='addressRemove' onClick={() => handleDeleteAddress(address.id)}>
                              <i className='fa-solid fa-trash-can'/>
                            </a>
                          </div>
                          <div className="addressItemBody">
                            <div className="addressListItem">
                              <i className="fa-solid fa-user-tie"/>
                              <span>{address.recipientFirstName} {address.recipientLastName}</span>
                            </div>
                            <div className="addressListItem">
                              <i className="fa-solid fa-earth-europe"/>
                              <span>{address.country}</span>
                            </div>
                            <div className="addressListItem">
                              <i className="fa-solid fa-city"/>
                              <span>{address.city} / {address.district}</span>
                            </div>
                            <div className="addressListItem">
                              <i className="fa-solid fa-phone-flip"/>
                              <span>{address.recipientPhoneNumber}</span>
                            </div>
                            <div className="addressListItem border-0">
                              <i className="fa-solid fa-signs-post"/>
                              <span>{address.address}</span>
                            </div>
                          </div>
                          <div className="addressItemFooter">
                            <div className="addressItemFooterButtons">
                              <a className='addressEdit' onClick={() => handleEditMode(address.id)}>
                                <span>
                                  <i className="fa-solid fa-pen-to-square"/>
                                  CHANGE
                                </span>
                              </a>
                              <a className='addressDefault' onClick={() => handleDefaultAddress(address.id)}>
                                <span>
                                  <i className="fa-solid fa-star"/>
                                  DEFAULT
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`addressModal ${newAddressModal ? "" : "hideAddressModal"}`}>
        <div className={`addressModalContent ${newAddressModal ? "" : "expandAddresModalContent"}`}>
          <div className='addressModal-header'>
            <h1 className='fs-5 mb-0'>{editMode ? "Edit Address" : "Add New Address"}</h1>
            <button onClick={() => setNewAddressModal(false)}>
              <i className='fa-solid fa-xmark'/>
            </button>
          </div>
          <div className='addressModal-body'>
            <form onSubmit={formikAddressModal.handleSubmit}>
              <div className="row">
                <div className="col-12">
                  <div className="addressFormGroup">
                    <label htmlFor='addTitle'>Address Title</label>
                    <input 
                    type="text" 
                    id='addressTitle' 
                    placeholder='Set Address Title'
                    className='addressFormGroupControl'
                    onChange={formikAddressModal.handleChange} 
                    value={formikAddressModal.values.addressTitle} 
                    onBlur={formikAddressModal.handleBlur}
                    />
                    {formikAddressModal.touched.addressTitle && formikAddressModal.errors.addressTitle ? (
                      <div className='error-security'>{formikAddressModal.errors.addressTitle}</div>
                    ) : <div className='error-security'></div>}
                  </div>
                </div>
                <div className="col-6 mt-3">
                  <div className="addressFormGroup">
                    <label htmlFor='firstName'>First Name</label>
                    <input 
                    type="text" 
                    id='addressFirstName' 
                    placeholder='Recipient First Name'
                    className='addressFormGroupControl'
                    onChange={formikAddressModal.handleChange} 
                    value={formikAddressModal.values.addressFirstName} 
                    onBlur={formikAddressModal.handleBlur}
                    />
                    {formikAddressModal.touched.addressFirstName && formikAddressModal.errors.addressFirstName ? (
                      <div className='error-security'>{formikAddressModal.errors.addressFirstName}</div>
                    ) : <div className='error-security'></div>}
                  </div>
                </div>
                <div className="col-6 mt-3">
                  <div className="addressFormGroup">
                    <label htmlFor='lastName'>Last Name</label>
                    <input 
                    type="text" 
                    id='addressLastName' 
                    placeholder='Recipient Last Name'
                    className='addressFormGroupControl'
                    onChange={formikAddressModal.handleChange} 
                    value={formikAddressModal.values.addressLastName} 
                    onBlur={formikAddressModal.handleBlur}
                    />
                    {formikAddressModal.touched.addressLastName && formikAddressModal.errors.addressLastName ? (
                      <div className='error-security'>{formikAddressModal.errors.addressLastName}</div>
                    ) : <div className='error-security'></div>}                    
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="addressFormGroup">
                    <label htmlFor='lastName'>Phone Number</label>
                    <PhoneInput
                        inputProps={{ id: "addressPhoneNumber" }}
                        onlyCountries={["gb","tr", "jp"]}
                        country={'tr'}
                        onChange={(e) => setSelectedPhoneNumber(e)} 
                        value={selectedPhoneNumber} 
                    />
                    {(selectedPhoneNumber != "" && selectedPhoneNumber.length != 12 ) ? (
                      <div className='error-security'>Wrong Phone Number</div>
                    ) : <div className='error-security'></div>}             
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="addressFormGroup">
                    <label htmlFor='lastName' className='addressFormGroupLabel'>Country</label>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select 
                          onChange={formikAddressModal.handleChange} 
                          value={formikAddressModal.values.addressCountry} 
                          onBlur={formikAddressModal.handleBlur}
                          disabled
                          id='addressCountry'
                        >
                          <MenuItem value={formikAddressModal.values.addressCountry} disabled>
                            Turkey
                          </MenuItem>
                        </Select>
                      </FormControl>
                      {formikAddressModal.touched.addressCountry && formikAddressModal.errors.addressCountry ? (
                      <div className='error-security'>{formikAddressModal.errors.addressCountry}</div>
                      ) : <div className='error-security'></div>}                      
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="addressFormGroup">
                    <label htmlFor='lastName'>City</label>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-simple-select-helper-label">Select City</InputLabel>
                        <Select 
                          id='addressCity'
                          name='addressCity'
                          onChange={(e) => handleCityChange(e.target.value)}  
                          value={formikAddressModal.values.addressCity} 
                          onBlur={formikAddressModal.handleBlur}
                        >
                          {cities.length > 0 ? (
                            cities.map((city) => (
                              <MenuItem value={city.name} key={city.id}>
                                {city.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>Loading...</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                      {formikAddressModal.touched.addressCity && formikAddressModal.errors.addressCity ? (
                      <div className='error-security'>{formikAddressModal.errors.addressCity}</div>
                      ) : <div className='error-security'></div>}                      
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="addressFormGroup">
                    <label htmlFor='lastName'>District</label>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <InputLabel id="demo-simple-select-helper-label">Select District</InputLabel>
                        <Select 
                          id='addressDistrict'
                          name='addressDistrict'
                          onChange={(e) => {
                            formikAddressModal.setFieldValue('addressDistrict', e.target.value);
                          }} 
                          value={formikAddressModal.values.addressDistrict} 
                          onBlur={formikAddressModal.handleBlur}
                        >
                          {districts.length > 0 ? (
                            districts.map((district) => (
                              <MenuItem value={district.name} key={district.id}>
                                {district.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>Select City</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                      {formikAddressModal.touched.addressDistrict && formikAddressModal.errors.addressDistrict ? (
                      <div className='error-security'>{formikAddressModal.errors.addressDistrict}</div>
                    ) : <div className='error-security'></div>}                      
                  </div>
                </div>
                <div className="col-12">
                  <div className="addressFormGroup">
                    <label htmlFor='lastName'>Address</label>
                    <textarea 
                    id='addressAddress'
                    className='addressFormGroupControl'
                    onChange={formikAddressModal.handleChange} 
                    value={formikAddressModal.values.addressAddress} 
                    onBlur={formikAddressModal.handleBlur}
                    />
                    {formikAddressModal.touched.addressAddress && formikAddressModal.errors.addressAddress ? (
                      <div className='error-security'>{formikAddressModal.errors.addressAddress}</div>
                    ) : <div className='error-security'></div>}                    
                  </div>
                </div>
                <div className="col-12 d-flex justify-content-end mt-3">
                   <button type='submit'>
                    <span>
                      <i className='fa-solid fa-save'/>
                        {editMode ? "Edit" : "Add"}
                      </span>
                   </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
