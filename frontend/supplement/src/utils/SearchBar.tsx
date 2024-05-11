import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import { SearchResultList } from './SearchResultList';
import { ProductState } from '../types/productType';
import '../style/utils/SearchBar.css'
import { overflowHidden, overflowShow } from './handleOverflow';
import { useLazyGetProductsByInputQuery } from '../redux/product/productApiSlice';

export const SearchBar = ({setOpenSearchModal} : {setOpenSearchModal?: (e: boolean) => void}) => {

  const [input, setInput] = useState("");
  const [result, setResult] = useState<ProductState[] | null>(null);

  const [getProductsByInputQuery] = useLazyGetProductsByInputQuery();

  useEffect(() => {
    if(input){
      overflowHidden();
      const fetchData = async () => {
        try{
          const data = await getProductsByInputQuery(input).unwrap();
          setResult(data);
        }catch(err: any){
          console.log(err);
        }
      }
      fetchData();
    }else{
      overflowShow();
    }
  }, [input])

  useEffect(() => {
    if(input == ""){
      setResult(null);
    }
  }, [input])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <>
    <div className='d-flex desktopSearch'>
      <form className="form-inline d-flex">
          <input className="form-control src" type="search" placeholder="Search" aria-label="Search" value={input} onChange={handleInputChange}/>
          <button className="search" type="submit" disabled><SearchIcon className="badges"/></button>
      </form>
      {result != null && <SearchResultList products={result} setInput={setInput} setOpenSearchModal={setOpenSearchModal}/>}
    </div>
    {input != "" && <div className='off-canvas-search'/>}
    </>
  )
}
