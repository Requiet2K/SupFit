import { createContext, useState, ReactNode, useEffect } from 'react';
import { CartItem } from '../types/cartType';
import { showErrorModal, showSuccessModal } from '../components/swalInfo/swalInfo';
import { useLazyFindCouponQuery } from '../redux/cart/couponApiSlice';
import { ProductState } from '../types/productType';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeAllFromCart, removeFromCart, removeItemFromCart, updateQuantityInCart } from '../redux/cart/cartSlice';
import { useLazyGetItemsQuery, useUpdateCartMutation } from '../redux/cart/cartApiSlice';
import { selectCurrentUser } from '../redux/auth/authSlice';

type CartContextType = {
  boxProducts: CartItem[];
  getBoxItems: () => void;
  updateBoxProducts: (items: CartItem[]) => void;
  total: string;
  applyCoupon: (code: string) => void;
  discount: number;
  showCouponMessage: (code: string) => void;
  boxDrawer: boolean;
  setBoxDrawer: (value: boolean) => void;
  handleRemoveAllFromCart: () => void;
  handleAddToCart: (product: ProductState, quantity: number) => void;
  handleRemoveFromCart: (productId: number, quantity: number) => void;
  handleRemoveItemFromCart: (productId: number) => void;
  handleUpdateQuantityInCart: (productId: number, quantity: number) => void;
  loadingBoxItems: boolean;
};

export const CartContext = createContext<CartContextType>({
  boxProducts: [],
  getBoxItems: () => {},
  updateBoxProducts: () => {},
  total: "0",
  applyCoupon: () => {},
  discount: 0,
  showCouponMessage:() => {},
  boxDrawer: false,
  setBoxDrawer: () => {},
  handleRemoveAllFromCart: () => {},
  handleAddToCart: ()  => {},
  handleRemoveFromCart: ()  => {},
  handleRemoveItemFromCart: () => {},
  handleUpdateQuantityInCart: () => {},
  loadingBoxItems: false,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {

  const [boxProducts, setBoxProducts] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [boxDrawer, setBoxDrawer] = useState(false);

  const [updateCartMutation, {isLoading}] = useUpdateCartMutation();
  const [getItems] = useLazyGetItemsQuery();
  const user = useSelector(selectCurrentUser);

  const [loadingBoxItems, setLoadingBoxItems] = useState(false);

  useEffect(() => {
    if(isLoading) setLoadingBoxItems(true);
    else setLoadingBoxItems(false);
  }, [isLoading])

  const updateUserCart = async () => {
    if (user) {
      try {
        const response = await getItems(user.id).unwrap();
        const cartData = JSON.parse(JSON.stringify(response));
        setBoxProducts(cartData);
        await updateCartMutation({
          userId: user.id,
          cartItems: boxProducts,
        }).unwrap();
        getBoxItems();
      } catch (err) {
        console.log(err);
      }
    }
  };
  
  const shippingFee = 12.99;

  const dispatch = useDispatch();

  const getBoxItems = () => {
    const cartData = localStorage.getItem("cart");
    const discountCode = localStorage.getItem('discountCode');
    if(cartData){
      const parsedData = JSON.parse(cartData);
      setBoxProducts(parsedData);
    }
    if(discountCode){
        applyCoupon(discountCode);
    }
  }
  
  const handleAddToCart = (product: ProductState, quantity: number) => {
    dispatch(addToCart({ product, quantity }));
    updateUserCart();
  }

  const handleRemoveFromCart = (productId: number, quantity: number) => {
    dispatch(removeFromCart({ productId, quantity }));
    updateUserCart();
  }

  const handleRemoveAllFromCart = () => {
    setBoxProducts([]);
    dispatch(removeAllFromCart());
  }

  const handleRemoveItemFromCart = (productId: number) => {
    dispatch(removeItemFromCart({productId}));
  }

  const handleUpdateQuantityInCart = (productId: number, quantity: number) => {
    dispatch(updateQuantityInCart({ productId, quantity }));
  }

  const updateBoxProducts = (items: CartItem[]) => {
    setBoxProducts(items);
  }

  const handleCalculateTotal = () => {
    let total = 0; 
    if(boxProducts){
      boxProducts.forEach((item) => {
        total += item.quantity * item.product.price;
      })
    }
    if(total < 50){
        total -= total * (discount/100);
        return (total + shippingFee).toFixed(2);
    } 
    else{
        total -= total * (discount/100);
        return total.toFixed(2);
    } 
  }

  const [findCoupon] = useLazyFindCouponQuery();

  const applyCoupon = async (code: string) => {
    if(code != ""){
        try{
            const discountValue = await findCoupon(code).unwrap();
            if(discountValue != 0){
                setDiscount(discountValue);
                localStorage.setItem('discountCode', code);
            }else{
                setDiscount(0);
                localStorage.removeItem('discountCode');
            }
          }catch(err: any){
            console.log(err);
          }
    }else{
        setDiscount(0);
        localStorage.removeItem('discountCode');
    }
  }

  const showCouponMessage = async (code: string) => {
    if(code != ""){
        try{
            const discountValue = await findCoupon(code).unwrap();
            if(discountValue != 0){
                showSuccessModal("Success!",`%${discountValue} discount was applied by using the promotional code.`);
            }else{
                if(code != ""){
                showErrorModal("Invalid code!", "The promotion code is invalid!");
                }
            }
        }catch(err: any){
            console.log(err);
        }
    }
  }

  return (
    <CartContext.Provider value={{ boxProducts, getBoxItems, updateBoxProducts, 
    total: handleCalculateTotal(), applyCoupon, discount, showCouponMessage,
    boxDrawer, setBoxDrawer, handleRemoveAllFromCart ,handleAddToCart, 
    handleRemoveFromCart, handleRemoveItemFromCart, handleUpdateQuantityInCart, loadingBoxItems}}>
      {children}
    </CartContext.Provider>
  );
};
