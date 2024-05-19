import { ProductState } from "../../types/productType"
import '../../style/MainPages/ProductItem.css';
import { BreadCrumb } from "../Account/BreadCrumb";
import { ImageComponent } from "../../utils/imageComponent";
import { useContext, useEffect, useRef, useState } from "react";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, updateUser } from "../../redux/auth/authSlice";
import { VariantType, useSnackbar } from 'notistack';
import { useAddFavoriteProductMutation, useLazyGetUserQuery, useRemoveFavoriteProductMutation } from "../../redux/user/userApiSlice";
import { Accordion, AccordionDetails, AccordionSummary, Pagination, Skeleton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { CartContext } from "../../context/CartContext";
import ClockLoader from "react-spinners/ClockLoader";
import { useCreateReviewMutation, useLazyGetProductRatingQuery, useLazyGetProductReviewsQuery, useLazyGetProductTotalCommentsQuery, useLazyGetRatingCountsQuery, useLazyIsProductReviewedQuery } from "../../redux/review/reviewApiSlice";
import { showErrorModal, showSuccessModal } from "../swalInfo/swalInfo";
import { StarsReview } from "../../utils/starsReview";
import { ReviewProductState, ReviewState } from "../../types/reviewType";
import { useLazyIsProductDeliveredQuery } from "../../redux/checkout/checkoutApiSlice";

export const ProductItem = ({product, productPath
} : {product : ProductState, productPath: string}) => {

  const user = useSelector(selectCurrentUser);

  const { enqueueSnackbar } = useSnackbar();

  const handleClickVariant = (msg: string ,variant: VariantType) => () => {
    enqueueSnackbar(msg, { variant });
  };

  const [selectedFlavour, setSelectedFlavour] = useState<string | null>
  (Object.keys(product.flavours).length > 0 ? Object.entries(product.flavours)[0][0] : null);

  const [productCount, setProductCount] = useState(1);

  const handleIncreaseProductCount = () => {
    if(productCount + 1 > product.quantity){
      setProductCount(product.quantity);
    }else{
      setProductCount(productCount + 1);
    }
  }

  const handleDecreaseProductCount = () => {
    if(productCount - 1 <= 0){
      setProductCount(1);
    }else{
      setProductCount(productCount - 1);
    }
  }

  const handleProductCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = parseInt(e.target.value);
    if (isNaN(newCount)) {
      setProductCount(1);
    } else if(newCount <= 0){
      setProductCount(1);
    } else if(newCount > product.quantity){
      setProductCount(product.quantity);
    } else{
      setProductCount(newCount);
    }
  }

  const [favoriteProduct, setFavoriteProduct] = useState(false);
  const [getUpdatedUser] = useLazyGetUserQuery();;
  
  useEffect(() => {
    if(user){
      const isFavorite = user.favorites.some((favProduct) => favProduct.id === product.id);
      setFavoriteProduct(isFavorite);
    }
  }, [user, product, favoriteProduct]);
  
  const [addFavorites] = useAddFavoriteProductMutation();
  const dispatch = useDispatch();

  const handleAddFavorites = async (productId : number) => {
    if(user){
      try{
        await addFavorites({id: user?.id, credentials: productId});
        const userUpdated = await getUpdatedUser(user.id).unwrap();
        dispatch(updateUser(userUpdated));
        setFavoriteProduct(true);
        handleClickVariant(`${product.name} added into your favorites!`,'success')();
      }catch(err: any){
        console.log(err);
      }
    }
  }

  const [removeFavorites] = useRemoveFavoriteProductMutation();

  const handleRemoveFavorites = async (productId : number) => {
    if(user){
      try{
        await removeFavorites({id: user?.id, credentials: productId});
        const userUpdated = await getUpdatedUser(user.id).unwrap();
        dispatch(updateUser(userUpdated));
        setFavoriteProduct(false);
        handleClickVariant(`${product.name} removed from your favorites!`,'success')();
      }catch(err: any){
        console.log(err);
      }
    }
  }

  const calculateCalories = (nutritionFacts: Record<string, number>) => {
    let totalCalories = 0;
    if (nutritionFacts['Fat']) {
        totalCalories += nutritionFacts['Fat'] * 9;
    }

    if (nutritionFacts['Protein']) {
        totalCalories += nutritionFacts['Protein'] * 4;
    }

    if (nutritionFacts['Carbohydrates']) {
        totalCalories += nutritionFacts['Carbohydrates'] * 4;
    }

    return totalCalories;
  };

  const { getBoxItems, handleAddToCart, addToCartLoading } = useContext(CartContext);
  
  const handleAddCart = () => {
    
    const cartData = localStorage.getItem("cart");
    
    if(cartData){
      const cartItems = JSON.parse(cartData);
      const cartProduct = cartItems.find((item: { product: { id: number; }; }) => item.product.id === product.id); 
      const quantity = cartProduct ? cartProduct.quantity : 0;

      if(product.quantity <= quantity){
        handleClickVariant(`You cannot add more items to the box than the quantity available in stock!`,'error')();
      }else{
        let msg = productCount > 1 ? "pieces" : "piece";
        if(productCount + quantity <= product.quantity){
          handleClickVariant(`${productCount} ${msg} ${product.name} added into your box!`,'success')();
          handleAddToCart(product, productCount);
        }
        else{
          msg = (product.quantity - quantity) > 1 ? "pieces" : "piece";
          handleClickVariant(`${product.quantity - quantity} ${msg} ${product.name} added into your box!`,'success')();
          handleAddToCart(product, product.quantity - quantity);
        }
      }
    }else{
        handleAddToCart(product, productCount);
        let msg = productCount > 1 ? "pieces" : "piece";
        handleClickVariant(`${productCount} ${msg} ${product.name} added into your box!`,'success')();
    }
    getBoxItems();
  }

  const [isProductReviewedQuery] = useLazyIsProductReviewedQuery();
  const [productReviewed, setProductReviewed] = useState(false);

  useEffect(() => {
    if(user){
      const fetchReviwedData = async () => {
        try{
          const data = await isProductReviewedQuery({productId: product.id, userId: user.id}).unwrap();
          setProductReviewed(data);
        }catch(err: any){
          console.log(err);
        }
      }
      fetchReviwedData();
    }
  },[])

  const [permissionReview, setPermissionReview] = useState(false);

  const [isProductDeliveredQuery] = useLazyIsProductDeliveredQuery();

  const [isProductPurchased, setIsProductPurchased] = useState(false);

  useEffect(() => {
    if(user){
      const isProductShipped = async () =>{
        try{
          const data = await isProductDeliveredQuery(
            {userId: user.id, productId: product.id}).unwrap();
            setIsProductPurchased(data);
        }catch(err: any){
          console.log(err);
        }
      }
      isProductShipped();
    }
  }, [user]);

  const handleReviewClick = () => {
    if(user){
      if(productReviewed){
        showErrorModal("Already reviewed!","You already reviewed this product!");
      }
      else if(!isProductPurchased){
        showErrorModal("Purchase required!","In order to comment, you must purchase the product and receive it!");
      }
      else{
        setPermissionReview(!permissionReview);
      }
    }else{
      showErrorModal("Login required!", "To add a review, you must login!");
    }
  }

  const [starInput, setStarInput] = useState(0);
  const [hoverRate, setHoverRate] = useState(0);
  const [commentText, setCommentText] = useState("");
  
  const [createReviewMutation] = useCreateReviewMutation();

  const handleReviewSubmit = async () => {
    if(user){
      if(starInput == 0){
        showErrorModal("Select rating!","Please rate this product as much as you are satisfied.");
      }else if(commentText != "" && commentText.trim().length < 10){
        showErrorModal("Add comment or leave it blank!","If you want to leave a comment on this product please enter comment more than 10 chars.");
      }else{
        try{
          await createReviewMutation({
            review: {
              userId: user.id,
              productId: product.id,
              rating: starInput,
              reviewDescription: commentText,
              reviewDate: new Date()
            }
          });
          showSuccessModal("Successfully reviewed!","You have successfully reviewed this product. To see your comment to go comments page in your dashboard.");
          setPermissionReview(false);
          setProductReviewed(true);
        }catch(err: any){
          console.log(err);
        }
      }      
    }
  }

  const [reviews, setReviews] = useState<ReviewProductState[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
  const [totalAmountOfComments, setTotalAmountOfComments] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [productRating, setProductRating] = useState(0);

  const [getProductReviewsQuery, { isLoading: isLoadingReviews }] = useLazyGetProductReviewsQuery();

  useEffect(() => {
    const getProductReviews = async () => {
      try{  
        const data: any = await getProductReviewsQuery({
          productId: product.id,
          page: currentPage - 1,
          size: reviewsPerPage
        });
        setTotalAmountOfReviews(data.data.totalElements);
        setTotalPages(data.data.totalPages);
        setReviews(data.data.content);
      }catch(err: any){
        console.log(err);
      }
    }
    getProductReviews();
  }, [currentPage, productReviewed])

  const [getProductTotalCommentsQuery] = useLazyGetProductTotalCommentsQuery();
  
  useEffect(() => {
    const getProductCommentsSize = async () => {
      try{
        const data = await getProductTotalCommentsQuery(product.id).unwrap();
        setTotalAmountOfComments(data);
      }catch(err: any){
        console.log(err);
      }
    }
    getProductCommentsSize();
  }, [productReviewed]);

  const [getProductRatingQuery] = useLazyGetProductRatingQuery();

  useEffect(() => {
    const getProductRating = async () => {
      try{
        const data = await getProductRatingQuery(product.id).unwrap();
        setProductRating(data);
      }catch(err: any){
        console.log(err);
      }
    }
    getProductRating();
  }, [productReviewed]);


  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const [getRatingCountsQuery] = useLazyGetRatingCountsQuery();

  const [votes, setVotes] = useState({});

  useEffect(() => {
    const getProductRatingNums = async () => {
      try{
        const data = await getRatingCountsQuery(product.id).unwrap();
        setVotes(data);
      }catch(err: any){
        console.log(err);
      }
    }
    getProductRatingNums();
  }, [productReviewed])
  
  const totalVotes = (Object.values(votes) as number[]).reduce((a: number, b: number) => a + b, 0);

  const commentsRef = useRef<HTMLDivElement>(null);

  const scrollToComments = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const reviewsRef = useRef<HTMLDivElement>(null);

  const scrollToReviews = () => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const commentsRefPagination = useRef<HTMLDivElement>(null);

  const scrollToCommentsPagination = () => {
    if (commentsRefPagination.current) {
      commentsRefPagination.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const paginationList = document.querySelector('.css-wjh20t-MuiPagination-ul');

  if (paginationList) {
    const listItems = paginationList.querySelectorAll('li');

    listItems.forEach((listItem) => {
      listItem.addEventListener('click', (event) => {
        const clickedItem = event.target as HTMLLIElement; 
        if (clickedItem) { 
          clickedItem.onclick = scrollToCommentsPagination; 
        }
      });
    });
  }

  return (
      <div className="productItemPage">
        <div className="container">
          <div className="productItemPageHeader mt-2">
            <BreadCrumb path={[product.categoryName, productPath]}/>
          </div>
          <div className="productItemContent row">
            <div className="itemContentLeft col-12 col-md-6">
              <ImageComponent src={product.imageUrl} alt={product.name} blurhashImg={product.blurhashImg} />
            </div>
            <div className="itemContentRight col-12 col-md-6">
              <div className="productItemName">
                <h1>{product.name.toUpperCase()}</h1>
              </div>
              <div className="productItemTitle">
                <h6>{product.title}</h6>
              </div>
              <div className="productItemDashboard">
                <div className="productItemStars d-flex" onClick={scrollToReviews}>
                  <StarsReview rating={productRating} hoverRate={0}/>
                  <span className="ms-2 productItemStarsRate mt-1">{productRating}</span>
                  <span className="ms-1 productItemStarsRateCount mt-1">({totalAmountOfReviews})</span>
                </div>
                <div className="productItemComments mt-1">
                  <i className="fa-regular fa-comment"/>
                  <span className="ms-1" onClick={scrollToComments}>{totalAmountOfComments} Comments</span>
                </div>
              </div>
              <div className="productItemDivider mt-2"/>
              {Object.keys(product.flavours).length > 0 &&
                <div className="productItemFlavors mt-2">
                  <h5 className="mt-2">Flavour</h5>
                  <div className="flavors">
                  {Object.entries(product.flavours).map(([flavour, color]) => (
                    <div className="flavors-item" style={{borderColor: color}} key={flavour} onClick={() => setSelectedFlavour(flavour)}>
                      <div className="flavors-item-color" style={{background: color}}/>
                      <span style={{color: color}}>{flavour.toUpperCase()}</span>
                      {selectedFlavour == flavour && <i className="fa-regular fa-circle-check"/>}
                    </div>
                  ))}
                  </div>
                </div>
              }
              <div className="productItemInfo mt-4">
                <div className="productItemInfoContainer">
                  <div className={`productItemDash ${Object.keys(product.flavours).length == 0 && "productItemDash2"}`}>
                    <span className={`${Object.keys(product.flavours).length == 0 && "fs-5"}`}>{product.weight}G</span>
                    {Object.keys(product.flavours).length > 0 &&
                    <span className="text-center">{product.servingAmount} servings</span>
                    }
                  </div>
                </div>
                {Object.keys(product.flavours).length > 0 &&
                    <div className="productItemInfoContainer">
                      <div className={`productItemDash ${Object.keys(product.flavours).length == 0 && "productItemDash2"}`}>
                        <span className="productItemPerServing">{(product.price/product.servingAmount).toLocaleString()}$</span>
                        <span className="text-center">per serving</span>
                      </div>
                    </div>
                }
                <div className="productItemInfoContainer">
                  <div className={`productItemDash ${Object.keys(product.flavours).length == 0 && "productItemDash2"}`}>
                    <span className="productItemPerStock">{product.quantity}</span>
                    <span className="text-center">in stock</span>
                  </div>
                </div>
              </div>
              <div className="productItemPrice mt-4">
                <span>
                  {product.price * productCount} USD
                  {productCount > 1 && <span className="ms-4 fs-5 text-danger">({productCount} pieces)</span>}
                </span>
                {user ? 
                  <>
                    {favoriteProduct ?                       
                      <button onClick={() => handleRemoveFavorites(product.id)}>
                        <i className="fa-solid fa-heart-circle-minus"/>
                        <span>Remove from Favorites</span>
                      </button>
                      :
                      <button onClick={() => handleAddFavorites(product.id)}>
                        <i className="fa-solid fa-heart-circle-plus"/>
                        <span>Add to Favorites</span>
                      </button>
                  }
                  </>
                  :
                  <button onClick={handleClickVariant("Login required!", 'warning')}>
                    <i className="fa-solid fa-heart-circle-plus"/>
                    <span>Add to Favorites</span>
                  </button>
                }
              </div>
              <div className="productItemBox mt-3">
                <div className="productItemBox-left">
                  <button onClick={handleDecreaseProductCount}><RemoveIcon /></button>
                  <input min={1} pattern="[0-9]" type="number" value={productCount} onChange={(e) => handleProductCountChange(e)}/>
                  <button onClick={handleIncreaseProductCount}><AddIcon /></button>
                </div>
                <div className="productItemBox-right">
                  <button className={`gap-3 ${product.quantity == 0 && "disabledProductItemBtn"}`} onClick={handleAddCart} disabled={product.quantity == 0}>
                    {addToCartLoading ? 
                    <ClockLoader color="#ffffff" size={32}/>
                    :
                    <>
                    {product.quantity != 0 && <AddShoppingCartIcon className="fs-2"/>}
                    <span>{product.quantity == 0 ? "OUT OF STOCK" : "Add to Cart"}</span> 
                    </>
                    }
                  </button>
                </div>
              </div>
              {
                Object.keys(product.flavours).length == 0 &&
                <div className="productSingleItemDescription">
                  <div className="row">
                    <div className="col-12">
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel4-content"
                          id="panel4-header"
                        >
                          <div className='productItemDescriptionTitle'>
                            DESCRIPTION
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className='productItemDescriptionContent'>
                            <div className="productItemAbout">
                              <span>{product.description}</span>
                            </div>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
          {Object.keys(product.flavours).length > 0 ? 
          <div className="productItemDescription">
            <div className="row">
              <div className="col-6 col-md-4">
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4-content"
                    id="panel4-header"
                  >
                    <div className='productItemDescriptionTitle'>
                      DESCRIPTION
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className='productItemDescriptionContent'>
                      <div className="productItemAbout">
                        <h6>About</h6>
                        <span>{product.description}</span>
                      </div>
                      <div className="productItemUse mt-3">
                        <h6>How to Use?</h6>
                        <span>{product.usageDescription}</span>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
              <div className="col-6 col-md-4">
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4-content"
                    id="panel4-header"
                  >
                    <div className='productItemDescriptionTitle'>
                      INGREDIENTS
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className='productItemDescriptionContent'>
                      {product.ingredients.map((ing, index) => (
                        <span key={index}>
                          {ing}
                          {index !== product.ingredients.length - 1 ? ", " : "."}</span>
                      ))}
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
              <div className="col-12 col-md-4">
                <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel4-content"
                      id="panel4-header"
                    >
                      <div className='productItemDescriptionTitle'>
                        NUTRITION FACTS
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className='productItemDescriptionContent'>
                        <section className="performance-facts mb-2">
                          <header className="performance-facts__header">
                            <h1 className="performance-facts__title">Nutrition Facts</h1>
                            <p>Serving Size {product.servingAmount} gr</p>
                              <p>Serving Per Container {(product.weight/product.servingAmount).toFixed()}</p>
                          </header>
                          <table className="performance-facts__table">
                            <thead>
                              <tr>
                                <th colSpan={3} className="small-info">
                                  Amount Per Serving
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th colSpan={2}>
                                  <b>Calories</b>
                                </th>
                                <td>
                                  {calculateCalories(product.nutritionFacts)}
                                </td>
                              </tr>
                              <tr className="thick-row">
                                <td colSpan={3} className="small-info">
                                  <b>Amount Per Serving</b>
                                </td>
                              </tr>
                              {['Fat', 'Protein', 'Carbohydrates'].map((key) => (
                                  product.nutritionFacts[key] && (
                                      <tr key={key}>
                                          <th colSpan={2}>
                                              <b>{key}</b>
                                          </th>
                                          <td>
                                              <b>{product.nutritionFacts[key]}</b>
                                          </td>
                                      </tr>
                                  )
                              ))}
                              {Object.entries(product.nutritionFacts).map(([key, value]) => (
                                  !['Fat', 'Protein', 'Carbohydrates'].includes(key) && (
                                      <tr key={key}>
                                          <th colSpan={2}>
                                              <b>{key}</b>
                                          </th>
                                          <td>
                                              <b>{value}</b>
                                          </td>
                                      </tr>
                                  )
                              ))}
                              <tr className="thick-end"></tr>
                            </tbody>
                          </table>
                        </section>
                      </div>
                    </AccordionDetails>
                  </Accordion>
              </div>
            </div>
          </div>
          : 
          <div className="productItemDivider"/>
          }
          <div className="productItemFooter mt-4" ref={reviewsRef}>
            <div className="productItemRate row">
              <div className="productItemRateLeft col-12 col-md-6">
                <h5>{productRating}</h5>              
                <span>
                  <StarsReview rating={productRating} hoverRate={0} />
                </span>
                <h6>{totalAmountOfReviews} REVIEWS</h6>
              </div>   
              <div className="productItemRateRight col-12 col-md-6 mt-4 mt-md-0" ref={commentsRefPagination}>
                {Object.entries(votes).sort((a, b) => Number(b[0]) - Number(a[0])).map(([star, count]) => (
                  <div className="starsList" key={star}>
                    <span className="mt-1 me-1">{star}</span>
                    <div className="me-2">
                      {[...Array(5)].map((_, i) => i < Number(star) ? 
                        <StarIcon className="star" key={i}/> : 
                        <StarBorderIcon className="star" key={i}/>
                      )}
                    </div>
                    <div className="rateBar mt-1">
                      <div className="rateBarValue" style={{width: `${(Number(count) / totalVotes) * 100}%`}}/>         
                    </div>
                    <span className="ms-2 mt-1 totalRated">
                      ({Number(count)})
                    </span>
                  </div>
                ))}
              </div>  
            </div>
            <div className="addReviewProductItem mt-5">
              <button onClick={handleReviewClick}>
                <span>
                  <i className="fa-solid fa-comment-medical ms"/>
                </span>
                <span>
                  Leave A Review
                </span>
              </button>
            </div>
            <div className={`addReviewSection ${permissionReview && "showAddReviewSection"} mt-5`}>
              <div className="addReviewForm">
                <div className="starSelection">
                  <div className="d-flex ms-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        onMouseEnter={() => setHoverRate(i / 2 + 0.5)}
                        onMouseLeave={() => setHoverRate(0)}
                        onClick={() => setStarInput(i / 2 + 0.5)}
                        className='starHalf border-0 bg-transparent'
                        key={i}
                      />
                    ))}
                  </div>
                  <StarsReview rating={starInput} hoverRate={hoverRate}/>
                </div>
                <textarea placeholder="Add a comment" value={commentText} onChange={(e) => setCommentText(e.target.value)}/>
                <button onClick={handleReviewSubmit}>Submit</button> 
              </div>
            </div>
            <div className="productReviews mt-4 mb-5">
              <div className="totalReviews mb-4" ref={commentsRef}>
                <h3>Comments</h3>
                <span>({totalAmountOfComments})</span>
              </div>
             {
              isLoadingReviews ? 
              <Skeleton variant="rectangular" height={500} animation="wave"/>
              :
              <div className="productItem-reviews">
                {reviews.length > 0 ? 
                reviews.map((item, index) => {
                  const today = new Date();
                  const productDate = new Date(item.reviewDate);

                  const differenceInTime = today.getTime() - productDate.getTime();
                  const differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));
                  
                  if (item.reviewDescription !== "") {
                    return (
                      <div className="productItem-reviews-item" key={index}> 
                        <div className="productItem-reviews-item-header d-flex align-items-center gap-3">
                          <div className="productItem-reviews-avatar">
                            {item.userName.charAt(0)}
                          </div>
                          <div className="productItem-reviews-info">
                            <span>{item.userName}</span>
                            {differenceInDays == 0 ? 
                            <span>Today</span>
                            :
                            <span>{differenceInDays} {differenceInDays > 1 ? "days ago" : "day ago"}</span>
                            }
                          </div>
                        </div>
                        <div className="productItem-reviews-item-stars mt-2">
                          <StarsReview rating={item.rating} hoverRate={0} />
                        </div>
                        <div className="productItem-reviews-item-content ms-1 mt-2">
                          {item.reviewDescription}
                        </div>
                      </div>
                    );
                  }
                })
                :
                <div className="d-flex justify-content-center">
                  <span className="noComments">There are no comments for this product yet.</span>
                </div>
                }
              </div>
             }
            </div>
            <div className="product-item-pagination">
              <Pagination count={totalPages} color="primary" onChange={handlePageChange}/>
            </div>
          </div>
        </div>
      </div>
  )
}
