import '@fortawesome/fontawesome-free/css/all.css';
import '../../style/NavbarAndFooter/Footer.css';
import SearchIcon from '@mui/icons-material/Search';
import payments from "../../images/payments.png";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { overflowHidden, overflowShow } from '../../utils/handleOverflow';

export const Footer = ({ handleContactModal, handleCloseContactModal } : { handleContactModal: boolean, handleCloseContactModal: () => void}) => {
  const navigate = useNavigate();

  const [contactModal, setContactModal] = useState(false);

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
  
  return (
    <footer>
      <div className="footerTop">
        <div className="container">
          <div className="row row-cols-3 row-cols-md-5 justify-content-center">
            <div className="col">
              <div className="trustItem">
                <div className="icon"><i className="bi bi-shield-fill-check"></i></div>
                <h6 className='icon-text'>24/7 easy and secure payment options.</h6>
              </div>
            </div>
            <div className="col">
              <div className="trustItem">
                <div className="icon"><i className="bi bi-truck"></i></div>
                <h6 className='icon-text'>Next-day shipping is guarantee for your orders.</h6>
              </div>
            </div>
            <div className="col">
              <div className="trustItem">
                <div className="icon"><i className="bi bi-capsule"></i></div>
                <h6 className='icon-text'>Laboratory-tested products</h6>
              </div>
            </div>
            <div className="col">
              <div className="trustItem">
                <div className="icon"><i className="bi bi-award-fill"></i></div>
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
                        <a href="">Protein</a>
                      </li>
                      <li>
                        <a href="">Nutrition</a>
                      </li>
                      <li>
                        <a href="">Snacks</a>
                      </li>
                      <li>
                        <a href="">Vitamin</a>
                      </li>
                      <li>
                        <a href="">Accessory</a>
                      </li>
                      <li>
                        <a href="">All Products</a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-4">
                    <h5>Management</h5>
                    <ul className="footer-list">
                      <li>
                        <a href="" onClick={() => navigate('/dashboard')}>Account</a>
                      </li>
                      <li>
                        <a href="" onClick={() => navigate('/past-orders')}>Orders</a>
                      </li>
                      <li>
                        <a href="" onClick={() => navigate('/favorites')}>Favorites</a>
                      </li>
                      <li>
                        <a href="" onClick={() => navigate('/box')}>Box</a>
                      </li>
                      <li>
                        <a href="" onClick={() => navigate('/addresses')}>Addresses</a>
                      </li>
                      <li>
                        <a href="" onClick={() => navigate('/comments')}>Comments</a>
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
                        <a href="" onClick={() => navigate('/faqs')}>FAQs</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-3 p-0 mt-2 mt-md-0 p-2 p-md-0 d-flex">
                <div className="d-flex w-100 searchBar gap-2">
                  <div>
                    <h6>Couldn't find what you are looking for?</h6>
                    <form className="form-inline d-flex w-100">
                      <input className="form-control src" type="search" placeholder="Search" aria-label="Search"/>
                      <button className="search" type="submit"><SearchIcon className="badges"/></button>
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
    </footer>
  )
}
