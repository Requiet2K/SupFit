import '../../style/MainPages/CheckoutPage.css';
import plainLogo from "../../images/plainLogo.png";
import masterCard from "../../images/masterCard.png";
import { useNavigate } from 'react-router-dom';
import GppGoodIcon from '@mui/icons-material/GppGood';
import { CartContext } from '../../context/CartContext';
import { useContext, useEffect, useState } from "react";
import { ImageComponent } from '../../utils/imageComponent';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { CartItem } from '../../types/cartType';
import Swal from 'sweetalert2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/auth/authSlice';
import { AddressState } from '../../types/userTypes';
import { showErrorModal } from '../swalInfo/swalInfo';
import React from 'react';
import { useFormik } from 'formik';
import { paymentSchema } from './mainYups/checkoutPaymentYup';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import { useCreateCheckoutMutation } from '../../redux/checkout/checkoutApiSlice';
import { LoadingContext } from '../../context/LoadingContext';
import { useLazyGetItemsQuery } from '../../redux/cart/cartApiSlice';

export const CheckoutPage = () => {

  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [itemChange, setItemChange] = useState(false);
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState<AddressState | undefined>();

  useEffect(() => {
    document.body.style.overflowX = 'hidden';
  }, [])

  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      const selectedDeliveryId = localStorage.getItem("selectedDelivery");
      let selectedDeliveryAdd;
      if(selectedDeliveryId != null){
        const selectedId = parseInt(selectedDeliveryId);
        selectedDeliveryAdd = user.addresses.find(address => address.id === selectedId);
        setSelectedDeliveryAddress(selectedDeliveryAdd);
      }else{
        selectedDeliveryAdd = user.addresses.find(address => address.default);
        setSelectedDeliveryAddress(selectedDeliveryAdd);
      }
    }
  }, [user]);

  const handleSelectedAddress = (selectedDeliveryAddress: AddressState) => {
    setSelectedDeliveryAddress(selectedDeliveryAddress);
    localStorage.setItem("selectedDelivery",selectedDeliveryAddress.id.toString());
  }
  
  const { boxProducts, getBoxItems, updateBoxProducts, total, 
    applyCoupon, discount, showCouponMessage,handleIncreaseFromCart, handleRemoveFromCart,
    handleRemoveItemFromCart, handleUpdateQuantityInCart, handleRemoveAllFromCart} = useContext(CartContext);

    const [getUserCartItemsQuery] = useLazyGetItemsQuery();

    useEffect(() => {
      const getUserCartItems = async () => {
        if(user){
          try{
            const data: CartItem[] = await getUserCartItemsQuery(user?.id).unwrap();
            if(data.length == 0){
              navigate("/home");
              showErrorModal("Your cart is empty!","To be able to checkout you have to put item into your chart!");
            }
          }catch(err: any){
            console.log(err);
          }
        }
      }
      getUserCartItems();
    },[]);

    const handleDecreaseProductCount = (item: CartItem) => {
      if(item.quantity != 1){
        if(item.quantity - 1 <= 0){
          item.quantity = 1;
        }else{
          item.quantity--;
        }
        updateBoxProducts([...(boxProducts || [])]);
        handleRemoveFromCart( item.product, 1);
      }
    }

    const handleProductCountChange = (e: React.ChangeEvent<HTMLInputElement>, item: CartItem) => {
      const newCount = parseInt(e.target.value);
      let updatedQuantity = 1;

      if (!isNaN(newCount)) {
        if(newCount <= 0){
          updatedQuantity = 1;
        } else if(newCount > item.product.quantity){
          updatedQuantity = item.product.quantity;
        } else{
          updatedQuantity = newCount;
        }
      }

      const updatedProducts = boxProducts?.map(product => 
        product.id === item.id ? { ...product, quantity: updatedQuantity } : product
      );

      handleUpdateQuantityInCart(item.product, updatedQuantity);
      updateBoxProducts(updatedProducts);
    }

    const handleIncreaseProductCount = (item: CartItem) => {
      if(item.quantity + 1 > item.product.quantity){
        item.quantity = item.product.quantity;
      }else{
        item.quantity++;
      }
      updateBoxProducts([...(boxProducts || [])]);
      handleIncreaseFromCart( item.product, 1);
    }

    const handleRemoveItemFromBox = (item: CartItem) => {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you really wanna remove this product from the cart?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#416D19",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
          handleRemoveItemFromCart(item.product);
          getBoxItems();
        }
      });
    }

    function handleCalculateTotal() {
      let total = 0;
      if(boxProducts){
        boxProducts.forEach((item) => {
          total += item.quantity * item.product.price;
        })
      }
      return total;
    }

    const [couponValue, setCouponValue] = useState("");

    useEffect(() => {
      const couponCode = localStorage.getItem('discountCode');
      if(couponCode){
        setCouponValue(couponCode);
      }
    }, [])

    const handleDiscount = () => {
      if(boxProducts.length != 0){
        applyCoupon(couponValue);
        showCouponMessage(couponValue);
      }else{
        showErrorModal("Box is empty!", "Please add products to your cart to try applying a promotion code!");
      }
    }

    const [disableCouponInput, setDisableCouponInput] = useState(false);

    useEffect(() => {
      if(discount == 0){
        setDisableCouponInput(false);
      }else{
        setDisableCouponInput(true);
      }

    }, [discount]);

    const removeDiscount = () => {
      applyCoupon("");
      setCouponValue("");
    }

    const [createCheckoutMutation] = useCreateCheckoutMutation();

    const {setIsLoadingScreen} = useContext(LoadingContext);

    const handleRightSubmit = () => {
      if(!itemChange){
        setItemChange(true);
      }else{
        formikPaymentModal.handleSubmit();
      }
    }

    const handleSubmit = async () => {
      if(!itemChange){
        setItemChange(true);
      }else{
        if(user && selectedDeliveryAddress){
          try{
            setIsLoadingScreen(true);
            await createCheckoutMutation({
              userId: user?.id,
              products: boxProducts,
              price: parseInt(total),
              addressId: selectedDeliveryAddress.id
            }).unwrap();
            setTimeout(() => {
              handleRemoveAllFromCart();
              setIsLoadingScreen(false);
              navigate("/current-orders");
            }, 3000)
          }catch(err: any){
            console.log(err);
          }
        }
      }
    }

    const formikPaymentModal = useFormik({
      initialValues: {
          cardHolder: '',
          cardNumber: '',
          expDate: '',
          cvv: '',
      },
      validationSchema: paymentSchema,
      onSubmit: async (values, actions) => {
        actions.resetForm();
        handleSubmit();
      },
    });

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/\s/g, ''); 
      if(value.length <= 16){
        if (/^[0-9]+$/.test(value)) {
          let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
          formikPaymentModal.setFieldValue('cardNumber', formattedValue);
        }
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.key === 'Backspace' || e.key === 'Delete') && formikPaymentModal.values.cardNumber.length == 1) {
        formikPaymentModal.setFieldValue('cardNumber', '');
      }
    }

    const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      for (let i = 0; i < value.length; i++) {
        if (/^[0-9]+$/.test(value[i])) {
          return;
        }
      }
      formikPaymentModal.setFieldValue('cardHolder', value);
    };

    const handleExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      const numericInput = value.replace(/[^0-9]/g, "");

      let month = numericInput.substring(0, 2);
      let day = numericInput.substring(2, 4);

      month = month > "12" ? "12" : month;
      day = day > "30" ? "30" : day;

      const formattedInput = month + (day ? "/" + day : "");
    
      formikPaymentModal.setFieldValue('expDate', formattedInput);
    };

    const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if(value.length <= 3){
        formikPaymentModal.setFieldValue('cvv', value);
      }
    };

  return (
    <div className='checkout'>
      <div className="container">
        <div className="checkoutHeader">
          <img src={plainLogo} alt="logo" className='plainLogoCheckout' onClick={() => navigate("/home")}/>
          <div className="ssl-secured">
            <i className='i-ssl-secured'>
              <div className="ssl-secured-icon">
                <GppGoodIcon className='checkout-shield'/>
                <p className='ssl-secured-icon-desc mb-0'>
                  <span>SSL</span>
                  <span>secured</span>
                </p>
              </div>
            </i>
            <p className='p-ssl-secured'>
              SECURE PAYMENT
            </p>
          </div>
        </div>
        <div className="checkoutBody">
          <div className="row">
            <div className="col-12 col-lg-9">
              <div className="p-tabs">
                <div className="p-tabs-title w-100 h-100">
                  <div className={`p-address-tab w-100 ${!itemChange && "p-selected-tab"}`} onClick={() => setItemChange(false)}>
                    <div className="p-tab-head">Address Information</div>
                    <div className="p-tab-address-info">
                      <span>{selectedDeliveryAddress?.recipientFirstName} - {selectedDeliveryAddress?.title}</span>
                      <span>{selectedDeliveryAddress?.address}</span>
                    </div>
                  </div>
                  <div className="p-tabs-divider"/>
                  <div className={`p-payment-tab w-100 ${itemChange && "p-selected-tab"}`} onClick={() => setItemChange(true)}>
                    <div className="p-tab-head">Payment Information</div>
                    <div className="p-tab-payment-info mt-3">                   
                    You can securely make your payment using a&nbsp;
                    <span>bank or credit card</span>.
                    </div>
                  </div>
                </div>
                <div className={`p-tabs-mover ${itemChange ? "p-tabs-move" : "p-tabs-stay"}`}/>
              </div>
              {itemChange ? 
              <>
              <div className="p-shipping-payment">
                <div className="row">
                  <div className="col-12 col-md-7">
                    <div className="p-card">
                      <div className="p-card-item">
                        <div className="p-card-item-header">
                          <div>
                            <img src={masterCard} alt=""/>
                            <span>Mastercard</span>
                          </div>
                          <RssFeedIcon className='me-3' style={{color: "rgba(231, 231, 231, 0.733)"}}/>
                        </div>
                        <div className="p-card-item-body">
                          <div className="p-card-item-holder">
                            <span>{formikPaymentModal.values.cardHolder == '' ? "Card Holder" : formikPaymentModal.values.cardHolder}</span>
                          </div>
                          <div className="p-card-item-number">
                            <span>{formikPaymentModal.values.cardNumber == '' ? "Card Number" : formikPaymentModal.values.cardNumber}</span>
                          </div>
                          <div className="p-card-item-exp-cvv mt-3">
                            <div className="p-cart-item-small">
                              <span>Expiry Date</span>
                              <span>{formikPaymentModal.values.expDate == '' ? "MM/DD" : formikPaymentModal.values.expDate}</span>
                            </div>
                            <div className="p-cart-item-small">
                              <span>CVV</span>
                              <span>{formikPaymentModal.values.cvv == '' ? "***" : formikPaymentModal.values.cvv}</span>
                            </div> 
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-5">
                    <form onSubmit={formikPaymentModal.handleSubmit}>
                      <div className="p-card-infos">
                        <div className="card-infos-header mt-5 mb-5 mt-md-4">
                          <h4>Payment Details</h4>
                        </div>
                        <div className="card-infos-body">
                          <div className="row row-gap-3">
                            <div className="col-12">
                              <span>Cardholder Name</span>
                              <input type="text" 
                              id='cardHolder' 
                              onChange={(e) => handleCardHolderChange(e)} 
                              value={formikPaymentModal.values.cardHolder} 
                              onBlur={formikPaymentModal.handleBlur}
                              />
                              {formikPaymentModal.touched.cardHolder && formikPaymentModal.errors.cardHolder ? (
                                <div className='error-security'>{formikPaymentModal.errors.cardHolder}</div>
                              ) : <div className='error-security'></div>}
                            </div>
                            <div className="col-12 p-card-no">
                              <span>Cardholder Number</span>
                              <input type="text"
                              id='cardNumber' 
                              onKeyDown={(e) => handleKeyDown(e)}
                              onChange={(e) => handleCardNumberChange(e)} 
                              value={formikPaymentModal.values.cardNumber} 
                              onBlur={formikPaymentModal.handleBlur}
                              />
                              {formikPaymentModal.touched.cardNumber && formikPaymentModal.errors.cardNumber ? (
                                <div className='error-security'>{formikPaymentModal.errors.cardNumber}</div>
                              ) : <div className='error-security'></div>}
                              <img src={masterCard} alt="mc"/>
                            </div>
                            <div className="col-8 d-flex flex-column">
                              <span>Expiry Date</span>
                              <input type="text" style={{width: "75%"}} placeholder='MM/DD'
                              id='expDate' 
                              onChange={(e) => handleExpChange(e)} 
                              value={formikPaymentModal.values.expDate} 
                              onBlur={formikPaymentModal.handleBlur}
                              />
                              {formikPaymentModal.touched.expDate && formikPaymentModal.errors.expDate ? (
                                <div className='error-security'>{formikPaymentModal.errors.expDate}</div>
                              ) : <div className='error-security'></div>}
                            </div>
                            <div className="col-4 d-flex flex-column">
                              <span>CVV</span>
                              <input type="number"
                              onChange={(e) => handleCVVChange(e)} 
                              id='cvv' 
                              value={formikPaymentModal.values.cvv} 
                              onBlur={formikPaymentModal.handleBlur}
                              />
                              {formikPaymentModal.touched.cvv && formikPaymentModal.errors.cvv ? (
                                <div className='error-security'>{formikPaymentModal.errors.cvv}</div>
                              ) : <div className='error-security'></div>}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-center mt-5">
                          <button className="p-card-pay-btn" type='submit'>
                            <span>PAY NOW ${total}</span>
                          </button>
                        </div>
                        <div className="d-flex justify-content-center mt-5 mb-2 pay-card-test-info">
                          <div>
                            <i className="bi bi-unlock-fill me-1"/>
                            <span>This is a test-site don't enter <span className='real-cc'>real credit card</span> informations.</span>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              </> 
              :
              <div className='p-shipping-address'>
                <div className="p-shipping-header mb-3">
                  <h4>Delivery Address</h4>
                </div>
                <div className="p-shipping-body row">
                  <div className="col-12 col-md-6">
                    <div className="p-shipping-new-add" onClick={() => navigate("/addresses")}>
                      <AddIcon style={{width:"1.2em", height:"1.2em", color:"#282b78"}}/>
                      <span>Add New Address</span>
                    </div>
                  </div>
                  {user?.addresses?.map((item, index) => (
                    <div className={`col-12 col-md-6 p-shipping-item ${selectedDeliveryAddress?.id == item.id && "active"}`} key={index} onClick={() => handleSelectedAddress(item)}>
                      <div className="p-shipping-new">
                        <div className="p-shipping-new-header">
                          <span>
                            <i className="fa-solid fa-user" style={{color:"#282b78"}}/>
                            <span id='p-shipping-receiver'>{item.recipientFirstName.toUpperCase() + " " +item.recipientLastName.toUpperCase()}</span>
                          </span>
                          <span>
                            <i className="fa-solid fa-mobile-screen-button" style={{color:"#282b78"}}/>
                            <span id='p-shipping-receiver'>{"("+item.recipientPhoneNumber.substring(2,5) + ") *** " +item.recipientPhoneNumber.substring(10,12)}</span>
                          </span>
                        </div>
                        <div className="p-shipping-new-body">
                          {item.address}
                        </div>
                        <div className="p-shipping-new-footer">
                          {item.city +" / " + item.district}
                        </div>
                        <label className="p-shipping-select-address">
                          <input type="checkbox" checked={selectedDeliveryAddress?.id == item.id} readOnly/>
                          <span className="checkmark ms-1"></span>
                          <p className='mt-1'>{item.title}</p>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              }
              {!itemChange && <button className='p-tab-btn' onClick={handleSubmit}>Save</button>}
            </div>
            <div className="col-12 col-lg-3">
              <div className="checkoutInfo">
                <div className="checkoutInfoHeader ms-2 d-flex justify-content-between w-100">
                  <div className="d-flex gap-1">
                    <ShoppingCartIcon className='shoppingCartIconCheckout'/>
                    <h4 className='mb-0'>Cart</h4>
                    <h4 className='cartLength mb-1'>({boxProducts.length})</h4>
                  </div>
                  <div className="totalCheckout">
                    ${total}
                  </div>
                </div>
                <div className="checkout-divider"/>
                <div className="checkoutProducts">
                    {boxProducts.map((cartItem, index) => (
                    <React.Fragment key={index}>
                    <div className="checkoutItem">
                      <div className="checkoutItemImg" onClick={() => navigate(`/${cartItem.product.name.toLowerCase().replace(" ","-")}`)}>
                        <ImageComponent src={cartItem.product.imageUrl} blurhashImg={cartItem.product.blurhashImg} alt={cartItem.product.name}/>
                      </div>
                      <div className="checkoutItemInfos">
                        <div className="checkoutInfosHeader d-flex w-100 justify-content-between">
                          <div className='checkoutItemName' onClick={() => navigate(`/${cartItem.product.name.toLowerCase().replace(" ","-")}`)}>{cartItem.product.name}</div>
                          <button className="checkoutTrash" onClick={() => handleRemoveItemFromBox(cartItem)}>
                            <DeleteOutlineIcon />
                          </button>
                        </div>
                        <div className="checkoutItemInfosQuantities">
                          <div className="mt-1 boxDrawerItemPrice">
                            ${cartItem.quantity * cartItem.product.price}
                          </div>
                          <div className="boxDrawerItemQuantity">
                            <button onClick={() => handleDecreaseProductCount(cartItem)}><RemoveIcon style={{color: "black"}}/></button>
                            <input min={1} pattern="[0-9]" type="number" value={cartItem.quantity} 
                            onChange={(e) => handleProductCountChange(e, cartItem)}/>
                            <button onClick={() => handleIncreaseProductCount(cartItem)}><AddIcon style={{color: "black"}}/></button>
                          </div>                       
                        </div>
                      </div>
                    </div>
                    <div className="item-checkout-divider"/></React.Fragment>
                    ))}
                  </div>
                  <div className='d-flex flex-column gap-2 mt-1'>
                    <div className="boxDrawerCoupon">
                      <input type="text" 
                      placeholder="Enter Coupon Code"
                      value={couponValue} 
                      onChange={(e) => setCouponValue(e.target.value)}
                      disabled={disableCouponInput}
                      className={`${disableCouponInput && "disabledCoupon"}`}
                      />
                      {
                        disableCouponInput ?
                      <button onClick={removeDiscount} className="disableBtnCoupon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path fillRule="evenodd" clipRule="evenodd" d="M17.6568 19.0711L4.92893 6.34317L6.34314 4.92896L19.0711 17.6569L17.6568 19.0711Z"></path><path fillRule="evenodd" clipRule="evenodd" d="M4.92892 17.6569L17.6568 4.92896L19.0711 6.34317L6.34314 19.0711L4.92892 17.6569Z"></path></svg>
                      </button>:
                      <button onClick={handleDiscount}>
                        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"><g fill="currentColor"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093l3.473-4.425a.267.267 0 0 1 .02-.022z"></path></g></svg>
                      </button>
                      }
                    </div>
                    <div className="checkoutTotal">
                      <div className="checkoutTotalInformation">
                        <div className="boxDrawerCheckoutInfo">
                          <span>Total</span>
                          <span>
                          {discount == 0 ? 
                          "$"+handleCalculateTotal().toFixed(2)
                          :
                          <div className="codeValid">
                            <div className="boxDrawerInfoGroup">
                              <span className="codeValidDiscountPercentage">%{discount}</span>
                              <span className="codeValidDiscountBefore">${handleCalculateTotal().toFixed(2)}</span>
                            </div>
                            <span className="codeValidDiscountAfter">${(handleCalculateTotal() - (handleCalculateTotal()*(discount/100))).toFixed(2)}</span>
                          </div> 
                          }
                          </span>
                        </div>
                        <div className="boxDrawerCheckoutInfo">
                          <span>Shipping</span>
                          <span>
                            {handleCalculateTotal() < 50 ? 
                            "$12.99" 
                            : 
                            <div className="shippingFree">
                              <div className="boxDrawerInfoGroup">
                                <span className="codeValidDiscountPercentage">FREE</span>
                                <span className="codeValidDiscountBefore extraMg">$12.99</span>
                              </div>
                              <span className="codeValidDiscountAfter">$0</span>
                            </div>
                            }
                          </span>
                        </div>
                        <div className="boxDrawerCheckoutInfo">
                          <span>SubTotal</span>
                          <span>${total}</span>
                        </div>
                      </div>
                      <div className="boxDrawerCheckoutBtn">
                        <button onClick={handleRightSubmit} type='submit'>
                          <i className="bi bi-credit-card"/>
                          <span>SUBMIT</span>
                        </button>
                      </div>
                    </div>  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
