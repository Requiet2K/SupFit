import React, { useEffect, useState } from "react";
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarHalfIcon from '@mui/icons-material/StarHalf';

export const StarsReview: React.FC<{ rating: number, hoverRate: number }> = (props) => {

    let rating = props.rating;

    let hoverRating = props.hoverRate;

    const [fullStars, setFullStars] = useState(0);
    const [halfStars, setHalfStars] = useState(0);
    const [emptyStars, setEmptyStars] = useState(0);

    const calculateStars = (rating: number) => {
        setFullStars(0);
        setHalfStars(0);
        setEmptyStars(0);
    
        if (rating !== undefined && rating > 0 && rating <= 5) {
            rating = Math.round(rating * 2) / 2;
            for (let i = 0; i <= 4; i++) {
                if (rating - 1 >= 0) {
                    setFullStars(prev => prev + 1);
                    rating = rating - 1;
                } else if (rating === .5) {
                    setHalfStars(prev => prev + 1);
                    rating = rating - .5;
                } else if (rating === 0) {
                    setEmptyStars(prev => prev + 1);
                } else {
                    break;
                }
            }
        } else {
            setEmptyStars(5);
        }
    }
    

    useEffect(() => {
        if(hoverRating != 0){
            calculateStars(hoverRating);
        }else{
            calculateStars(rating);
        }
    }, [rating, hoverRating])
    
    return (
        <div className="reviewStarList">
            {Array.from({ length: fullStars }, (_, i) =>
                <div key={i} className="">
                    <StarIcon />
                </div>
            )}

            {Array.from({ length: halfStars }, (_, i) => 
                <div key={i}>
                    <StarHalfIcon />
                </div>
            )}

            {Array.from({ length: emptyStars }, (_, i) => 
                <div key={i}>
                    <StarOutlineIcon />
                </div>
            )}
        </div>
    );

};
