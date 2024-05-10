import { useEffect, useState } from 'react';
import '../../style/MainPages/ProductPage.css';
import { useLazyFindCategoryIdByNameQuery } from '../../redux/product/categoryApiSlice';
import { ProductState } from '../../types/productType';
import { useLazyGetProductsByCategoryQuery } from '../../redux/product/productApiSlice';
import { Skeleton } from '@mui/material';
import { ImageComponent } from '../../utils/imageComponent';
import { useLazyGetProductRatingQuery, useLazyGetProductReviewsQuery } from '../../redux/review/reviewApiSlice';
import { StarsReview } from '../../utils/starsReview';

export const ProductPage = ({category, selectedProduct} : {category: string, selectedProduct: (e: ProductState) => void}) => {

    const [products, setProducts] = useState<ProductState[]>();
    const [loading, setLoading] = useState(true);
    const [productDetails, setProductDetails] = useState<Record<number, {rating: number, reviewCount: number}>>({});

    function handleProductTitle(categoryName: string){
        if(categoryName == "all") return "ALL PRODUCTS";
        if(categoryName == "onsale") return "ON SALE";
        return categoryName.toUpperCase();
    }

    const [getCategoryIdQuery] = useLazyFindCategoryIdByNameQuery();
    const [getProductsQuery] = useLazyGetProductsByCategoryQuery();
    const [getProductReviewsQuery] = useLazyGetProductReviewsQuery();
    const [getProductRatingQuery] = useLazyGetProductRatingQuery();

    useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const categoryNum = await getCategoryIdQuery(category).unwrap();
        if (categoryNum !== 0) {
          const allProducts: ProductState[] = await getProductsQuery(categoryNum).unwrap();
          setProducts(allProducts);

          const details: { [key: number]: { rating: number, reviewCount: number } } = {};
          for (const product of allProducts) {
            const reviews: any = await getProductReviewsQuery({
              productId: product.id,
              page: 0,
              size: 5
            });
            const rating = await getProductRatingQuery(product.id).unwrap();
            details[product.id] = { rating, reviewCount: reviews.data.totalElements };
          }
          setProductDetails(details);
        }
      } catch (err: any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);
  

  const handleClickedProduct = (product: ProductState) => {
    selectedProduct(product);
  }

  return (
    <div className="productPage">
      {loading ?
        <Skeleton animation="wave" variant="rectangular" className='productSkeleton'/> 
        :
        <div className="container">
          <div className="productPageHeader">
              <h1>{handleProductTitle(category)}</h1>
          </div>
          <div className="productPageContent row mb-5">
            {products?.map((product, index) => {

              return (
                <div className="productPageContentItems col-6 col-md-4 col-lg-3" key={index} onClick={() => handleClickedProduct(product)}>
                  <div className="productItem">
                    <div className="productImg mb-3">
                      <ImageComponent src={product.imageUrl} alt={product.name} blurhashImg={product.blurhashImg}/>
                    </div>
                    <div className="productName mb-1">
                      {product.name.toUpperCase()}
                    </div>
                    <div className="productTitle mb-2 w-75">
                      {product.title.toUpperCase()}
                    </div>
                    <div className="productStars mb-1">
                      <StarsReview rating={productDetails[product.id]?.rating} hoverRate={0} />
                    </div>
                    <div className="productComments mb-2">
                      {productDetails[product.id]?.reviewCount} Comments
                    </div>
                    <div className="productPrice">
                      {product.price} USD
                    </div>
                  </div>
                </div>
              )})
            }
          </div>
          <div className="productPageFooter d-flex justify-content-center align-items-center">
            <span>
              Total {products?.length} products are being displayed
            </span>
          </div>
        </div>
      }
    </div>
  )
}