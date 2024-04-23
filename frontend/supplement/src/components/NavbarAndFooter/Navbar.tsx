import logo from "../../images/logo.png";
import '../../style/NavbarAndFooter/Navbar.css'
import { useEffect, useRef, useState } from "react";
import { Squash as Hamburger } from 'hamburger-react'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { PiUserCircleDuotone } from "react-icons/pi";
import { GiCardboardBoxClosed } from "react-icons/gi";
import { GrFormNext } from "react-icons/gr";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthState } from "../../types/userTypes";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/auth/authSlice";
import { overflowHidden, overflowShow } from "../../utils/handleOverflow";
import { ProductState } from "../../types/productType";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

export const Navbar = ({ category, onCategoryChange }: {category: string, onCategoryChange: (e: string) => void}) => {

  const [sideBar, setSideBar] = useState(false);
  const [rightDrawer, setRightDrawer] = useState(false);
  const [boxDrawer, setBoxDrawer] = useState(false);
  const [numberDrawer, setNumberDrawer] = useState(0);
  const navigate = useNavigate();
  
  const user = useSelector((state: {auth: AuthState}) => state.auth.user);

  const StyledBadge = styled(Badge)<BadgeProps>(() => ({
    '& .MuiBadge-badge': {
      right: 6,
      top: -2,
      border: `1px solid red `,
      padding: '0',
      color: "white",
      backgroundColor: "red",
    },
  }));

  const navbarRef = useRef<HTMLDivElement>(null);
  const [prevScrollpos, setPrevScrollpos] = useState(window.scrollY);
  const [hideNav, setHideNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const currentWidth = window.innerWidth;
      if ((navbarRef.current && currentScrollPos > 125) && currentWidth > 767) {

        if (prevScrollpos > currentScrollPos) {
          setHideNav(false);
        } else {
          setHideNav(true); 
        }

        setPrevScrollpos(currentScrollPos);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollpos]);

  const dispatch = useDispatch();
  
  const handleLogout= async () => {
    navigate("/login");
    dispatch(logout({}));
    setRightDrawer(false);
  }

  const handleDrawerClick = (path: string, itemNo: number) => {
    if(path == "account" || path == "order"){
      setNumberDrawer(itemNo);
    }
    else{
      setRightDrawer(false);
      navigate(`/${path}`);
    }
  }

    useEffect(() => {
      if(rightDrawer == true || sideBar == true || boxDrawer == true){
        overflowHidden(rightDrawer);
        window.scrollTo(0,0);
      }else{
        overflowShow();
      }
    }, [rightDrawer, sideBar, boxDrawer]);

    const [categoryState, setCategoryState] = useState(""); 

    const handleCategoryClick = (newCategory: string) => {
      if(newCategory == "home"){
        setCategoryState(""); 
        onCategoryChange(""); 
      }else{  
        setCategoryState(newCategory); 
        onCategoryChange(newCategory); 
      }
    };

    const [boxProducts, setBoxProducts] = useState<ProductState[] | null>();

    const getBoxItems = () => {
      const cartData = localStorage.getItem("cart");
    
    if(cartData){
        const parsedData = JSON.parse(cartData);
        setBoxProducts(parsedData);
      }
    }

    useEffect(() => {
      getBoxItems();
    }, [boxDrawer]);

  return (
    <div className={`navbar p-0 ${hideNav ? "navbar-hide" : ""}`} ref={navbarRef}>
      <button className={`show-nav ${hideNav ? "show-true" : ""}`} onClick={() => setHideNav(false)}><i className="fa-solid fa-caret-down"/></button>
      {/* Desktop version */}
      <nav className="w-100 p-0 d-none d-md-inline w-100">
        <div className="d-flex flex-column w-100 nav-color nav-desktop">
          <div className="container p-0">
            <div className="d-flex align-items-center w-100 justify-content-between nav-top">
              <NavLink className="navbar-brand p-0 mt-1" to="/home" onClick={() => handleCategoryClick("home")}>
                  <img src={logo} className="logo"/>
              </NavLink>
              <div className="d-flex align-items-center w-50 searchBar">
                <form className="form-inline d-flex w-75">
                  <input className="form-control src" type="search" placeholder="Search" aria-label="Search"/>
                  <button className="search" type="submit"><SearchIcon className="badges"/></button>
                </form>
              </div>
              <div className="nav-right d-flex align-items-center gap-3">
                  {user ? 
                  <div className="account" 
                    onClick={() => setRightDrawer(true)}>
                    <button className="myAcc" >
                     <div className="userLogged">
                        <div className="userLogged-left d-flex gap-1 align-items-center">
                          <i className="bi bi-person-circle d-flex text-align-center"/> 
                          <span>{user.firstName + " " + user.lastName}</span>
                        </div>
                        <i className="bi bi-caret-down-fill" style={{fontSize: "10px"}}/>
                      </div>
                    </button>
                  </div>
                  : 
                  <>
                    <div className="d-none d-lg-inline">
                      <NavLink to="/login">
                        <button type="button" className="login">Sign In</button>
                      </NavLink>
                      <NavLink to="/login" state={{ signBoolean: true }}>
                        <button type="button" className="signup">Sign Up</button>
                      </NavLink>
                    </div>
                    <div className="d-lg-none">
                      <NavLink to="/login" state={{ signBoolean: false }}>
                        <button type="button" className="signin">Log In</button>
                      </NavLink>
                    </div>
                  </>}  
              </div>
            </div>
          </div>
          <div className="navMiddle">
            <div className="container">
              <div className="row">
                <div className="col-10 buttons-bar-left">
                    <Link to="/protein" className={`buttons ${categoryState == 'protein' && "buttons-active"}`} onClick={() => handleCategoryClick("protein")}>
                      PROTEIN
                    </Link>
                    <Link to="/nutrition" className={`buttons ${categoryState == 'nutrition' && "buttons-active"}`} onClick={() => handleCategoryClick("nutrition")}>NUTRITION</Link>
                    <Link to="/snack" className={`buttons ${categoryState == 'snack' && "buttons-active"}`} onClick={() => handleCategoryClick("snack")}>SNACK</Link>
                    <Link to="/vitamin" className={`buttons ${categoryState == 'vitamin' && "buttons-active"}`} onClick={() => handleCategoryClick("vitamin")}>VITAMIN</Link>
                    <Link to="/accessory" className={`buttons ${categoryState == 'accessory' && "buttons-active"}`} onClick={() => handleCategoryClick("accessory")}>ACCESSORY</Link>
                    <Link to="/all" className={`buttons ${categoryState == 'all' && "buttons-active"}`} onClick={() => handleCategoryClick("all")}>ALL PRODUCTS</Link>
                    <Link to="/packets" className={`buttons packets ${categoryState == 'packets' && "buttons-active"}`} onClick={() => handleCategoryClick("packets")}>PACKETS</Link>
                    <Link to="/onsale" className={`buttons onsale ${categoryState == 'onsale' && "buttons-active"}`} onClick={() => handleCategoryClick("onsale")}>ON SALE</Link>
                </div>
                <div className="col-2 col-md-2 buttons-bar-right">
                  <button className="shop" onClick={() => setBoxDrawer(true)}>
                    <StyledBadge badgeContent={0} showZero className="badges amountBox" />
                    <ShoppingCartIcon className="shoppingCart"/>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="navBottom">
            <div className="container">
              <div className="row d-flex">
                <div className="col-4 navInfo">
                  <img className="mr-1 overflow-hidden me-1" width="16" height="16" src="https://cdn.myikas.com/images/theme-images/3df84b2b-f6d4-4bca-b7d0-6078197d2cff/image_180.webp"/>
                  <strong>SAME DAY SHIPPING</strong>
                  <span>&nbsp;- 4:00 PM BEFORE ORDERS</span>
                </div>
                <div className="col-4 navInfo">
                  <img className="mr-1 overflow-hidden me-1" width="16" height="16" src="https://cdn.myikas.com/images/theme-images/afbc751e-179d-4e69-b2bc-c9eebb97a2af/image_180.webp"/>
                  <strong>FREE SHIPPING</strong>
                  <span>&nbsp;- 50 USD AND ABOVE ORDERS</span>
                </div>
                <div className="col-4 navInfo">
                  <img className="mr-1 overflow-hidden me-1" width="16" height="16" src="https://cdn.myikas.com/images/theme-images/027c72b8-a0ed-470e-ba40-4f1c06244604/image_180.webp"/>
                  <strong>SAFE SHOPPING</strong>
                  <span>&nbsp;- 750,000+ HAPPY CUSTOMERS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile version */}
      <nav className="navbar p-0 d-inline d-md-none w-100">
        <div className="d-flex nav-desktop align-items-center w-100 justify-content-center flex-column nav-color">
          <div className={`topNav d-flex align-items-center justify-content-between w-100 ${sideBar ? 'navShadow' : ''}`}>
            <Hamburger size={18} toggled={sideBar} toggle={setSideBar} color="#83563b"/>
            <NavLink className="m-0 p-0" to="/home">
              <img src={logo} className="logo"/>
            </NavLink>
            {user ?     
            <button className="d-flex border-0 bg-transparent" onClick={() => {setRightDrawer(true), setSideBar(false)}}>
              <i className="bi bi-person-fill fs-2"></i>
            </button>
            :
            <NavLink to="/login" state={{ signBoolean: false }}>
              <button type="button" className="signin me-3" style={{fontSize: "14px"}}>Log In</button>
            </NavLink>
            }
          </div>
          <div className={`side-bar ${sideBar ? 'd-inline' : ''} d-flex flex-row`}>
            <div className="side-bar-buttons">
              <table className="menu d-flex flex-wrap">
                <tbody className="w-100">
                  <tr className="w-100">
                    <td>
                      <NavLink to="/account" state={{ signBoolean: false }} onClick={() => setSideBar(false)}>
                        <PiUserCircleDuotone className="icons"/>
                        <span className="icon-text">Account</span>
                      </NavLink>
                    </td>
                    <td>
                        <NavLink to="/current-orders" state={{ signBoolean: false }} onClick={() => setSideBar(false)}>
                          <i className="fa-solid fa-truck-fast fa-icons"/>
                          <span className="icon-text">Orders</span>
                        </NavLink>                
                    </td>
                    <td>
                        <NavLink to="/favorites" state={{ signBoolean: false }} onClick={() => setSideBar(false)}>
                          <i className="fa-solid fa-heart fa-icons"/>
                          <span className="icon-text">Favorites</span>
                        </NavLink>
                    </td>
                  </tr>
                  <tr className="w-100">
                    <td>
                        <NavLink to="/box" state={{ signBoolean: false }} onClick={() => {setBoxDrawer(true); setSideBar(false)}}>
                          <GiCardboardBoxClosed className="icons"/>
                          <span className="icon-text">Box</span>
                        </NavLink>
                    </td>
                    <td>
                        <NavLink to="/addresses" state={{ signBoolean: false }} onClick={() => setSideBar(false)}>
                          <i className="fa-solid fa-map-location-dot fa-icons"/>
                          <span className="icon-text">Addresses</span>
                        </NavLink>
                    </td>
                    <td>
                        <NavLink to="/comments" state={{ signBoolean: false }} onClick={() => setSideBar(false)}>
                          <i className="fa-solid fa-comments fa-icons"/>
                          <span className="icon-text">Comments</span>
                        </NavLink>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="categories">
                <div className="menu-categories my-4">Categories</div>
              </div>
              <a href="" className="side-button justify-content-between" onClick={() => {handleCategoryClick("protein"); navigate('/protein')}}>
                <span>Protein</span>
                <GrFormNext />
              </a>
              <a href="" className="side-button justify-content-between" onClick={() => {handleCategoryClick("nutrition"); navigate('/nutrition')}}>
                <span>Nutrition</span>
                <GrFormNext />
              </a> 
              <a href="" className="side-button justify-content-between" onClick={() => {handleCategoryClick("snack"); navigate('/snack')}}>
                <span>Snack</span>
                <GrFormNext />
              </a> 
              <a href="" className="side-button justify-content-between" onClick={() => {handleCategoryClick("vitamin"); navigate('/vitamin')}}>
                <span>Vitamin</span>
                <GrFormNext />
              </a> 
              <a href="" className="side-button justify-content-between" onClick={() => {handleCategoryClick("accessory"); navigate('/accessory')}}>
                <span>Accessory</span>
                <GrFormNext />
              </a> 
              <a href="" className="side-button justify-content-between" onClick={() => {handleCategoryClick("all"); navigate('/all')}}>
                <span>All Products</span>
                <GrFormNext />
              </a> 
              <a href="" className="side-button justify-content-between" onClick={() => {handleCategoryClick("packets"); navigate('/packets')}}>
                <span>Packets</span>
                <GrFormNext />
              </a> 
              <a href="" className="side-button justify-content-between" onClick={() => {handleCategoryClick("onsale"); navigate('/onsale')}}>
                <span>On Sale</span>
                <GrFormNext />
              </a>
            </div>
          </div>
          <form className="d-flex w-100 mb-2 px-2">
            <input className="ourForm mr-sm-2 src w-100" type="search" placeholder="Search" aria-label="Search"/>
            <button className="search" type="submit"><SearchIcon className="badges"/></button>
          </form>
        </div>
      </nav>
      {/* Right Drawer */}
        <div className={`rightDrawer ${rightDrawer ? "d-flex" : "hide"}`}>
          <div className="drawer-right">
            <div className="drawHeader d-flex w-100 justify-content-between">
              <span>{user?.firstName + " " +user?.lastName}</span>
              <button className="drawer-close" onClick={() => setRightDrawer(false)}>
                <i className="fa-solid fa-xmark"/>
              </button>
            </div>
            <div className="drawHeader-divider"/>
            <div className="drawBody">
              <div className="draw-div">
                <div className="draw-item mt-2">
                  <button className="draw-button" onClick={() => handleDrawerClick('account', (numberDrawer == 1 ? 0 : 1))}>
                    <div className="draw-left d-flex gap-2 align-items-center">
                      <i className="fa-solid fa-circle-user align-items-center"/>
                      <span className="draw-text">Account</span>
                    </div>
                    <i className="bi bi-chevron-right align-items-center" style={{
                      transition: "transform 200ms linear",
                      transform: `rotateZ(${numberDrawer == 1 ? "90deg" : 0})`,
                      display: "inline-block",
                    }}/>
                  </button>
                </div>
                <div className={`draw-dropdown ${numberDrawer == 1 ? "show" : ""}`}>
                  <div className="dropElement">
                    <button className="dropdown-button" onClick={() => handleDrawerClick('dashboard', -1)}>
                      <i className="fa-solid fa-newspaper drop-icon"/>
                      <span className="drop-draw-text">Dashboard</span>
                    </button>
                    <button className="dropdown-button" onClick={() => handleDrawerClick('information', -1)}>
                      <i className="fa-solid fa-gears drop-icon"/>
                      <span className="drop-draw-text">Personal Informations</span>
                    </button>
                    <button className="dropdown-button" onClick={() => handleDrawerClick('security', -1)}>
                      <i className="fa-solid fa-shield-halved drop-icon"/>
                      <span className="drop-draw-text">Security</span>
                    </button>
                  </div>
                </div> 
              </div>
              <div className="draw-div">
                <div className="draw-item">
                  <button className="draw-button" onClick={() => handleDrawerClick('order', (numberDrawer == 2 ? 0 : 2))}>
                    <div className="draw-left d-flex gap-2 align-items-center">
                      <i className="fa-solid fa-box align-items-center"/>
                      <span className="draw-text">Orders</span>
                    </div>
                    <i className="bi bi-chevron-right align-items-center" style={{
                      transition: "transform 200ms linear",
                      transform: `rotateZ(${numberDrawer == 2 ? "90deg" : 0})`,
                      display: "inline-block",
                    }}/>
                  </button>
                </div>
                <div className={`draw-dropdown ${numberDrawer == 2 ? "show" : ""}`}>
                  <div className="dropElement">
                    <button className="dropdown-button" onClick={() => handleDrawerClick('current-orders', -1)}>
                      <i className="fa-solid fa-truck-moving drop-icon"/>
                      <span className="drop-draw-text">Current Orders</span>
                    </button>
                    <button className="dropdown-button" onClick={() => handleDrawerClick('past-orders', -1)}>
                      <i className="fa-solid fa-truck-ramp-box drop-icon"/>
                      <span className="drop-draw-text">Past Orders</span>
                    </button>
                  </div>
                </div> 
              </div>
              <div className="draw-div">
                <div className="draw-item">
                  <button className="draw-button"  onClick={() => handleDrawerClick('favorites', -1)}>
                    <div className="draw-left d-flex gap-2 align-items-center">
                      <i className="fa-solid fa-heart align-items-center"/>
                      <span className="draw-text">Favorites</span>
                    </div>
                  </button>
                </div>
              </div>
              <div className="draw-div">
                <div className="draw-item">
                  <button className="draw-button"  onClick={() => handleDrawerClick('addresses', -1)}>
                    <div className="draw-left d-flex gap-2 align-items-center">
                      <i className="fa-solid fa-map-location-dot align-items-center"/>
                      <span className="draw-text">My addresses</span>
                    </div>
                  </button>
                </div>
              </div>
              <div className="draw-div">
                <div className="draw-item">
                  <button className="draw-button"  onClick={() => handleDrawerClick('comments', -1)}>
                    <div className="draw-left d-flex gap-2 align-items-center">
                      <i className="fa-solid fa-comment align-items-center"/>
                      <span className="draw-text">My Comments</span>
                    </div>
                  </button>
                </div>
              </div>
              <div className="draw-div">
                <div className="draw-item">
                  <button className="draw-button"  onClick={() => handleDrawerClick('faqs', -1)}>
                    <div className="draw-left d-flex gap-2 align-items-center">
                      <i className="fa-solid fa-circle-info align-items-center"/>
                      <span className="draw-text">FAQs</span>
                    </div>
                  </button>
                </div>
              </div>
              <div className="draw-div">
                <div className="draw-item">
                  <button className="draw-button" onClick={handleLogout}>
                    <div className="draw-left d-flex gap-2 align-items-center">
                      <i className="fa-solid fa-right-from-bracket align-items-center"/>
                      <span className="draw-text">Logout</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Box Drawer */}
        <div className={`boxDrawer ${boxDrawer ? "d-flex" : "hide"}`}>
          <div className="boxDrawerContent">
            <div className="boxDrawerTitle">
              <h5>Your Cart</h5>
              <button className="boxDrawerClose" onClick={() => setBoxDrawer(false)}>
                <CloseIcon className="boxDrClose"/>
              </button>
            </div>
            <div className="boxDivider"/>
            <div className="boxDrawerShipping">
              <div className="boxDrawerShippingNotice">
                <span>
                  Add $28 more to get free shipping.
                  {/*Congratulations! Enjoy free shipping!*/}
                </span>
                <div className="boxDrawerShippingBar">
                  <div className="shippingProgress" style={{width: "72%"}}/>
                </div>
              </div>
            </div>
            <div className="boxDivider"/>
            <div className="boxDrawerHeader">
              <div className="boxDrawerItems">
              {boxProducts?.map((product, index) => (
                <div className="boxDrawerItem" key={index}>
                  {product.name}
                </div>
              ))}
              </div>
            </div>
            <div className="boxDivider"/>
            <div className="boxDrawerCoupon">
              <input type="text" placeholder="Enter Coupon Code"/>
              <button>
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"><g fill="currentColor"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093l3.473-4.425a.267.267 0 0 1 .02-.022z"></path></g></svg>
              </button>
            </div>
            <div className="boxDivider"/>
            <div className="boxDrawerCheckout mt-1">
              <div className="boxDrawerCheckoutInfo">
                <span>Total</span>
                <span>$108</span>
              </div>
              <div className="boxDrawerCheckoutBtn">
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.412-.587Q4 20.825 4 20V10q0-.825.588-1.413Q5.175 8 6 8h1V6q0-2.075 1.463-3.538Q9.925 1 12 1t3.538 1.462Q17 3.925 17 6v2h1q.825 0 1.413.587Q20 9.175 20 10v10q0 .825-.587 1.413Q18.825 22 18 22Zm6-5q.825 0 1.413-.587Q14 15.825 14 15q0-.825-.587-1.413Q12.825 13 12 13q-.825 0-1.412.587Q10 14.175 10 15q0 .825.588 1.413Q11.175 17 12 17ZM9 8h6V6q0-1.25-.875-2.125T12 3q-1.25 0-2.125.875T9 6Z"></path></svg>
                  <span>CHECKOUT</span>
                </button>
              </div>
            </div>
          </div>    
        </div>
        <div className={`off-canvas ${rightDrawer || boxDrawer ? "d-inline" : "d-none"}`} onClick={() => {setRightDrawer(false); setBoxDrawer(false)}}/>
    </div>
  )
}
