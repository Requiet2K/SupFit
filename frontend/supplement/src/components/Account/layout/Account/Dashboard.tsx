import { AccountPage } from '../../AccountPage'
import { BreadCrumb } from '../../BreadCrumb'
import '../../../../style/AccountPage/AccountBase.css'
import '../../../../style/AccountPage/components/Dashboard.css'
import payment from "../../../../images/paymentMethods.jpg";

export const Dashboard = () => {

  return (
    <div className='dashboard mb-3'>
      <div className="container p-1">
        <div className="row h-100">
          <BreadCrumb path={["account", "dashboard"]}/>
          <div className="col-2 d-none d-lg-inline">
            <div className="account-left">
              <AccountPage />
            </div>
          </div>
          <div className="col-10 account-right">
            <div className="row mb-3">
              <div className="col-12">
                <div className="page-title">
                    <h3>Dashboard</h3>
                </div>
              </div>
            </div>
            <div className="content">
              <div className="row mb-3">
                <div className="col-6 col-lg-3">
                  <div className="dash-info">
                    <div className="dash-info-text">
                      <span className='info-size'>10</span>
                      <span className='info-text'>Favorites</span>
                    </div>
                    <i className="ms-3 fa-solid fa-star"/>
                  </div>
                </div>
                <div className="col-6 col-lg-3">
                  <div className="dash-info">
                      <div className="dash-info-text">
                        <span className='info-size'>7</span>
                        <span className='info-text'>Comments</span>
                      </div>
                      <i className="ms-1 fa-solid fa-comments"/>
                    </div>
                  </div>
                <div className="col-6 col-lg-3">
                  <div className="dash-info">
                    <div className="dash-info-text">
                      <span className='info-size'>73</span>
                      <span className='info-text'>Total Orders</span>
                    </div>
                    <i className="fa-solid fa-cart-flatbed mt-2"/>
                  </div>
                </div>
                <div className="col-6 col-lg-3">
                  <div className="dash-info">
                    <div className="dash-info-text">
                      <span className='info-size'>4</span>
                      <span className='info-text'>Boxed Items</span>
                    </div>
                    <i className="fa-solid fa-basket-shopping"/>
                  </div>
                </div>
              </div>
              <div className="row mt-4 dash-bottom">
                <div className="col-12 col-md-6 p-0 ps-md-3">
                  <div className="layer-left">
                    <div className="dash-payments-text">
                      <div className="d-flex flex-column">
                        <span className='payment-text-header'>Secure Shopping,</span>
                        <span className='payment-text-header'>Trusted Transactions</span>
                      </div>
                      <span className='payment-text-info mt-2'>Your peace of mind is our priority. Experience 100% reliability with our secure payment methods. Shop confidently on our e-commerce platform, where your transactions are safeguarded for a worry-free online shopping journey.</span>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6 p-0 pe-md-3">
                  <div className="layer-right">
                    <img src={payment} className="payment"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
