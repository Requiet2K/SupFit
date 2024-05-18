import { AccountPage } from '../AccountPage'
import { BreadCrumb } from '../BreadCrumb'
import '../../../style/AccountPage/AccountBase.css'
import '../../../style/AccountPage/components/Reviews.css'
import { ReviewState } from '../../../types/reviewType';
import { useEffect, useState } from 'react';
import { useLazyGetUserReviewsQuery } from '../../../redux/review/reviewApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/auth/authSlice';
import { Skeleton } from '@mui/material';
import { useLazyGetProductByIdQuery } from '../../../redux/product/productApiSlice';
import { ProductState } from '../../../types/productType';
import { ImageComponent } from '../../../utils/imageComponent';
import { StarsReview } from '../../../utils/starsReview';
import { useNavigate } from 'react-router-dom';

export const Reviews = () => {

  const [getUserReviewsQuery, {isLoading}] = useLazyGetUserReviewsQuery();
  const [getProductByIdQuery] = useLazyGetProductByIdQuery();

  const user = useSelector(selectCurrentUser);
  
 const [reviews, setReviews] = useState<{review: ReviewState, productData?: ProductState}[]>([]);

  const fetchProductDatas = async (productId: number) => {
    try {
      const data: ProductState = await getProductByIdQuery(productId).unwrap();
      return data;
    } catch(err: any) {
      console.log(err);
    }
  }

  useEffect(() => {
    if(user){
      const fetchReviewsData = async () => {
        try{
          const data = await getUserReviewsQuery(user.id).unwrap();
          // Fetch product data for each review
          const reviewsWithProductData = await Promise.all(data.map(async (review: { productId: number; }) => {
            const productData = await fetchProductDatas(review.productId);
            return {review, productData};
          }));
          setReviews(reviewsWithProductData);
        }catch(err: any){
          console.log(err);
        }
      }
      fetchReviewsData();
    }
  }, [user])

  function formatDeliveryDate(dateString: string): string {
    const date = new Date(dateString);
    const deliveryDay = date.getDate();
    const deliveryMonth = date.toLocaleString('en', { month: 'long' });
    const deliveryYear = date.getFullYear();
    return `${deliveryDay} ${deliveryMonth} ${deliveryYear}`;
  }

  const navigate = useNavigate();

  return (
    <div className='comments mb-3'>
      <div className="container p-1">
        <div className="row h-100">
          <BreadCrumb path={["comments"]}/>
          <div className="col-2 d-none d-lg-inline">
            <div className="account-left">
              <AccountPage />
            </div>
          </div>
          <div className="col-10 account-right">
            <div className="row mb-3">
              <div className="col-12">
                <div className="page-title">
                    <h3>My Reviews</h3>
                </div>
              </div>
            </div>
            <div className="content">
              <div className="review-comments">
                {isLoading ?
                <Skeleton height={368}/>
                :
                reviews && reviews.length > 0 ? 
                  reviews?.map((item, index) => (
                    <div className='review-comments-item mb-3' key={index}> 
                      <div className="row">
                        <div className="col-12 col-md-9">
                          <div className="review-comments-header">
                            <div className="row w-100">
                              <div className="col-0 col-sm-1 d-flex align-items-center justify-content-center">
                                <i className="bi bi-person-square"/>
                              </div>
                              <div className="col-12 col-sm-11 d-flex flex-column justify-content-center align-items-start">
                                <div className='d-flex justify-content-between align-items-center w-100'>
                                  <span className='review-you'>You</span>
                                  <span><StarsReview rating={item.review.rating} hoverRate={0}/></span>
                                </div>
                                <div className="review-comments-divider w-100"/>
                                <div className="review-date">
                                  {formatDeliveryDate(item.review.reviewDate.toString())}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="review-comments-footer">
                              {item.review.reviewDescription == "" ? <span> You didn't comment on the product. </span> : item.review.reviewDescription}
                          </div>
                        </div>
                        <div className="col-12 col-md-3 review-comments-img">
                          <span onClick={() => {item.productData && navigate(`/${item.productData.name.toLowerCase().replace(" ","-")}`)}}>
                            {item.productData && <ImageComponent src={item.productData?.imageUrl} blurhashImg={item.productData?.blurhashImg} alt={item.productData?.name}/>}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                  :
                  <div className='emptyOrders'>
                    <h3 className='text-center'>You don't have any reviews.</h3>
                    <i className="fa-solid fa-comment-dots"/>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
