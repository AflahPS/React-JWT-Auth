import React, { useRef } from "react";
import swal from "sweetalert";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";
import { tokenActions } from "../store/tokenSlice";
import { AuthActions } from "../store/authSlice";
import { userActions } from "../store/userSlice";

function LoginForm() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const loginForm = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const email = loginForm.current.email.value;
      const password = loginForm.current.password.value;

      const res = await axios({
        url: "user/login",
        method: "POST",
        data: {
          email,
          password,
        },
      });

      if (res.data.status === "success") {
        dispatch(tokenActions.setToken(res.data.token));
        dispatch(userActions.setUser(res.data.user));
        dispatch(AuthActions.login());
        nav("/");
      } else {
        swal("Oops!", `${res.data.message}`, "error");
      }
    } catch (err) {
      console.log(err);
      swal("Oops!", err?.response?.data?.message || err.message, "error");
    }
  };

  return (
    <React.Fragment>
      <div className="my-3 text-center">
        <h2>LOG-IN</h2>
      </div>
      <form ref={loginForm}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name={"email"}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name={"password"}
          />
        </div>
      </form>
      <div className="text-center my-4">
        <button onClick={handleLogin} className="btn btn-lg btn-success">
          Login
        </button>
      </div>
      <div className="d-flex justify-content-center">
        <p className="mx-2 my-auto">Not yet registered ? Register now </p>
        <button
          className="btn btn-outline-primary"
          onClick={() => nav("/register")}
        >
          Register
        </button>
      </div>
    </React.Fragment>
  );
}

export default LoginForm;
