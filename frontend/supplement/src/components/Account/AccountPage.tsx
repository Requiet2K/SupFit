import '../../style/AccountPage/AccountPage.css';
import { useDispatch, useSelector } from "react-redux";
import { logout, selectCurrentUser } from "../../redux/auth/authSlice";
import { useNavigate } from 'react-router-dom';
import { removeAllFromCart } from '../../redux/cart/cartSlice';

export const AccountPage: React.FC<{}> = () => {

  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
    dispatch(logout({}));
    dispatch(removeAllFromCart());
  }

  return (
    <div className="accountPage">
        <div className="account-area">
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
                      <button className="logoutBtn d-flex align-items-center gap-1" onClick={handleLogout}>
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
                      <button className="drop-item" onClick={() => navigate("/dashboard")}>
                        <i className="fa-solid fa-newspaper"/>
                        <span>Dashboard</span>
                      </button>
                      <button className="drop-item"  onClick={() => navigate("/information")}>
                        <i className="fa-solid fa-gears"/>
                        <span>Informations</span>
                      </button>
                      <button className="drop-item"  onClick={() => navigate("/security")}>
                        <i className="fa-solid fa-shield-halved"/>
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
                      <button className="drop-item" onClick={() => navigate("/current-orders")}>
                        <i className="fa-solid fa-truck-moving"/>
                        <span>Current Orders</span>
                      </button>
                      <button className="drop-item" onClick={() => navigate("/past-orders")}>
                        <i className="fa-solid fa-truck-ramp-box"/>
                        <span>Past Orders</span>
                      </button>
                    </div>
                  </div>
                  <button className="sidebar-item"  onClick={() => navigate("/favorites")}>
                    <div className="sidebar-item-left">
                      <i className="fa-solid fa-heart"/>
                      <span>Favorites</span>
                    </div>
                  </button>
                  <button className="sidebar-item"  onClick={() => navigate("/addresses")}>
                    <div className="sidebar-item-left">
                      <i className="fa-solid fa-map-location-dot"/>
                      <span>My Addresses</span>
                    </div>
                  </button>
                  <button className="sidebar-item"  onClick={() => navigate("/reviews")}>
                    <div className="sidebar-item-left">
                      <i className="fa-solid fa-comment"/>
                      <span>My Reviews</span>
                    </div>
                  </button>
                  <button className="sidebar-item"  onClick={() => navigate("/faqs")}>
                    <div className="sidebar-item-left">
                      <i className="fa-solid fa-circle-info"/>
                      <span>FAQs</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
    </div>
  )
}
