import React, { useRef } from "react";
import "../../sass/components/subcomponents/rating.scss";
const StarRating = ({ rating }) => {
  const starsTotal = 10;

  const starPercentage = (rating / starsTotal) * 100;

  const starPercentageRounded = (starPercentage / 10) * 10;

  const starRating = useRef();
  starRating.current = starPercentageRounded;

  console.log("star: " + starRating.current);

  return (
    <div className="star-outer">
      <div
        className="star-inner"
        style={{
          width: `${starRating.current}%`,
        }}
      ></div>
    </div>
  );
};

export default StarRating;
