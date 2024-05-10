import { createContext, useState, ReactNode, useEffect } from 'react';
import { CartItem } from '../types/cartType';
import { showErrorModal, showSuccessModal } from '../components/swalInfo/swalInfo';
import { useLazyFindCouponQuery } from '../redux/cart/couponApiSlice';
import { ProductState } from '../types/productType';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeAllFromCart, removeFromCart, removeItemFromCart, updateQuantityInCart } from '../redux/cart/cartSlice';
import { useAddToCartMutation, useClearCartMutation, useDecreaseCartItemMutation, useHandleUpdateQuantityMutation, useIncreaseCartItemMutation, useLazyGetItemsQuery, useRemoveFromCartMutation } from '../redux/cart/cartApiSlice';
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
  handleIncreaseFromCart: (product: ProductState, quantity: number) => void;
  handleRemoveFromCart: (product: ProductState, quantity: number) => void;
  handleRemoveItemFromCart: (product: ProductState) => void;
  handleUpdateQuantityInCart: (product: ProductState, quantity: number) => void;
  handleLogoutBox: () => void;
  addToCartLoading: boolean;
  takeUserCartItems: (product: ProductState, quantity: number) => void;
  saveBeforeLoginCartItems: (product: ProductState, quantity: number) => void;
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
  handleIncreaseFromCart: () => {},
  handleRemoveFromCart: ()  => {},
  handleRemoveItemFromCart: () => {},
  handleUpdateQuantityInCart: () => {},
  handleLogoutBox: () => {},
  addToCartLoading: false,
  takeUserCartItems: () => {},
  saveBeforeLoginCartItems: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {

  const [boxProducts, setBoxProducts] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [boxDrawer, setBoxDrawer] = useState(false);
  const [getUserItems] = useLazyGetItemsQuery();
  const user = useSelector(selectCurrentUser);

  const [addToCartMutation, {isLoading: addToCartLoading}] = useAddToCartMutation();
  const [increaseCartItemMutation] = useIncreaseCartItemMutation();
  const [decreaseCartItemMutation] = useDecreaseCartItemMutation();
  const [clearCartMutation] = useClearCartMutation();
  const [removeFromCartMutation] = useRemoveFromCartMutation();
  const [handleUpdateQuantity] = useHandleUpdateQuantityMutation();

  useEffect(() => {
    getItemsQuery();
  }, [boxDrawer])

  const getItemsQuery = async () => {
    if (user) {
      try {
        const response = await getUserItems(user.id).unwrap();
        const cartData = JSON.parse(JSON.stringify(response));
        setBoxProducts(cartData);
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
  
  const handleAddToCart = async (product: ProductState, quantity: number) => {
    dispatch(addToCart({ product, quantity }));
    if(user){
      await addToCartMutation({userId: user.id, product, quantity});
    }
  }

  const takeUserCartItems = async (product: ProductState, quantity: number) => {
    dispatch(addToCart({ product, quantity }));
  }

  const saveBeforeLoginCartItems = async (product: ProductState, quantity: number) => {
    if(user){
      await addToCartMutation({userId: user.id, product, quantity});
    }
  }

  const handleIncreaseFromCart = async (product: ProductState, quantity: number) => {
    dispatch(addToCart({ product, quantity }));
    if(user){
      await increaseCartItemMutation({userId: user.id, product, quantity});
    }
  }

  const handleRemoveFromCart = async (product: ProductState, quantity: number) => {
    dispatch(removeFromCart({ product, quantity }));
    if(user){
      await decreaseCartItemMutation({userId: user.id, product, quantity});
    }
  }

  const handleRemoveAllFromCart = async () => {
    setBoxProducts([]);
    dispatch(removeAllFromCart());
    if(user){
      await clearCartMutation({userId: user.id});
    }
  }

  const handleRemoveItemFromCart = async (product: ProductState) => {
    dispatch(removeItemFromCart({product}));
    if(user){
      await removeFromCartMutation({userId: user.id, product});
    }
  }

  const handleUpdateQuantityInCart = async (product: ProductState, quantity: number) => {
    dispatch(updateQuantityInCart({ product, quantity }));
    console.log(quantity);
    if(user){
      await handleUpdateQuantity({userId: user.id, product, quantity});
    }
  }

  const updateBoxProducts = (items: CartItem[]) => {
    setBoxProducts(items);
  }

  const handleLogoutBox = () => {
    setBoxProducts([]),
    dispatch(removeAllFromCart());
    setDiscount(0);
    localStorage.removeItem('discountCode');
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
    handleRemoveFromCart, handleIncreaseFromCart, handleRemoveItemFromCart, 
    handleUpdateQuantityInCart,  handleLogoutBox, addToCartLoading, takeUserCartItems, saveBeforeLoginCartItems}}>
      {children}
    </CartContext.Provider>
  );
};
