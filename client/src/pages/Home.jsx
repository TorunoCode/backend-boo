import React from "react";
import "../sass/pages/home.scss";
import ListMovie from "../components/ListMovies";

const Home = () => {
  return (
    <div className="home">
      <div className="main">
        <div className="tag_movie">
          <div className="title">Now Showing</div>
          <ListMovie />
        </div>
        <div className="tag_movie">
          <div className="title">Comming Soon</div>
          <ListMovie />
        </div>
        <div className="tag_movie">
          <div className="title">Movie Blog</div>
        </div>
        <div className="tag_movie">
          <div className="title">Promotion news</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
