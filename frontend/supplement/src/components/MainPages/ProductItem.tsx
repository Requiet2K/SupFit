import { ProductState } from "../../types/productType"
import '../../style/MainPages/ProductItem.css';
import { BreadCrumb } from "../Account/BreadCrumb";
import { ImageComponent } from "../../utils/imageComponent";
import { useEffect, useState } from "react";

export const ProductItem = ({product, productPath
} : {product : ProductState, productPath: string}) => {

  const [selectedFlavour, setSelectedFlavour] = useState(Object.entries(product.flavours)[0][0]);

  useEffect(() => {
    console.log(product);
    console.log(selectedFlavour);
  }, [])

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
          </div>
        </div>
      </div>
    </div>
  )
}
