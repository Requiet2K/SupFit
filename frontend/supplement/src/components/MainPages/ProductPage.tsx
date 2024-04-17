import { useState } from 'react';
import '../../style/MainPages/ProductPage.css';

export const ProductPage = ({category} : {category: string}) => {

    const [categoryId, setCategoryId] = useState(0);

    function handleProductTitle(categoryName: string){
        if(categoryName == "all") return "ALL PRODUCTS";
        if(categoryName == "onsale") return "ON SALE";
        return categoryName.toUpperCase();
    }

    

  return (
    <div className="productPage">
        <div className="productPageHeader">
            <h1>{handleProductTitle(category)}</h1>
        </div>
    </div>
  )
}