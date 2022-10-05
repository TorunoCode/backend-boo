import React, { useState } from "react";
import { registerUser } from "../../redux/apiRequest";
import "../../sass/components/subcomponents/register.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
// const Register = ({ ModalLogin, ModalRegister }) => {
const Register = ({ ModalLogin }) => {
  // vì onclick chỉ xử lí 1 event --> tạo hàm ngoài chạy 2 event cùng lúc
  // function someFunc() {
  //   ModalLogin(true);
  // }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleRegister = (e) => {
    e.preventDefault();
    const newUser = {
      email: email,
      password: password,
      name: username,
      isActive: 0,
      isAdmin: false,
    };
    registerUser(newUser, dispatch,toast, navigate);
  };
  return (
    <div className="modal_register">
      <div className="row_top">
        <div className="title">Welcome to FixGo</div>
        <div className="title_register">Sign Up</div>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email address.."
            className="input_data"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password.."
            className="input_data"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username.."
            className="input_data"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button className="btnLogin">Register</button>
        </form>
      </div>
      <div className="row_bot">
        <div className="txt_signup">
          Have already an account?&nbsp;
          {/* <div className="link" onClick={someFunc}> */}
          <div className="link" onClick={() => ModalLogin(true)}>
            Sign In
          </div>
        </div>
        <div className="txt">--- or sign in with ---</div>
        <div className="login_icon">
          <i className="fa-brands fa-facebook-f">acebook</i>&emsp;
          <i className="fa-brands fa-google">oogle</i>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
