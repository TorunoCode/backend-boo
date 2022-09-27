import React from "react";
import "../sass/components/footer.scss";

const Footer = () => {
  return (
    <div className="footer">
      <div className="main">
        <div className="col">
          <div className="title"> &emsp;Introduce</div>
          <ul>
            <li>
              <i className="fa-solid fa-angles-right"></i> About us
            </li>
            <li>
              <i className="fa-solid fa-angles-right"></i> Terms of Use
            </li>
            <li>
              <i className="fa-solid fa-angles-right"></i> Oparating Regulation
            </li>
            <li>
              <i className="fa-solid fa-angles-right"></i> Privacy Policy
            </li>
          </ul>
        </div>
        <div className="col">
          <div className="title"> &emsp;Cinema Blog</div>
          <ul>
            <li>
              <i className="fa-solid fa-angles-right"></i> Movie genre
            </li>
            <li>
              <i className="fa-solid fa-angles-right"></i> Movie Review
            </li>
            <li>
              <i className="fa-solid fa-angles-right"></i> Movie blog
            </li>
            <li>
              <i className="fa-solid fa-angles-right"></i> Hot Movie
            </li>
          </ul>
        </div>
        <div className="col">
          <div className="title"> &emsp;Support</div>
          <ul>
            <li>
              <i className="fa-solid fa-angles-right"></i> Feedback
            </li>
            <li>
              <i className="fa-solid fa-angles-right"></i> Sale & Service
            </li>
            <li>
              <i className="fa-solid fa-angles-right"></i> Cinema/Ticket
            </li>
            <li>
              <i className="fa-solid fa-angles-right"></i> Career
            </li>
          </ul>
        </div>
        <div className="col">
          <div className="title"> &emsp;Customer Service</div>
          <div className="info">
            Hotline: 0862.xxx.xxx <br />
            Email support: hoidap@fixgo.vn <br />
            Flollow Us
            <br />
            <i className="fa-brands fa-square-facebook"></i>&emsp;
            <i className="fa-brands fa-square-youtube"></i>&emsp;
            <i className="fa-brands fa-instagram"></i>&emsp;
            <i className="fa-brands fa-square-twitter"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
