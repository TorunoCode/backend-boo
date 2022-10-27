import "./newProduct.css";
import TopBar from "../../components/topbar/TopBar";
import Sidebar from "../../components/sidebar/Sidebar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { addMovie } from "../../../../redux/apiRequest";

export default function NewProduct() {
  const [genres, setGenres] = useState([]);
  const [name, setName] = useState("");
  const [describe, setDescribe] = useState("");
  const [genre, setGenre] = useState("");
  const [runningTime, setRunningTime] = useState("");
  const [language, setLanguage] = useState("");
  const [image, setImage] = useState("");
  const [linkReview, setLinkReview] = useState("");
  const [rate, setRate] = useState(0);
  const [cast, setCast] = useState("");
  const [director, setDirector] = useState("");
  const [releaseTime, setReleaseTime] = useState("");
  const [isActive, setIsActive] = useState(1);
  const [price, setPrice] = useState(150000);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleAddMovie = (e) => {
    const newMovie = {
      name: name,
      describe: describe,
      genre: genre,
      runningTime: runningTime,
      language: language,
      image: image,
      linkReview: linkReview,
      rate: rate,
      cast: cast,
      director: director,
      releaseTime: releaseTime,
      isActive: isActive,
      price: price,
    };
    console.log(newMovie);

  };

function changeSrc(state){
  document.getElementsByClassName('png').src = state; 
}
  useEffect(() => {
    const fetchGenres = async () => {
      const {data} = await axios.get("/api/movies/genres");
      setGenres(data);
    };    
    fetchGenres();
  }, []);
  return (
    <div className="body">
      <TopBar />
      <div className="container">
        <Sidebar />
        <div className="newProduct">
          <h1 className="addProductTitle">Add Movie</h1>
          <div>
            <form  className="addProductForm" onSubmit={handleAddMovie}>
              <div className="table">
                <div className="info">
                <input placeholder="Title" name="name" onChange={(e)=>{ setName(e.target.value)}}  className="title form-control" />              
                <div className="infooo">
                <input placeholder="Upload Image" name="image" onChange={(e)=>{ setImage(e.target.value)}} className="form-control"/>
                <input placeholder="Upload Video" name="linkReview" onChange={(e)=>{ setLinkReview(e.target.value)}}  className="form-control"/>
                </div>
                <div className="select">
                  <select className="select form-control" onChange={(e)=>{ setDirector(e.target.value)}} >
                  <option disabled={true}>Select Director</option>
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="vw">VW</option>
                    <option value="audi">Audi</option>
                  </select>
                  <select placeholder="Select Actor" className="form-control" onChange={(e)=>{ setCast(e.target.value)}} >
                  <option disabled={true}>Select Actor</option>
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="vw">VW</option>
                    <option value="audi">Audi</option>
                  </select>
                </div>
                <div  name="genre" className="select">
                  <select onChange={(e)=>{ setGenre(e.target.value)}}  className="select form-control">
                  <option disabled={true}>Select Genre</option>
                 {genres.map((items) => (
                  <option value={items.name}>{items.name}</option>
                 ))}                   
                  </select>
                 
                </div>
                <textarea name="describe" placeholder="Description" onChange={(e)=>{ setDescribe(e.target.value)}} ></textarea>
                </div>
                <div className="info">
                  <div className="image">
                    <img className="png" src="" />
                  </div>
                  <div className="video"></div>
                </div>
                </div>
                <div className="infoo">
                <input placeholder="Release year" name="releaseTime" onChange={(e)=>{ setReleaseTime(e.target.value)}}  className="form-control"/>
                <select className="form-control" name="language" id="exampleFormControlSelect3" onChange={(e)=>{ setLanguage(e.target.value)}} ><option disabled={true}>Choose Language</option><option>English</option><option>Hindi</option><option>Tamil</option><option>Gujarati</option></select>
                </div>
                <input placeholder="Movie Duration" name="runningTime" onChange={(e)=>{ setRunningTime(e.target.value)}}  className="form-control"/>

              
              <div className="submit">
                <button className="addProductButton" onClick={handleAddMovie}>Create</button>
                <button className="addProductButton">Cancel</button>
              </div>
              
            </form>
            <div>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
