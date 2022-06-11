import React, { Component, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import { signInWithGoogle } from "../../../firebase/firebase";
import { UserContext } from "../../../user-context";
import axios from "axios";
import { updateSystemTimeApi } from "../../Utilities/apis";
import moment from "moment";
import { backendURL } from "../../../config";
import NewNavBar from "../NavBar/NewNavBar";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userDetail, setUserDetail] = useState({});

  const userCtx = React.useContext(UserContext);

  const submitForm = (e) => {
    e.preventDefault();
    let payload = {
      email: email,
      password: password,
    };
    console.log(payload);
    const signInApi = async () => {
      await axios
        .post(`${backendURL}/users/signin`, payload)
        .then((response) => {
          console.log("response:", response.data);
          navigate("/event");
          localStorage.setItem("userId", response?.data?.userId);
          localStorage.setItem("city", response?.data?.address?.city);
          localStorage.setItem("accountType", response?.data?.accountType);
          localStorage.setItem("user", JSON.stringify(response.data));
          const time = moment(new Date()).format("yyyy-MM-DDThh:mm");
          localStorage.setItem("systemTime", time);
          // update Events db
          updateSystemTimeApi(time);
        })
        .catch((error) => {
          console.log(error);
          alert(error?.response?.data?.message);
        });
    };
    signInApi();
  };

  const handleGoogleSignIn = () => {
    const success = signInWithGoogle(function (flag, data) {
      userCtx.setUserContext(data);
      console.log(data);
      if (flag) {
        navigate("/event");
      } else {
        navigate("/signup");
      }
    });
  };
  return (
    <div>
        <NewNavBar />
      <div className="signIncenter">
        <h1> Login</h1>
        <form method="post">
          <div className="txt_field">
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            ></input>
            <label>Email</label>
          </div>
          <div className="txt_field">
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            ></input>
            <label>Password</label>
          </div>
          <div className="pass">Forgot Password?</div>
          <input type="submit" onClick={submitForm} value="Login"></input>
          <div className="signup_link_signup">
            Not a member?{" "}
            <a href="#" onClick={() => navigate("/signup")}>
              Signup
            </a>
          </div>
          <button onClick={handleGoogleSignIn} className="signInGoogle">
            Sign In with Google
          </button>
        </form>
      </div>
    </div>
  );
};
export default SignIn;
