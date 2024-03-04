import { Breadcrumbs } from "@mui/material"
import { Link } from "react-router-dom"
import '../../style/AccountPage/AccountPage.css';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectCurrentUser } from "../../redux/auth/authSlice";

export const AccountPage: React.FC<{}> = () => {

  const [breadNames, setBreadNames] = useState<string[]>(["account"]);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  return (
    <div className="accountPage">
      <div className="container p-1">
        <div className="bread-crumb-area">
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link to="/home" className="bread-name">
              Home
            </Link>
            {breadNames.map((item: string) => (
              <Link to={`/${item}`} className="bread-name" key={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            ))}
          </Breadcrumbs>
        </div>
        <div className="account-area mb-3">
          <div className="row h-100">
            <div className="account-area-left col-2  d-none d-xl-inline">
              <div className="accountSideBar">
                <div className="accountSideBar-header">
                  <div className="d-flex">
                    <i className="bi bi-person-square"/>
                  </div>
                  <div className="d-flex flex-column flex-start mt-1">
                    <div className="d-flex align-items-center gap-1">
                      <span>{user?.firstName + " " + user?.lastName}</span>
                    </div>
                    <div className="log">
                      <button className="logoutBtn d-flex align-items-center gap-1" onClick={() => dispatch(logout({}))}>
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="accountSideBar-items">
                  <div className="account-item mt-2">
                    <div className="sidebar-item">
                      <div className="sidebar-item-left">
                        <i className="fa-solid fa-user"/>
                        <span>Account</span>
                      </div>
                      <i className="bi  bi-chevron-down"></i>
                    </div>
                    <div className="drop-items">
                      <button className="drop-item">
                        <i className="fa-solid fa-heart"/>
                        <span>Dashboard</span>
                      </button>
                      <button className="drop-item">
                        <i className="fa-solid fa-heart"/>
                        <span>Informations</span>
                      </button>
                      <button className="drop-item">
                        <i className="fa-solid fa-heart"/>
                        <span>Security</span>
                      </button>
                    </div>
                  </div>
                  <div className="account-item">
                    <div className="sidebar-item">
                      <div className="sidebar-item-left">
                        <i className="fa-solid fa-box"/>
                        <span>Orders</span>
                      </div>
                      <i className="bi  bi-chevron-down"></i>
                    </div>
                    <div className="drop-items">
                      <button className="drop-item">
                        <i className="fa-solid fa-heart"/>
                        <span>Current Orders</span>
                      </button>
                      <button className="drop-item">
                        <i className="fa-solid fa-heart"/>
                        <span>Past Orders</span>
                      </button>
                    </div>
                  </div>
                  <button className="sidebar-item">
                    <div className="sidebar-item-left">
                      <i className="fa-solid fa-heart"/>
                      <span>Favorites</span>
                    </div>
                  </button>
                  <button className="sidebar-item">
                    <div className="sidebar-item-left">
                      <i className="fa-solid fa-cart-shopping"/>
                      <span>Box</span>
                    </div>
                  </button>
                  <button className="sidebar-item">
                    <div className="sidebar-item-left">
                      <i className="fa-solid fa-map-location-dot"/>
                      <span>My Addresses</span>
                    </div>
                  </button>
                  <button className="sidebar-item">
                    <div className="sidebar-item-left">
                      <i className="fa-solid fa-circle-question"/>
                      <span>My Tickets</span>
                    </div>
                  </button>
                  <button className="sidebar-item">
                    <div className="sidebar-item-left">
                      <i className="fa-solid fa-circle-info"/>
                      <span>FAQs</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className="account-area-right col-10">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolores, dolor perspiciatis? Sed velit quod hic ut expedita cumque culpa error a placeat, reprehenderit porro ullam neque similique, laudantium veniam accusamus ipsam? Odio, ratione? Veniam tenetur, eaque adipisci sint atque quos?
            </div>
          </div>
        </div>          
      </div>
    </div>
  )
}
