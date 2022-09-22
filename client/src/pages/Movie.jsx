import React from "react";
import "../sass/pages/movie.scss";
import ListMovie from "../components/ListMovies";
// import { useState } from "react";
// import { datafakeMovie } from "../components/datafakeMovie";
// import { useEffect } from "react";
const Movie = () => {
  // const [showSub, setShowSub] = useState(datafakeMovie);
  // const [totalQt, setTotalQt] = useState(0);
  // const [tempList, setTempList] = useState();
  // const [listProduct, setListProduct] = useState(0);
  // useEffect(() => {
  //   setTotalQt(datafakeMovie.length);
  // }, [showSub]);
  return (
    <div className="movie">
      <div className="main">
        <div className="box_filter">
          <div className="filter">
            <label htmlFor="">Gener:&nbsp;</label>
            <select className="select">
              <option value="">All</option>
              <option value="">Horror</option>
              <option value="">Adventure</option>
            </select>
          </div>
          <div className="filter">
            <label htmlFor="">Rate:&nbsp;</label>
            <select className="select">
              <option value="">Default</option>
              <option value="">Low to high</option>
              <option value="">High to low</option>
            </select>
          </div>
          <div className="filter">
            <label htmlFor="">Gener:&nbsp;</label>
            <select className="select">
              <option value="">All</option>
              <option value="">Horror</option>
              <option value="">Adventure</option>
            </select>
          </div>
        </div>
        <ListMovie />
      </div>
    </div>
  );
};

export default Movie;
