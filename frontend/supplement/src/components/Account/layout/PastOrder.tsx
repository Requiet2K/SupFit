import { AccountPage } from '../AccountPage'
import { BreadCrumb } from '../BreadCrumb'
import '../../../style/AccountPage/AccountBase.css'
import { CheckoutState } from '../../../types/checkoutType';
import { useLazyGetPastOrdersQuery } from '../../../redux/checkout/checkoutApiSlice';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/auth/authSlice';
import { Accordion, AccordionDetails, AccordionSummary, Skeleton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ImageComponent } from '../../../utils/imageComponent';
import { useLazyIsProductReviewedQuery } from '../../../redux/review/reviewApiSlice';
import { useNavigate } from 'react-router-dom';

export const PastOrder = () => {

  const [pastOrders, setPastOrders] = useState<CheckoutState[] | undefined>();

  const user = useSelector(selectCurrentUser);

  const [getPastOrdersQuery] = useLazyGetPastOrdersQuery();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    setLoading(true);

    const fetchData = async () => {
      if(user){
        try {
          const data = await getPastOrdersQuery(user.id).unwrap();
          setPastOrders(data);
        } catch (err: any) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  function formatDeliveryDate(dateString: string): string {
    const date = new Date(dateString);
    const deliveryDay = date.getDate();
    const deliveryMonth = date.toLocaleString('en', { month: 'long' });
    const deliveryYear = date.getFullYear();
    return `${deliveryDay} ${deliveryMonth} ${deliveryYear}`;
  }

  const [isProductReviewedQuery] = useLazyIsProductReviewedQuery();

  async function isProductReviewed(productId: number): Promise<boolean>{
    if(user){
      try{
        const data: boolean = await isProductReviewedQuery({productId, userId: user.id}).unwrap();
        return data;
      }catch(err: any){
        console.log(err);
        return false;
      }
    }else{
      return false;
    }
  }

  const [reviewedProducts, setReviewedProducts] = useState<{productId: number, isReviewed: boolean}[]>([]);

  useEffect(() => {
    if(pastOrders !== undefined && pastOrders.length > 0 && !loading){
      pastOrders.forEach(async (order) => {
        order.products.forEach(async (product) => {
          const isReviewed = await isProductReviewed(product.product.id);
          setReviewedProducts(prevState => [...prevState, {productId: product.product.id, isReviewed}]);
        });
      });
    }
  }, [pastOrders, loading]);

  const navigate = useNavigate();

  return (
    <div className='pastOrder mb-3'>
      <div className="container p-1">
        <div className="row h-100">
          <BreadCrumb path={["order","past-orders"]}/>
          <div className="col-2 d-none d-lg-inline">
            <div className="account-left">
              <AccountPage />
            </div>
          </div>
          <div className="col-10 account-right">
            <div className="row mb-3">
              <div className="col-12">
                <div className="page-title">
                    <h3>Past Orders</h3>
                </div>
              </div>
            </div>
            <div className="content">
              {loading ? 
              <Skeleton height={368}/>
              :
              <>
               {pastOrders && pastOrders?.length > 0 ?
                <div className='orderContent'> 
                  {pastOrders.map((item, index) => (
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
                                <span>Delivered On</span>
                                <span>{formatDeliveryDate(item.deliveryDate.toString())}</span>
                              </div>
                              <div className="order-item-status">
                                <i className="fa-solid fa-circle-check"/>
                                <span>Successfully Delivered</span>
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
                                    <h4>Order Completed</h4>
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
                                  {item.products.map((item, index) => {
                                    const productReviewInfo = reviewedProducts.find(reviewInfo => reviewInfo.productId === item.product.id);
                                    return (
                                      <div className='order-detail-item' key={index}> 
                                        <ImageComponent src={item.product.imageUrl} 
                                        alt={item.product.name} blurhashImg={item.product.blurhashImg} />
                                        <div className="order-detail-item-infos d-flex flex-column gap-1">
                                          <span className='order-detail-item-infos-quantity'>{item.product.name} x {item.quantity}</span>
                                          <span className='order-detail-item-infos-price'>${item.product.price*item.quantity}</span>
                                          <span className='order-detail-item-infos-weight'>Size: {item.product.weight}g</span>
                                          {!productReviewInfo?.isReviewed ?
                                          <span>
                                            <button className='addReviewPastOrders' 
                                            onClick={() => navigate(`/${item.product.name.toLowerCase().replace(" ","-")}`)}>Add Review</button>
                                          </span>
                                          :
                                          <span>
                                            <i className="fa-solid fa-circle-check me-1"/>
                                            Reviewed
                                          </span>
                                          }
                                        </div>
                                      </div>
                                    );
                                  })}
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
                                          <i className="fa-solid fa-circle-check me-1"/>
                                          <span>Delivery completed.</span>
                                        </span>
                                        <span className='order-est'>
                                          Successfully delivered on <span>{formatDeliveryDate(item.deliveryDate.toString())}</span>
                                        </span>
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
                  <h3>You don't have any past orders.</h3>
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
