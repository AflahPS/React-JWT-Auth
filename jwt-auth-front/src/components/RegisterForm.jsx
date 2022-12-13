import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import swal from "sweetalert";
import axios from "../utils/axios.js";
import { tokenActions } from "../store/tokenSlice";
import { AuthActions } from "../store/authSlice";
import { userActions } from "../store/userSlice";

function RegisterForm() {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const regForm = useRef(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const name = regForm.current.name.value;
      const email = regForm.current.email.value;
      const password = regForm.current.password.value;
      const passwordConfirm = regForm.current.passwordConfirm.value;

      const res = await axios({
        url: "user/signup",
        method: "POST",
        data: {
          name,
          email,
          password,
          passwordConfirm,
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
        <h2>REGISTER</h2>
      </div>
      <form ref={regForm}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Name
          </label>
          <input type="text" name={"name"} className="form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="email"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input name="password" type="password" className="form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Repeat Password
          </label>
          <input
            type="password"
            name="passwordConfirm"
            className="form-control"
          />
        </div>
      </form>
      <div className="text-center my-4">
        <button onClick={handleRegister} className="btn btn-lg btn-success">
          Register
        </button>
      </div>
      <div className="d-flex justify-content-center">
        <p className="mx-2 my-auto">Alredy registered ? Login </p>
        <button
          className="btn btn-outline-primary"
          onClick={() => nav("/login")}
        >
          Login
        </button>
      </div>
    </React.Fragment>
  );
}

export default RegisterForm;
