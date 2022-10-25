import "./newShowing.css";
import TopBar from "../../components/topbar/TopBar";
import Sidebar from "../../components/sidebar/Sidebar";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function NewProduct() {
  useEffect(() => {
    const fetchGenres = async () => {
      const {data} = await axios.get("/api/genre/genres");
      fetchGenres(data);
    };
    fetchGenres();
  }, []);
  return (
    <div className="body">
      <TopBar />
      <div className="container">
        <Sidebar />
        <div className="newProduct">
          <h1 className="addProductTitle">Add Show</h1>
          <div>
            <form action="" class="addProductForm">
              <div className="table">
                <div className="info">    
                <div className="select">
                  <select placeholder="Upload Image" className="select form-control">
                  <option>Select Cinema</option>
                    <option value="saab">Saab</option>
                    <option value="vw">VW</option>
                    <option value="audi">Audi</option>
                  </select>
                 
                </div>            
                <div className="select">
                  
                  <select  className="select form-control" >
                  <option>Select Movie</option>
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="vw">VW</option>
                    <option value="audi">Audi</option>
                  </select>
                  <select placeholder="Select Actor" className="form-control">
                  <option>Select Room</option>
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="vw">VW</option>
                    <option value="audi">Audi</option>
                  </select>
                </div>
                
                <input placeholder="Movie Duration" className="form-control" type="date"/>
                <input placeholder="Movie Duration" className="form-control" />
                <input type="time" name="time" value="13:30"></input>
                </div>
                <div className="info">
                  <div className="video"></div>
                </div>
                </div>
               
                <div className="infoo">
              </div>

              
              <div className="submit">
                <button class="addProductButton">Create</button>
                <button class="addProductButton">Cancel</button>
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
