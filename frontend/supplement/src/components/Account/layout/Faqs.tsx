import { AccountPage } from '../AccountPage'
import { BreadCrumb } from '../BreadCrumb'
import '../../../style/AccountPage/AccountBase.css'
import faqsImage from "../../../images/faqsImage.png";
import '../../../style/AccountPage/components/Faqs.css'
import { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const Faqs = ({ handleContactModal }: { handleContactModal: () => void }) => {

  const [faqsModal, setFaqsModal] = useState(false);
  const [faqsModalElement, setFaqsModalElement] = useState("product");

  useEffect(() => {
    if(faqsModal){
      document.body.style.overflow = 'hidden';
    }else{
      document.body.style.overflow = 'visible';
    }
  },[faqsModal]);

  return (
    <div className='faqs mb-3'>
      <div className="container p-1">
        <div className="row h-100">
          <BreadCrumb path={["faqs"]}/>
          <div className="col-2 d-none d-lg-inline">
            <div className="account-left">
              <AccountPage />
            </div>
          </div>
          <div className="col-10 account-right">
            <div className="row mb-2">
              <div className="col-12">
                <div className="page-title">
                    <h3>FAQs</h3>
                </div>
              </div>
            </div>
            <div className="content">
              <div className="row">
                <div className="col-12 col-lg-6 faqsLeft">
                  <div className="faqsLeft">
                    <div className="faqsLeftTitle">
                      <h4>FAQs</h4>
                    </div>
                    <span className='faqsLeftSpan'>
                      Have questions? Here you’ll find the answers most valued by our partners, along with access to step-by-step instructions and support.
                    </span>
                    <button className='faqsButton btn btn-primary' onClick={() => setFaqsModal(true)}>
                      Show me FAQs
                    </button>
                  </div>
                </div>
                <div className="col-12 col-lg-6 faqsRight">
                  <img src={faqsImage} className="faqsImg"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`faqsModal ${faqsModal ? "showFaqsModal" : ""}`}>
        <div className="faqsModalContent">
          <div className="row">
            <div className="col-12">
              <h5 className='ms-4'>FAQ</h5>
            </div>
          </div>
          <div className="row mt-3">
            <div className="faqsButtons">
              <button className={`${faqsModalElement == "product" && "faqsButtonActive"}`} onClick={() => setFaqsModalElement("product")}>
                PRODUCT
              </button>
              <button className={`${faqsModalElement == "shipping" && "faqsButtonActive"}`} onClick={() => setFaqsModalElement("shipping")}>
                SHIPPING
              </button>
              <button className={`${faqsModalElement == "returns" && "faqsButtonActive"}`} onClick={() => setFaqsModalElement("returns")}>
                RETURNS
              </button>
              <button className={`${faqsModalElement == "offers" && "faqsButtonActive"}`} onClick={() => setFaqsModalElement("offers")}>
                OFFERS
              </button>
              <button className={`${faqsModalElement == "other" && "faqsButtonActive"}`} onClick={() => setFaqsModalElement("other")}>
                OTHER
              </button>
            </div>
          </div>
          <div className="row mt-md-0 mt-4">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <div className='faqsItemTitle'>
                  {faqsModalElement === "product" && "What is the recommended dosage for any product?"}
                  {faqsModalElement === "shipping" && "What are the shipping options available?"}
                  {faqsModalElement === "returns" && "What is the return policy?"}
                  {faqsModalElement === "offers" && "Are there any current offers or discounts available?"}
                  {faqsModalElement === "other" && "Is your integrated artificial intelligence trustworthy?"}
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className='faqsItemContent'>
                  {faqsModalElement === "product" && "The recommended dosage is clearly indicated on the product label and detailed on the product page. Always follow the instructions provided on the label or consult with a healthcare professional for personalized dosage recommendations."}
                  {faqsModalElement === "shipping" && "We offer standard and expedited shipping options. Shipping costs and delivery times may vary depending on your location and chosen shipping method."}
                  {faqsModalElement === "returns" && "Our return policy allows for returns within 30 days of purchase. Items must be unused and in their original packaging to be eligible for a refund. Please refer to our Returns page for detailed instructions."}
                  {faqsModalElement === "offers" && "We regularly update our website and social media channels with current offers and discounts. Be sure to check back frequently or subscribe to our newsletter for the latest deals."}
                  {faqsModalElement === "other" && "It's not 100% reliable, if you have any concerns, you can write your questions to us through the 'contact us' section."}
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <div className='faqsItemTitle'>
                  {faqsModalElement === "product" && "Are there any known side effects associated with any supplement?"}
                  {faqsModalElement === "shipping" && "When will my order be shipped?"}
                  {faqsModalElement === "returns" && "How do I initiate a return?"}
                  {faqsModalElement === "offers" && "Are there any ongoing promotions?"}
                  {faqsModalElement === "other" && "How can we reach you for sponsorship inquiries?"}
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className='faqsItemContent'>
                  {faqsModalElement === "product" && "Possible side effects, though rare, are typically outlined on the product label and detailed on the product page. It's important to consult with a healthcare professional if you experience any adverse effects or have concerns about potential side effects before or during use."}
                  {faqsModalElement === "shipping" && "Orders are typically shipped within 1-2 business days. Once your order has been shipped, you will receive a confirmation email with tracking information."}
                  {faqsModalElement === "returns" && "To initiate a return, please contact our customer service team with your order number and reason for return. They will provide you with further instructions and assistance."}
                  {faqsModalElement === "offers" && "We have various promotions throughout the year. To stay updated on our current promotions, please subscribe to our newsletter or follow us on social media."}
                  {faqsModalElement === "other" && "You can reach us through the 'contact' section on our page."}
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
              >
                <div className='faqsItemTitle'>
                  {faqsModalElement === "product" && "How long does it typically take to see results after starting to use any product?"}
                  {faqsModalElement === "shipping" && "Where do you ship orders?"}
                  {faqsModalElement === "returns" && "What items are eligible for return?"}
                  {faqsModalElement === "offers" && "Do you offer discounts for bulk orders?"}
                  {faqsModalElement === "other" && "Do you have any branches in Turkey?"}
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className='faqsItemContent'>
                  {faqsModalElement === "product" && "The timeframe for noticeable results can vary depending on the product type. For example, supplements like creatine may require longer-term usage to observe significant effects, while pre-workout supplements may provide noticeable benefits within 15-20 minutes of consumption. For detailed information, please refer to the product's usage guide or consult with a healthcare professional."}
                  {faqsModalElement === "shipping" && "We currently ship orders within the Turkey. For international shipping inquiries, please contact our customer service team for assistance."}
                  {faqsModalElement === "returns" && "Most items are eligible for return within 30 days of purchase if they are unused and in their original packaging. However, certain items such as perishable goods or personalized items may not be eligible for return. Please refer to our Returns page for more detailed information."}
                  {faqsModalElement === "offers" && "Yes, we offer discounts for bulk orders. Please contact our sales team for more information and to discuss pricing options for bulk purchases."}
                  {faqsModalElement === "other" && "We don't have branches yet as we're still in the process of formalizing, but we plan to open some soon."}
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4-content"
                id="panel4-header"
              >
                <div className='faqsItemTitle'>
                  {faqsModalElement === "product" && "Is any product suitable for individuals with specific dietary restrictions or allergies?"}
                  {faqsModalElement === "shipping" && "What is the estimated delivery time for orders?"}
                  {faqsModalElement === "returns" && "How long does it take to process a refund?"}
                  {faqsModalElement === "offers" && "Do you offer discounts for first-time customers?"}
                  {faqsModalElement === "other" && "Are you seeking partners or offering franchise opportunities?"}
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className='faqsItemContent'>
                  {faqsModalElement === "product" && "Individuals with allergies to dairy or eggs should be cautious and consult with their healthcare provider before using our products. It's important to review the nutritional information of our products and discuss with a doctor before incorporating them into your routine."}
                  {faqsModalElement === "shipping" && "Delivery times may vary depending on your location and chosen shipping method. Generally, orders are delivered within 3-7 business days from the date of shipment. Please refer to our Shipping page for more detailed information."}
                  {faqsModalElement === "returns" && "Refunds are typically processed within 5-7 business days after we receive the returned item. However, it may take additional time for the refund to reflect in your account depending on your bank or credit card issuer."}
                  {faqsModalElement === "offers" && "Yes, we offer discounts for first-time customers. Please check our website or contact our customer service team for information on current promotions available to new customers."}
                  {faqsModalElement === "other" && "Currently, we're not actively seeking partners or offering any franchise opportunities."}
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="faqsModalBottom text-center">
            <h5>HAVE SOMETHING NOT BEING ADDRESSED?</h5>
            <div className='faqsModalBottomDiv'>
              <button onClick={() => { handleContactModal(); setFaqsModal(false); }}>CONTACT US</button>
            </div>
          </div>
        </div>
        <div className="closeModal">
          <i className="fa-regular fa-circle-xmark" onClick={() => setFaqsModal(false)}/>
        </div>
      </div>
    </div>
  )
}
