import { ProductState } from "../../types/productType"
import '../../style/MainPages/ProductItem.css';
import { BreadCrumb } from "../Account/BreadCrumb";
import { ImageComponent } from "../../utils/imageComponent";
import { useContext, useEffect, useState } from "react";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, updateUser } from "../../redux/auth/authSlice";
import { VariantType, useSnackbar } from 'notistack';
import { useAddFavoriteProductMutation, useLazyGetUserQuery, useRemoveFavoriteProductMutation } from "../../redux/user/userApiSlice";
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { addToCart } from "../../redux/cart/cartSlice";
import { CartContext } from "../../context/CartContext";

export const ProductItem = ({product, productPath
} : {product : ProductState, productPath: string}) => {

  const user = useSelector(selectCurrentUser);

  const { enqueueSnackbar } = useSnackbar();

  const handleClickVariant = (msg: string ,variant: VariantType) => () => {
    enqueueSnackbar(msg, { variant });
  };

  const [selectedFlavour, setSelectedFlavour] = useState(Object.entries(product.flavours)[0][0]);
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

  const { getBoxItems } = useContext(CartContext);
  
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
          dispatch(addToCart({ product, quantity: productCount }));
        }
        else{
          msg = (product.quantity - quantity) > 1 ? "pieces" : "piece";
          handleClickVariant(`${product.quantity - quantity} ${msg} ${product.name} added into your box!`,'success')();
          dispatch(addToCart({ product, quantity: product.quantity - quantity }));
        }
      }
    }else{
        dispatch(addToCart({ product, quantity: productCount }));
        let msg = productCount > 1 ? "pieces" : "piece";
        handleClickVariant(`${productCount} ${msg} ${product.name} added into your box!`,'success')();
    }
    getBoxItems();
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
                <div className="productItemStars">
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star" />
                  <span className="ms-2 productItemStarsRate">4.6</span>
                  <span className="ms-1 productItemStarsRateCount">(73)</span>
                </div>
                <div className="productItemComments">
                  <i className="fa-regular fa-comment"/>
                  <span className="ms-1">17 Comments</span>
                </div>
              </div>
              <div className="productItemDivider mt-2"/>
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
              <div className="productItemInfo mt-4">
                <div className="productItemInfoContainer">
                  <div className="productItemDash">
                    <span>{product.weight}G</span>
                    <span className="text-center">{product.servingAmount} servings</span>
                  </div>
                </div>
                <div className="productItemInfoContainer">
                  <div className="productItemDash">
                    <span className="productItemPerServing">{(product.price/product.servingAmount).toLocaleString()}$</span>
                    <span className="text-center">per serving</span>
                  </div>
                </div>
                <div className="productItemInfoContainer">
                  <div className="productItemDash">
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
                  <button className="gap-3" onClick={handleAddCart}>
                    <AddShoppingCartIcon className="fs-2"/>
                    <span>Add to Cart</span> 
                  </button>
                </div>
              </div>
            </div>
          </div>
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
          <div className="productItemFooter mt-4">
            <div className="productItemRate row">
              <div className="productItemRateLeft col-12 col-md-6">
                <h5>4.6</h5>              
                <span>
                  <StarIcon className="star"/>
                  <StarIcon className="star"/>
                  <StarIcon className="star"/>
                  <StarIcon className="star"/>
                  <StarIcon className="star"/>
                </span>
                <h6>17 COMMENTS</h6>
              </div>   
              <div className="productItemRateRight col-12 col-md-6 mt-4 mt-md-0">
                  <div className="starsList">
                    <span className="mt-1 me-1">5</span>
                    <div className="me-2">
                      <StarIcon className="star"/>
                      <StarIcon className="star"/>
                      <StarIcon className="star"/>
                      <StarIcon className="star"/>
                      <StarIcon className="star"/>
                    </div>
                    <div className="rateBar mt-1">
                     <div className="rateBarValue" style={{width: "70%"}}/>         
                    </div>
                    <span className="ms-2 mt-1 totalRated">
                      (26)
                    </span>
                  </div>
                  <div className="starsList">
                    <span className="mt-1 me-1">4</span>
                    <div className="me-2">
                      <StarIcon className="star"/>
                      <StarIcon className="star"/>
                      <StarIcon className="star"/>
                      <StarIcon className="star"/>
                      <StarBorderIcon className="star"/>
                    </div>
                    <div className="rateBar mt-1">
                     <div className="rateBarValue" style={{width: "20%"}}/>         
                    </div>
                    <span className="ms-2 mt-1 totalRated">
                      (26)
                    </span>
                  </div>
                  <div className="starsList">
                    <span className="mt-1 me-1">3</span>
                    <div className="me-2">
                      <StarIcon className="star"/>
                      <StarIcon className="star"/>
                      <StarIcon className="star"/>
                      <StarBorderIcon className="star"/>
                      <StarBorderIcon className="star"/>
                    </div>
                    <div className="rateBar mt-1">
                     <div className="rateBarValue" style={{width: "5%"}}/>         
                    </div>
                    <span className="ms-2 mt-1 totalRated">
                      (26)
                    </span>
                  </div>        
                  <div className="starsList">
                    <span className="mt-1 me-1">2</span>
                    <div className="me-2">
                      <StarIcon className="star"/>
                      <StarIcon className="star"/>
                      <StarBorderIcon className="star"/>
                      <StarBorderIcon className="star"/>
                      <StarBorderIcon className="star"/>
                    </div>
                    <div className="rateBar mt-1">
                     <div className="rateBarValue" style={{width: "3%"}}/>         
                    </div>
                    <span className="ms-2 mt-1 totalRated">
                      (26)
                    </span>
                  </div>   
                  <div className="starsList">
                    <span className="mt-1 me-1">1</span>
                    <div className="me-2">
                      <StarIcon className="star"/>
                      <StarBorderIcon className="star"/>
                      <StarBorderIcon className="star"/>
                      <StarBorderIcon className="star"/>
                      <StarBorderIcon className="star"/>
                    </div>
                    <div className="rateBar mt-1">
                     <div className="rateBarValue" style={{width: "2%"}}/>         
                    </div>
                    <span className="ms-2 mt-1 totalRated">
                      (26)
                    </span>
                  </div>       
              </div>               
            </div>
          </div>
        </div>
      </div>
  )
}
