import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "../sass/pages/movieDetail.scss";
import StarRating from "../components/subcomponents/StarRating.jsx";
import Feedback from "../components/subcomponents/Feedback";
import axios from "axios";
// import datafakeMovie from "../components/datafakeMovie";

const MovieDetail = ({match}) => {
  const [description, setDescription] = useState(true);
  const [payment, setPayment] = useState(false);
  const [movie, setMovie] = useState([]);  
  const {id} = useParams();
  useEffect(() => {
    const fetchMovie = async () => {
      const {data} = await axios.get(`/api/movies/${id}`);
      setMovie(data);
    };
    fetchMovie();
  }, [id]);
  return (
    // bấm thả xuống description
    <div className="detail">
      <div className="main">
        <div className="title">Movie Details</div>
        <div className="detailmovie">
          <div className="info">
            <img
              src={movie.image}
              alt=""
            />
            <div className="info-text">
              <div className="name">CONTORTED</div>
              <div className="rate">
                <StarRating rating={movie.rate} />
                <div className="rating">{movie.rate}/10</div>
              </div>
              <div className="text">
                <b>Director:</b> {movie.director} <br />
                <b>Cast:</b> {movie.cast} <br />
                <b>Genre:</b> {movie.genre} <br />
                <b>Release time:</b> {movie.releaseTime} <br />
                <b>Running time:</b> {movie.runningTime} <br />
                <b>Language:</b> {movie.language} <br />
              </div>
            </div>
          </div>
          <div className="video_ytb">
            <iframe
              width="480"
              height="270"
              src={movie.linkReview}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
        <div className="description">
          <div className="btn_description">
            Description &nbsp;
            <i
              onClick={() => setDescription(!description)}
              className="fa-solid fa-caret-down"
            ></i>
          </div>
          {description && (
            <p>
              &emsp; &emsp; {movie.describe}
            </p>
          )}
        </div>
        <div className="title">Booking</div>
        <div className="selectMovie">
          <div className="col-1">
            <div className="col-1-text">
              Movie: {movie.name}<br /> Date: {movie.releaseTime}<br />
              Time: {movie.runningTime}
            </div>
            <div>
              <select name="" id="movie">
                <option value="1">CONTORTED</option>
                <option value="1">Conan</option>
                <option value="1">Ran Mori</option>
                <option value="1">Kid</option>
              </select>
              <br />
              <select name="" id="date">
                <option value="1">1/1/2022</option>
                <option value="1">2/1/2022</option>
                <option value="1">3/1/2022</option>
                <option value="1">4/1/2022</option>
              </select>
              <br />
              <select name="" id="time">
                <option value="1">9:30</option>
                <option value="1">11:30</option>
                <option value="1">15:30</option>
                <option value="1">20:30</option>
              </select>
            </div>
          </div>
          <div className="col-2">
            <div className="flex">
              <div className="available">
                <div className="seat"></div> &nbsp;Avaliable
              </div>
              <div className="selected">
                <div className="seat"></div> &nbsp;Selected
              </div>
              <div className="occupied">
                <div className="seat"></div> &nbsp;Occupied
              </div>
            </div>
            <div className="screen"></div>
            <div className="seat-parent">
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
              <div className="seat"></div>
            </div>
          </div>
          <div className="col-3">
            You selected <span id="count">0</span> seats <br />
            Price ticket: $ <br />
            <button className="btPay" onClick={() => setPayment(!payment)}>
              <i className="fa-solid fa-angles-right"></i> Buy Ticket
            </button>
            {payment && (
              <div className="optionpay">
                <div>Select Payment Method</div>
                <button>
                  <i className="fa-regular fa-hand-point-right"></i> At checkout
                  counters
                </button>
                <br />
                <button>
                  <i className="fa-regular fa-hand-point-right"></i> With PayPal
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="title">Feedback</div>
        <Feedback />
      </div>
    </div>
  );
};

export default MovieDetail;
