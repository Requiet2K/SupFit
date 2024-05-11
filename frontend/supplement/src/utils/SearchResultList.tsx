import { useNavigate } from 'react-router-dom'
import '../style/utils/SearchBar.css'
import { ProductState } from '../types/productType'
import { ImageComponent } from './imageComponent'

export const SearchResultList = ({products, setInput, setOpenSearchModal} : {products: ProductState[],  setInput: (e: string) => void, setOpenSearchModal?: (e: boolean) => void}) => {

    const navigate = useNavigate();

    const handleProductClick = (itemName: string) => {
        navigate(`/${itemName.toLowerCase().replace(" ","-")}`);
        setInput("");
        if(setOpenSearchModal){
            setOpenSearchModal(false);
        }
    }

  return (
    <div className='searchResults'>
        {products.length == 0 ? 
        <div className='d-flex w-100 justify-content-center fs-3 p-2 align-items-center gap-2'>
            <i className="fa-regular fa-face-frown" style={{color: "#181b61"}}/>
            <span style={{color: "#181b61"}}>Not found..</span>
        </div>
        :   
        products.map((item, index) => (
            <div className='search-result-item' key={index} onClick={() => handleProductClick(item.name)}>
                <ImageComponent src={item.imageUrl} alt={item.name} blurhashImg={item.blurhashImg} />
                <div className="search-result-info">
                    <div className="search-result-info-header">
                        <span>{item.name.toUpperCase()}</span>
                        <span>${item.price}</span>
                    </div>
                    <div className="search-result-info-footer">
                        <span>{item.title}</span>
                    </div>
                </div>
            </div>
            ))    
        }
    </div>
  )
}
