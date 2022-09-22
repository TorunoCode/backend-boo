import React, { useState } from "react";
import "../../sass/components/subcomponents/login.scss";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";
// Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const Login = ({ ModalLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    const newUser = {
      email: email,
      password: password,
    };
    loginUser(newUser, dispatch, navigate);
  };
  const is = useSelector((Diff) => Diff.auth.login?.isFetching);

  // Toast
  const notify = () => {
    if (is === false) {
    } else {
      toast.success("Login success!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  return (
    <div className="modal_login">
      <div className="row_top">
        <div className="title">Welcome to FixGo</div>
        <div className="title_login">Sign In</div>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email.."
            className="input_data"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password.."
            className="input_data"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex">
            <div className="label_checkbox">
              <input type="checkbox" />
              &nbsp;Remember me
            </div>
            <Link to="/" className="forgot">
              Forgot password?
            </Link>
          </div>
          <button className="btnLogin" onClick={notify}>
            Login
          </button>
        </form>
      </div>

      <div className="row_bot">
        <div className="txt_signup">
          Don't have an account?&nbsp;
          <div className="link" onClick={() => ModalLogin(false)}>
            Sign Up
          </div>
        </div>
        <div className="txt">--- or sign in with ---</div>
        <div className="login_icon">
          <i class="fa-brands fa-facebook-f">acebook</i>&emsp;
          <i class="fa-brands fa-google">oogle</i>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
