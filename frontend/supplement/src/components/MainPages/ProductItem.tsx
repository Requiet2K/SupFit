import { ProductState } from "../../types/productType"

export const ProductItem = ({product} : {product : ProductState}) => {


  return (
    <div className="sa">{product.name}</div>
  )
}
