import '@fortawesome/fontawesome-free/css/all.css';
import '../../style/NavbarAndFooter/Footer.css';
import SearchIcon from '@mui/icons-material/Search';
import payments from "../../images/payments.png";
import { useNavigate } from 'react-router-dom';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { overflowHidden, overflowShow } from '../../utils/handleOverflow';
import { CartContext } from '../../context/CartContext';
import { SearchBar } from '../../utils/SearchBar';

export const Footer = ({ handleContactModal, handleCloseContactModal } : { handleContactModal: boolean, handleCloseContactModal: () => void}) => {
  const navigate = useNavigate();

  const [contactModal, setContactModal] = useState(false);
  
  const {setBoxDrawer} = useContext(CartContext);

  useEffect(() => {
    if(contactModal){
      overflowHidden(true);
    }else{
      overflowShow();
    }
  }, [contactModal]);

  useEffect(() => {
    if(handleContactModal){
      setContactModal(true);
    }
  }, [handleContactModal]);

  const handleNavigate = (e : FormEvent, path: string) => {
    e.preventDefault();
    navigate(`/${path}`);
  }

  const [openSearchModal, setOpenSearchModal] = useState(false);

  return (
    <footer>
      <div className="footerTop">
        <div className="container">
          <div className="row row-cols-3 row-cols-md-5 justify-content-center">
            <div className="col">
              <div className="trustItem">
                <div className="icon"><i className="bi bi-shield-fill-check mt-2"></i></div>
                <h6 className='icon-text'>24/7 easy and secure payment options.</h6>
              </div>
            </div>
            <div className="col">
              <div className="trustItem">
                <div className="icon"><i className="bi bi-truck mt-2 ms-1"></i></div>
                <h6 className='icon-text'>Next-day shipping is guarantee for your orders.</h6>
              </div>
            </div>
            <div className="col">
              <div className="trustItem">
                <div className="icon"><i className="bi bi-capsule mt-1"></i></div>
                <h6 className='icon-text'>Laboratory-tested products</h6>
              </div>
            </div>
            <div className="col">
              <div className="trustItem">
                <div className="icon"><i className="bi bi-award-fill mt-1"></i></div>
                <h6 className='icon-text'>100% customer satisfaction guarantee.</h6>
              </div>
            </div>
            <div className="col">
              <div className="trustItem">                
                <div className="icon"><i className="bi bi-robot"></i></div>
                <h6 className='icon-text'>Helpful and reliable AI chatbot is available on our website.</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footerMid">
        <div className="container">
          <div className="footerText py-3">
            <div className="row">
              <div className="col-12 col-md-9">
                <div className="row">
                  <div className="col-4">
                    <h5>Quick Links</h5>
                    <ul className="footer-list">
                      <li>
                        <a href="" onClick={(e) => handleNavigate(e, 'protein')}>Protein</a>
                      </li>
                      <li>
                        <a href="" onClick={(e) => handleNavigate(e, 'nutrition')}>Nutrition</a>
                      </li>
                      <li>
                        <a href="" onClick={(e) => handleNavigate(e, 'snack')}>Snacks</a>
                      </li>
                      <li>
                        <a href="" onClick={(e) => handleNavigate(e, 'vitamin')}>Vitamin</a>
                      </li>
                      <li>
                        <a href="" onClick={(e) => handleNavigate(e, 'accessory')}>Accessory</a>
                      </li>
                      <li>
                        <a href="" onClick={(e) => handleNavigate(e, 'all')}>All Products</a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-4">
                    <h5>Management</h5>
                    <ul className="footer-list">
                      <li>
                        <a href="" onClick={(e) => handleNavigate(e, 'account')}>Account</a>
                      </li>
                      <li>
                        <a href="" onClick={(e) => handleNavigate(e, 'past-orders')}>Orders</a>
                      </li>
                      <li>
                        <a href="" onClick={(e) => handleNavigate(e, 'favorites')}>Favorites</a>
                      </li>
                      <li>
                        <button onClick={() => setBoxDrawer(true)}>Box</button>
                      </li>
                      <li>
                        <a href="" onClick={(e) => handleNavigate(e, 'addresses')}>Addresses</a>
                      </li>
                      <li>
                        <a href="" onClick={(e) => handleNavigate(e, 'reviews')}>Reviews</a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-4">
                    <h5>Need Help?</h5>
                    <ul className="footer-list">
                      <li>
                        <button onClick={() => { setContactModal(true); }}>Contact Us</button>
                      </li>
                      <li>
                        <a href="" onClick={(e) => handleNavigate(e, 'faqs')}>FAQs</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-3 p-0 mt-2 mt-md-0 p-2 p-md-0 d-flex">
                <div className="d-flex w-100 searchBar gap-2">
                  <div className='fSearch'>
                    <h6>Couldn't find what you are looking for?</h6>
                    <form className="form-inline d-flex w-100" onClick={() => setOpenSearchModal(true)}>
                      <input className="form-control src" type="search" placeholder="Search" aria-label="Search" value={""}/>
                      <button className="search" type='button'><SearchIcon className="badges"/></button>
                    </form>
                  </div>
                  <div className="contact d-flex gap-3">
                    <div className="contact-icon">
                      <i className="bi bi-telephone-fill"></i>
                    </div>
                    <h6 className="text">0 850 999 99 99</h6>
                  </div>
                  <div className="contact d-flex gap-3">
                    <div className="contact-icon">
                      <i className="bi bi-at"></i>
                    </div>
                    <h6 className="text">info@supfit.com</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footerBottom">
        <div className="container d-flex justify-content-between">
          <div className="footer-bottom-left">
            <p>
            © All rights reserved by&nbsp;  
              <a href="#">www.supfit.com</a>
            </p>
          </div>
          <div className="footer-bottom-right">
            <img src={payments} className="payments"/>
          </div>
        </div>
      </div>
      <div className={`contactModal ${contactModal ? `showContactModal` : ""}`}>
        <div className={`footerModalCenter ${contactModal ? `showContactModalCenter` : ""}`}>
          <h5>You can reach us using the contact information below.</h5>
          <div className="contactModalItem d-flex gap-3">
            <div className="contact-icon">
              <i className="bi bi-telephone-fill"/>
            </div>
            <h6 className="text">0 850 999 99 99</h6>
          </div>
          <div className="contactModalItem d-flex gap-3">
            <div className="contact-icon">
              <i className="bi bi-at"/>
            </div>
            <h6 className="text">info@supfit.com</h6>
          </div>
          <i className="fa-regular fa-circle-xmark" onClick={() => {handleCloseContactModal(); setContactModal(false)}}/>
        </div>
      </div>
      <div className={`searchModal ${openSearchModal ? `showContactModal` : ""}`}>
        <div className="searchModalBar">
        <SearchBar setOpenSearchModal={setOpenSearchModal}/>
        </div>
      </div>
    </footer>
  )
}
