import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import swal from "sweetalert";
import axios from "../utils/axios";
import { tokenActions } from "../store/tokenSlice";
import { AuthActions } from "../store/authSlice";
import { userActions } from "../store/userSlice";
import { allUsersActions } from "../store/allUsersSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const user = useSelector((state) => state.user.userData);
  const token = useSelector((state) => state.jwt.token);

  // LOGOUT_HANDLER
  const logoutHandler = async (e) => {
    e.preventDefault();
    const res = await axios.get("/user/logout");
    if (res.data.status === "success") {
      dispatch(tokenActions.setToken(res.data.token));
      dispatch(userActions.unSetUser());
      dispatch(AuthActions.logout());
      navigate("/");
    }
  };

  // SEARCH_HANDLER
  const searchHandler = async (tag) => {
    try {
      if (tag === "") return;
      const res = await axios({
        url: `/user/search-users/${tag.toLowerCase()}`,
        method: "GET",
        headers: { authorization: "Bearer " + token },
      });
      if (res.data.status === "success") {
        navigate("/users");
        dispatch(allUsersActions.setAllUsers(res.data.users));
      } else {
        swal("Sorry!", res.data.message, "error");
      }
    } catch (err) {
      console.log(err.message);
      swal("Sorry!", err.message, "error");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-dark">
      <div className="container-fluid">
        <div className="d-flex justify-content-between w-100">
          <div>
            <a className="navbar-brand text-danger" href="#">
              Brand
            </a>

            <a className="btn btn-dark ms-5" onClick={() => navigate("/")}>
              Home
            </a>
            {isAuth && (
              <a
                className="btn btn-dark ms-5"
                onClick={() => navigate("/profile")}
              >
                Profile
              </a>
            )}
            {user && user.role == "admin" && (
              <a
                className="btn btn-dark ms-5"
                onClick={() => navigate("/users")}
              >
                Users
              </a>
            )}
          </div>
          {user && user.role == "admin" && (
            <div>
              <form className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search users by email.."
                  aria-label="Search"
                  onChange={(e) => searchHandler(e.target.value)}
                />
              </form>
            </div>
          )}
          <div>
            {!isAuth && (
              <a
                className="btn btn-dark ms-5"
                onClick={() => navigate("/login")}
              >
                Login
              </a>
            )}

            {isAuth && user && (
              <a
                className="btn btn-dark ms-5"
                onClick={() => navigate("/profile")}
              >
                {user.name.toUpperCase()}
              </a>
            )}

            {isAuth && (
              <a
                className="btn btn-dark ms-5"
                onClick={logoutHandler}
                aria-current="page"
              >
                Logout
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
