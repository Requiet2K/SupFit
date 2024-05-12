import '../../style/MainPages/HomePage.css';
import sliderImg1 from "../../images/sliderImg1.jpg";
import sliderImg2 from "../../images/sliderImg2.jpg";
import sliderImg3 from "../../images/sliderImg3.png";
import { ImageSlider } from '../../utils/ImageSlider';
import proteinCategory from "../../images/proteinCategory.png";
import nutritionCategory from "../../images/nutritionsCategory.png";
import snacksCategory from "../../images/snacksCategory.png";
import vitaminCategory from "../../images/vitaminCategory.png";
import accessoryCategory from "../../images/accessoryCategory.png";
import allCategory from "../../images/allCategory.png";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const HomePage = ({ onCategoryChange }: {onCategoryChange: (e: string) => void}) => {

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
    <div className="sa">
      <div className="homePageHeader">
        <div className='homePageSlider'>
          <ImageSlider images={IMAGES} />
        </div>
      </div>
      <div className="homePageCategories">
        <div className="container">
          <div className="d-flex justify-content-center mt-5 flex-column align-items-center">
            <h1>CATEGORIES BANNER</h1>
            <div className="row categories row-gap-3 mt-4">
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
  )
}
