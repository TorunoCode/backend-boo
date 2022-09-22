import React, { useState } from "react";
import "../sass/pages/movieDetail.scss";
import StarRating from "../components/subcomponents/StarRating.jsx";
import Feedback from "../components/subcomponents/Feedback";
// import datafakeMovie from "../components/datafakeMovie";

const MovieDetail = () => {
  const [description, setDescription] = useState(true);
  const [payment, setPayment] = useState(false);
  return (
    // bấm thả xuống description
    <div className="detail">
      <div className="main">
        <div className="title">Movie Details</div>
        <div className="detailmovie">
          <div className="info">
            <img
              src="https://www.cgv.vn/media/catalog/product/cache/3/image/c5f0a1eff4c394a251036189ccddaacd/c/t/ctd_social-teaser-poster_vi_1_.jpg"
              alt=""
            />
            <div className="info-text">
              <div className="name">CONTORTED</div>
              <div className="rate">
                <StarRating rating={5.6} />
                <div className="rating">5.6/10</div>
              </div>
              <div className="text">
                <b>Director:</b> abc <br />
                <b>Cast:</b> abc <br />
                <b>Genre:</b> abc <br />
                <b>Release time:</b> abc <br />
                <b>Running time:</b> abc <br />
                <b>Language:</b> abc <br />
              </div>
            </div>
          </div>
          <div className="video_ytb">
            <iframe
              width="480"
              height="270"
              src="https://www.youtube.com/embed/174AjBZHkkU"
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
              class="fa-solid fa-caret-down"
            ></i>
          </div>
          {description && (
            <p>
              &emsp; &emsp; Myeong-hye and Hyun-min move to the countryside with
              their three kids due to a financial problem. Their new house seems
              great on the outside but it feels somewhat ominous at the same. On
              the first day at the new house, Myeong-hye feels unsettling energy
              and struggles with a nightmare. Moreover, she keeps hearing the
              strange sound from the shed next to the house, which is locked up
              tightly. While Myeong-hye is concerned about all incidents that
              have happened at home, Hyun-min just brushes her off. In the midst
              of the parents' conflict, three kids grow anxious. Slowly driven
              crazy by the unknown strange sound, Myeong-hye meets a suspicious
              neighbor Eun-young, who tells her that the house is 'contorted'.
              With nightmares growing worse each day, the family finally faces a
              secret buried deep within their home.
            </p>
          )}
        </div>
        <div className="title">Booking</div>
        <div className="selectMovie">
          <div className="col-1">
            <div className="col-1-text">
              Movie: <br /> Date: <br />
              Time:
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
              <i class="fa-solid fa-angles-right"></i> Buy Ticket
            </button>
            {payment && (
              <div className="optionpay">
                <div>Select Payment Method</div>
                <button>
                  <i class="fa-regular fa-hand-point-right"></i> At checkout
                  counters
                </button>
                <br />
                <button>
                  <i class="fa-regular fa-hand-point-right"></i> With PayPal
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
