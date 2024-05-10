import { AccountPage } from '../AccountPage'
import { BreadCrumb } from '../BreadCrumb'
import '../../../style/AccountPage/AccountBase.css'
import '../../../style/AccountPage/components/CurrentOrder.css'
import { useEffect, useState } from 'react'
import { CheckoutState } from '../../../types/checkoutType'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../../redux/auth/authSlice'
import { useLazyGetCurrentOrdersQuery } from '../../../redux/checkout/checkoutApiSlice'
import { Accordion, AccordionDetails, AccordionSummary, Skeleton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ImageComponent } from '../../../utils/imageComponent'

export const CurrentOrder = () => {

  const [currentOrders, setCurrentOrders] = useState<CheckoutState[] | undefined>();

  const user = useSelector(selectCurrentUser);

  const [getCurrentOrdersQuery] = useLazyGetCurrentOrdersQuery();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "visible";
  }, []);

  useEffect(() => {

    setLoading(true);

    const fetchData = async () => {
      if(user){
        try {
          const data = await getCurrentOrdersQuery(user.id).unwrap();
          setCurrentOrders(data);
        } catch (err: any) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(currentOrders);
  }, [currentOrders])

  function formatDeliveryDate(dateString: string): string {
    const date = new Date(dateString);
    const deliveryDay = date.getDate();
    const deliveryMonth = date.toLocaleString('en', { month: 'long' });
    const deliveryYear = date.getFullYear();
    return `${deliveryDay} ${deliveryMonth} ${deliveryYear}`;
  }

  return (
    <div className='currentOrder mb-3'>
      <div className="container p-1">
        <div className="row h-100">
          <BreadCrumb path={["order","current-orders"]}/>
          <div className="col-2 d-none d-lg-inline">
            <div className="account-left">
              <AccountPage />
            </div>
          </div>
          <div className="col-10 account-right">
            <div className="row mb-3">
              <div className="col-12">
                <div className="page-title">
                    <h3>Current Orders</h3>
                </div>
              </div>
            </div>
            <div className="content">
              {loading ? 
              <Skeleton height={368}/>
              :
              <>
               {currentOrders && currentOrders?.length > 0 ? 
                <div className='orderContent'> 
                  {currentOrders.map((item, index) => (
                    <div className='order-item' key={index}>
                      <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel4-content"
                            id="panel4-header"
                          >
                            <div className="order-images">
                              <div className="order-item-imgs">
                              {item.products.length > 3 ?
                                  <>
                                      <ImageComponent src={item.products[0].product.imageUrl} alt={item.products[0].product.name} blurhashImg={item.products[0].product.blurhashImg} />
                                      <ImageComponent src={item.products[1].product.imageUrl} alt={item.products[1].product.name} blurhashImg={item.products[1].product.blurhashImg} />
                                      <div className='order-item-imgs-more'>
                                          +{item.products.length - 2}
                                      </div>
                                  </>
                                  :
                                  item.products.map((checkoutProduct, index) => (
                                      <ImageComponent src={checkoutProduct.product.imageUrl} alt={checkoutProduct.product.name} blurhashImg={checkoutProduct.product.blurhashImg} key={index}/>
                                  ))
                              }
                              </div>
                            </div>
                            <div className='order-item-body'>
                              <div className="order-item-date">
                                <span>Estimated Delivery</span>
                                <span>{formatDeliveryDate(item.deliveryDate.toString())}</span>
                              </div>
                              <div className="order-item-status">
                                <i className="fa-solid fa-truck-fast"/>
                                <span>On Way</span>
                              </div>
                              <div className='order-item-dash'>
                                <span>{formatDeliveryDate(item.checkoutDate.toString())}</span>
                                <span>${item.price}</span>
                              </div>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className='order-details'>
                              <div className="row">
                                <div className="col-12">
                                <div className="order-details-header">
                                  <div className="order-details-header-left">
                                    <h4>Order Sent</h4>
                                    <span>Order Placed on {formatDeliveryDate(item.checkoutDate.toString())}</span>
                                  </div>
                                  <div className="order-details-header-right">
                                    <span>Total <span className='order-details-price'>${item.price}</span></span>
                                  </div>
                                </div>
                                <div className="order-details-divider"/>
                                </div>
                                <div className="col-12 col-md-8">
                                  <div className='order-details-items'>
                                    {item.products.map((item, index) => (
                                      <div className='order-detail-item' key={index}> 
                                        <ImageComponent src={item.product.imageUrl} 
                                        alt={item.product.name} blurhashImg={item.product.blurhashImg} />
                                        <div className="order-detail-item-infos d-flex flex-column gap-1">
                                          <span className='order-detail-item-infos-quantity'>{item.product.name} x {item.quantity}</span>
                                          <span className='order-detail-item-infos-price'>${item.product.price*item.quantity}</span>
                                          <span className='order-detail-item-infos-weight'>Size: {item.product.weight}g</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="col-12 col-md-4">
                                  <div className="order-address-detail">
                                    <div className="order-address-detail-header">
                                      <h5>Delivery Address</h5>
                                    </div>
                                    <div className="order-details-divider"/>
                                    <div className="order-address-infos my-2">
                                      <span>
                                        {item.address.recipientFirstName + " " + item.address.recipientLastName}
                                      </span>
                                      <span>
                                        +{" "+item.address.recipientPhoneNumber.substring(0, 2) + " " + 
                                        item.address.recipientPhoneNumber.substring(2, 5) + " " +
                                        item.address.recipientPhoneNumber.substring(5, 8) + " " +
                                        item.address.recipientPhoneNumber.substring(8, 10) + " "+
                                        item.address.recipientPhoneNumber.substring(10, 12)}
                                      </span>
                                      <span>
                                        {item.address.city + " / " + item.address.district}
                                      </span>
                                      <span>
                                        {item.address.address}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="order-status">
                                    <div className="order-status-detail-header mt-3">
                                      <h5>Order Status</h5>
                                      <div className="order-details-divider"/>
                                      <div className="order-details-titles">
                                        <span className='order-delivery'>
                                          <i className="fa-solid fa-truck-fast me-2"/> 
                                          <span>Delivery in progress.</span>
                                        </span>
                                        <span className='order-est'>
                                          Estimated delivery on <span>{formatDeliveryDate(item.deliveryDate.toString())}</span>
                                        </span>
                                      </div>
                                      <div className="order-status-truck mt-2">
                                        <div className="truck-animation">
                                          <div className="wrap">
                                            <div className="mountain"></div>
                                            <div className="tree">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="100" viewBox="0 0 32 100">
                                                <path fill="#FFF" d="M31.945 74.986L17.37 1.148A1.416 1.416 0 0 0 15.988 0c-.673 0-1.252.48-1.383 1.148L.027 74.986c-.083.42.025.854.292 1.186.268.332.669.523 1.091.523h13.167V100h2.821V76.695h13.165c.422 0 .821-.191 1.09-.523.27-.331.375-.766.292-1.186z"/>
                                              </svg>
                                            </div>
                                            <div className="tree">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="100" viewBox="0 0 32 100">
                                                <path fill="#FFF" d="M31.945 74.986L17.37 1.148A1.416 1.416 0 0 0 15.988 0c-.673 0-1.252.48-1.383 1.148L.027 74.986c-.083.42.025.854.292 1.186.268.332.669.523 1.091.523h13.167V100h2.821V76.695h13.165c.422 0 .821-.191 1.09-.523.27-.331.375-.766.292-1.186z"/>
                                              </svg>
                                            </div>
                                            <div className="tree">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="100" viewBox="0 0 32 100">
                                                <path fill="#FFF" d="M31.945 74.986L17.37 1.148A1.416 1.416 0 0 0 15.988 0c-.673 0-1.252.48-1.383 1.148L.027 74.986c-.083.42.025.854.292 1.186.268.332.669.523 1.091.523h13.167V100h2.821V76.695h13.165c.422 0 .821-.191 1.09-.523.27-.331.375-.766.292-1.186z"/>
                                              </svg>
                                            </div>
                                            <div className="rock"></div>
                                            <div className="truck">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="85" height="60" viewBox="0 0 85 60">
                                                <path fill="#FFF" d="M5.138 54.039a3.77 3.77 0 0 1-.149-.005l-.859.002A4.134 4.134 0 0 1 0 49.906V5.195a4.135 4.135 0 0 1 4.13-4.133h46.973c2.272 0 4.123 1.95 4.123 4.229v44.612a4.133 4.133 0 0 1-4.127 4.131H29.962c-1.091-.019-3.239-.691-3.727-3.128-1.067-3.957-4.755-6.789-8.947-6.789-4.291 0-8.098 3.041-9.051 7.229-.225 1.817-1.723 2.693-3.099 2.693zM4.127 4.208c-.596 0-1.083.389-1.083.987v44.709c0 .597.488 1.086 1.086 1.086h1.004c.005-.047.123-.271.133-.317 1.267-5.562 6.323-9.597 12.022-9.597a12.356 12.356 0 0 1 11.912 9.137c.151.734.681.777.785.777h21.111c.596 0 1.083-.487 1.083-1.084V5.293c0-.598-.485-1.085-1.083-1.085H4.127zM84.929 35.828s-.093-2.093-.288-3.118c-.164-.873-1.087-2.644-1.087-2.644l-7.299-13.59c-.951-1.52-3.115-2.707-4.558-2.707H60.785a2.608 2.608 0 0 0-2.606 2.609v33.526a2.609 2.609 0 0 0 2.606 2.609h.643s.949-.123 1.304-1.312c.986-3.933 4.514-6.862 8.749-6.862 4.145 0 7.612 2.808 8.682 6.613.442 1.612 2.231 1.561 2.231 1.561A2.608 2.608 0 0 0 85 49.904l-.071-14.076zm-6.603-3.511H65.312a1.996 1.996 0 0 1-1.989-1.99V20.143c0-1.098.894-1.99 1.989-1.99h4.365c2.483 0 4.117 2.009 4.63 2.978l5.065 9.434c.521.962.053 1.752-1.046 1.752z"/>
                                                <path fill="#102b38" d="M4.127 4.208c-.596 0-1.083.389-1.083.987v44.709c0 .597.488 1.086 1.086 1.086h1.004c.005-.047.123-.271.133-.317 1.267-5.562 6.323-9.597 12.022-9.597a12.356 12.356 0 0 1 11.912 9.137c.151.734.681.777.785.777h21.111c.596 0 1.083-.487 1.083-1.084V5.293c0-.598-.485-1.085-1.083-1.085H4.127z"/>
                                              </svg>
                                            </div>
                                            <div className="wheels">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="85" height="15" viewBox="0 0 85 15">
                                                <circle fill="#FFF" cx="17.289" cy="8.413" r="6.587"/>
                                                <circle fill="#FFF" cx="71.48" cy="8.412" r="6.586"/>
                                              </svg>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                    </div>
                  ))}
                </div>
                :
                <div className='emptyOrders'>
                  <h3>You don't have any current orders.</h3>
                  <i className="fa-solid fa-dolly"/>
                </div>
                } 
              </>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
