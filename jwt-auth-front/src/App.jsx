import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./Pages/Home";
import Login from "./Pages/LoginPage";
import Register from "./Pages/RegisterPage";
import Profile from "./Pages/Profile";
import Users from "./Pages/Users";
import ErrorPage from "./Pages/ErrorPage";

import style from "./App.module.css";

function App() {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const user = useSelector((state) => state.user.userData);

  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          {isAuth && <Route exact path="/profile" element={<Profile />} />}
          {isAuth && user && user.role === "admin" && (
            <Route exact path="/users" element={<Users />} />
          )}
          {!isAuth && <Route exact path="/login" element={<Login />} />}
          {!isAuth && <Route exact path="/register" element={<Register />} />}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
