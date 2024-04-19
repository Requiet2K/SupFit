import './App.css'
import { Footer } from './components/NavbarAndFooter/Footer'
import HomePage from './components/MainPages/HomePage'
import {LoginPage} from './components/LoginPage/LoginPage'
import { Navbar } from './components/NavbarAndFooter/Navbar'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { RequireAuth, RequireNonAuth } from './redux/auth/RequireAccess'
import { Dashboard } from './components/Account/layout/Account/Dashboard'
import { Information } from './components/Account/layout/Account/Information'
import { Security } from './components/Account/layout/Account/Security'
import { CurrentOrder } from './components/Account/layout/CurrentOrder'
import { PastOrder } from './components/Account/layout/PastOrder'
import { Favorites } from './components/Account/layout/Favorites'
import { Box } from './components/Account/layout/Box'
import { Addresses } from './components/Account/layout/Addresses'
import { Comments } from './components/Account/layout/Comments'
import { Faqs } from './components/Account/layout/Faqs'
import { useEffect, useState } from 'react'
import { ProductPage } from './components/MainPages/ProductPage'
import { ProductState } from './types/productType'
import { ProductItem } from './components/MainPages/ProductItem'
import { useLazyFindProductByPathNameQuery, useLazyGetAllProductsNameQuery } from './redux/product/productApiSlice'

function App() {

    const [showContactModal, setShowContactModal] = useState(false);

    const handleContactModal = () => {
      setShowContactModal(true);
    }

    const handleCloseContactModal = () => {
      setShowContactModal(false);
    }

    const [category, setCategory] = useState("");

    const handleCategoryChange = (newCategory: string) => {
      setCategory(newCategory);
    };

    const location = useLocation();

    const [productPaths, setProductPaths] = useState<string[] | null>(null);

    const [getAllProductsNameQuery] = useLazyGetAllProductsNameQuery();

    const getProductPath = async () => {
      try{
        let productPathsData: string[] = await getAllProductsNameQuery({}).unwrap();
        productPathsData = productPathsData.map(path => {
          return path.toLowerCase().replace(" ","-");
        });
        setProductPaths(productPathsData);
      }catch(err: any){
        console.log(err);
      }
    }

    const [getProductByPathNameQuery] = useLazyFindProductByPathNameQuery();

    const findProductByPathName = async (pathName: string) => {
      try{
        const dataProduct: ProductState = await getProductByPathNameQuery(pathName).unwrap();
        setSelectedProduct(dataProduct);
      }catch(err: any){
        console.log(err);
      }
    }

    useEffect(() => {
      if(productPaths == null){
        getProductPath();
      }
    }, []);

    const [selectedProduct, setSelectedProduct] = useState<ProductState>();

    const navigate = useNavigate();

    useEffect(() => {
      if(selectedProduct){
        navigate(`/${handleSelectedProductPath(selectedProduct)}`);
      }
    }, [selectedProduct])

    const handleSelectedProduct = (product: ProductState) => {
      setSelectedProduct(product);
    }

    const handleSelectedProductPath = (product: ProductState) => {
      const path = product.name.toLowerCase().replace(" ","-");
      return path;
    }

    
    useEffect(() => {
      
      window.scrollTo(0, 0);

      const parametre = location.pathname.substring(1); 
      
      if(['protein', 'nutrition', 'snack', 'vitamin', 'accessory', 'all', 'packets', 'onsale'].includes(parametre)){
        setCategory(parametre);
      }else if(productPaths && productPaths?.includes(parametre)){
        findProductByPathName(parametre);
      }

    }, [location.pathname, productPaths]);

    return (
        <div className='d-flex flex-column min-vh-100'>
          <Navbar category={category} onCategoryChange={handleCategoryChange}/>
          <div className='flex-grow-1 contentItems'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/home' element={<HomePage />} />
            <Route path={`/${category}`} element={<ProductPage category={category} selectedProduct={handleSelectedProduct}/>} />
            {selectedProduct && <Route path={`/${handleSelectedProductPath(selectedProduct)}`} element={<ProductItem product={selectedProduct}/>} />}
            <Route element={<RequireNonAuth />}>
              <Route path='/login' element={<LoginPage />} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route path="/account" element={<Dashboard />} />
              <Route path="/order" element={<CurrentOrder />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/information" element={<Information />} />
              <Route path="/security" element={<Security />} />
              <Route path="/current-orders" element={<CurrentOrder />} />
              <Route path="/past-orders" element={<PastOrder />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/box" element={<Box />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/comments" element={<Comments />} />
              <Route path="/faqs" element={<Faqs handleContactModal={handleContactModal}/>} />
            </Route>
          </Routes>
          </div>
          <Footer handleContactModal={showContactModal} handleCloseContactModal={handleCloseContactModal}/>
        </div>
    )
  }

  export default App
