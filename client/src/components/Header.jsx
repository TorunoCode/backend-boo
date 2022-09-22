import React, { useState } from "react";
import "../sass/components/header.scss";
import { Link } from "react-router-dom";
import FormModal from "./subcomponents/FormModal.jsx";
import { useSelector } from "react-redux";

const Header = () => {
  const [openModal, setOpenModal] = useState(false);
  const [afterlogin, setAfterLogin] = useState(false);

  // const [user, setUser] = useState(null);
  const user = useSelector((state) => state.auth.login?.currentUser);

  return (
    <div className="header">
      <div className="main">
        <div className="logo">FixGo</div>
        <div className="navbar">
          <ul>
            <Link to="/Home">
              <li>Home</li>
            </Link>
            <Link to="/Movie">
              <li>
                <i class="fa-solid fa-film"></i> Movie
              </li>
            </Link>
            <Link to="/Event">
              <li>
                <i class="fa-brands fa-hotjar"></i> Event
              </li>
            </Link>
            <li>
              <i class="fa-solid fa-headset"></i> Suport
            </li>
          </ul>
        </div>
        <div className="search">
          <form action="" className="formsearch">
            <input
              className="ipsearch"
              type="text"
              placeholder="Search by movie.."
              name="search"
            />
            <div>
              <i class="fa-solid fa-magnifying-glass"></i>
            </div>
          </form>
        </div>
        {user ? (
          <button
            className="login"
            onClick={() => {
              setAfterLogin(true);
            }}
          >
            {user.data.name}
          </button>
        ) : (
          <button
            className="login"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            <i class="fa-solid fa-user"></i> Login
          </button>
        )}
      </div>

      {user ? <></> : openModal && <FormModal closeModal={setOpenModal} />}
    </div>
  );
};

export default Header;
