import axios from "axios";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "./authSlice";

export const loginUser = async (user, dispatch,toast, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(
      "/api/user/login",
      user
    );
    if(res.data)
    {
    toast.success("Login success!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    dispatch(loginSuccess(res.data));
     navigate("/");
     return res.data;
  }
  else {
    return toast.message("Please create new account for this information !!!");
  
  }
  } catch (err) {
    toast.error(err.response.data.message);
    dispatch(loginFailed());
  }
};

export const registerUser = async (user, dispatch,toast, navigate) => {
  dispatch(registerStart());
  try { 
    const res = await axios.post(
      "/api/user/signUp",
      user
    ); 
    if(res.data)
    {
    toast.success("Sign Up success!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    }); 
    registerSuccess(res.data);
     navigate("/");
     return res.data;
  } 
  } catch (err) {
   toast.error(err.response.data.message);
    dispatch(registerFailed());
  }
};
