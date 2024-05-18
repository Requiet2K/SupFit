import '../../style/MainPages/HomePage.css';
import sliderImg1 from "../../images/sliderImg1.png";
import sliderImg2 from "../../images/sliderImg2.png";
import sliderImg3 from "../../images/sliderImg3.png";
import { ImageSlider } from '../../utils/ImageSlider';
import proteinCategory from "../../images/proteinCategory.png";
import nutritionCategory from "../../images/nutritionCategory.png";
import snacksCategory from "../../images/snacksCategory.png";
import vitaminCategory from "../../images/vitaminCategory.png";
import accessoryCategory from "../../images/accessoryCategory.png";
import allCategory from "../../images/allCategory.png";
import gym from "../../images/gym.jpg";
import homeHeader from "../../images/homeHeader.jpg";
import homeFooter from "../../images/homeFooter.png";
import { useNavigate } from 'react-router-dom';
import floating1 from "../../images/floating1.png";
import floating4 from "../../images/floating4.png";
import floating5 from "../../images/floating5.png";
import floatingMain from "../../images/floatingMain.png";
import { useContext, useEffect } from 'react';
import { LoadingContext } from '../../context/LoadingContext';

export const HomePage = ({ onCategoryChange }: {onCategoryChange: (e: string) => void}) => {

  const allImages = [sliderImg1, sliderImg2, sliderImg3, proteinCategory, 
    nutritionCategory, snacksCategory, vitaminCategory, accessoryCategory, 
    allCategory, gym, homeHeader, homeFooter, floating1, floating4, floating5, floatingMain];

    const {setIsLoadingScreen} = useContext(LoadingContext);

    useEffect(() => {
      setIsLoadingScreen(true);
      const imagePromises = allImages.map(image => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = image;
          img.onload = resolve;
          img.onerror = reject;
        });
      });
  
      Promise.all(imagePromises)
        .then(() => setIsLoadingScreen(false))
        .catch(err => {console.error(err);setIsLoadingScreen(false)});
    }, []);

  const IMAGES = [
    { url: sliderImg1, alt: "Slider One" },
    { url: sliderImg2, alt: "Slider Two" },
    { url: sliderImg3, alt: "Slider Three" }
  ]
  
  const navigate = useNavigate();

  const handleCategoryClick = (newCategory: string) => {
    navigate(`/${newCategory}`); 
    onCategoryChange(newCategory); 
  };

  return (
    <div className="sa" style={{backgroundImage: `url(${homeHeader})`}}>
      <div className="homePageHeader">
        <div className='homePageSlider'>
          <ImageSlider images={IMAGES} />
        </div>
      </div>
      <div className="homePageCategories mt-5" style={{backgroundImage: `url(${gym})`}}>
        <div className="container">
          <div className="d-flex justify-content-center mt-2 flex-column align-items-center">
            <h1>CATEGORIES BANNER</h1>
            <div className="categories">
              <div className="row row-gap-3 mt-4">
                <div className="categories-item col-6 col-md-4">
                  <img src={proteinCategory} alt="proteinCategory" onClick={() => handleCategoryClick("protein")}/>
                </div>
                <div className="categories-item col-6 col-md-4">
                  <img src={nutritionCategory} alt="nutritionCategory" onClick={() => handleCategoryClick("nutrition")}/>
                </div>
                <div className="categories-item col-6 col-md-4">
                  <img src={snacksCategory} alt="snacksCategory" onClick={() => handleCategoryClick("snack")}/>
                </div>
                <div className="categories-item col-6 col-md-4">
                  <img src={vitaminCategory} alt="vitaminCategory" onClick={() => handleCategoryClick("vitamin")}/>
                </div>
                <div className="categories-item col-6 col-md-4">
                  <img src={accessoryCategory} alt="accessoryCategory" onClick={() => handleCategoryClick("accessory")}/>
                </div>
                <div className="categories-item col-6 col-md-4">
                  <img src={allCategory} alt="allCategory" onClick={() => handleCategoryClick("all")}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="homePageSup">
        <div className="container">
          <div className="supAdv pb-5 pb-md-0" style={{backgroundImage: `url(${homeFooter})`}}>
            <img src={floating1} alt="floating1" className='floating1 floatingImgs'/>
            <img src={floating4} alt="floating2" className='floating2 floatingImgs'/>
            <img src={floating5} alt="floating4" className='floating4 floatingImgs'/>
            <div className="supAdv-content">
              <div className="row">
                <div className="col-12 col-md-6 supAdv-left">
                  <img src={floatingMain} alt="floatingMain" />
                </div>
                <div className="col-12 col-md-6 supAdv-right">
                  <h3>Unique Healty Sauces</h3>
                  <h1>SUPFIT</h1>
                  <span className='text-center mb-2'>Choose us for Delicious and Healthy Sauces! The best high-protein sauces that will be the first choice for those who want to use healthy, additive-free, preservative-free, and natural ingredient sauces. Developed to help you maintain your diet without introducing simple sugars to your body. Grab your favorite SupFit sauce now and experience the taste!</span>
                  <button onClick={() => handleCategoryClick("all")}>View</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="homePageSup mt-5">
      </div>
    </div>
  )
}
