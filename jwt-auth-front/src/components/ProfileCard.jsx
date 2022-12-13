import axios from "../utils/axios";
import React, { useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import swal from "sweetalert";

import Card from "./Card";
import defaultUser from "../utils/constant";
import { userActions } from "../store/userSlice";
import style from "./Style.module.css";
import { useEffect } from "react";

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

function ProfileCard() {
  const user = useSelector((state) => state.user.userData);
  const token = useSelector((state) => state.jwt.token);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [image, setImage] = useState(defaultUser);
  const dispatch = useDispatch();

  useEffect(() => {
    user && setName(user.name);
    user && setEmail(user.email);
    user && setImage(user.image);
  }, []);

  const editHandler = () => {
    setIsEditable(!isEditable);
  };

  const handleChangeImage = useCallback(async (e) => {
    const image = e.target.files[0];
    const image64 = await convertToBase64(image);
    setImage(`data:${image64}`);
  });

  const submitHandler = useCallback(async () => {
    try {
      const res = await axios({
        url: `user/${user._id}`,
        method: "PATCH",
        data: { name, email, image },
        headers: token
          ? {
              authorization: `Bearer ${token}`,
            }
          : "",
      });
      console.log(res.data);
      if (res.data.status === "success") {
        console.log(res.data.data.doc);
        dispatch(userActions.setUser(res.data.data.doc));
        setIsEditable(!isEditable);
        swal("Success!", "Profile edited successfully !", "success");
      } else {
        swal("Oops!", `${res.data.message}`, "error");
      }
    } catch (err) {
      console.log(err);
      swal("Oops!", `${err.message}`, "error");
    }
  });

  return (
    <Card addClass={"w-75"}>
      <form encType={"multipart/form-data"}>
        <div className="text-center mb-5">
          <img src={image} className={style.profile} alt="..." />
        </div>

        <div className="mb-3 row">
          <label
            htmlFor="staticEmail"
            className="col-sm-2 col-form-label text-light"
          >
            Email
          </label>
          <div className="col-sm-10">
            <input
              type="email"
              readOnly={!isEditable}
              className="form-control"
              name={"email"}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label
            htmlFor="staticEmail"
            className="col-sm-2 col-form-label text-light"
          >
            Name
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              readOnly={!isEditable}
              className="form-control"
              onChange={(e) => setName(e.target.value)}
              name={"name"}
              value={name}
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="formFile" className="form-label">
            Profile picture
          </label>
          <input
            className="form-control"
            disabled={!isEditable}
            name={"image"}
            type="file"
            id="formFile"
            onChange={handleChangeImage}
            placeholder={user && user.image}
          />
        </div>
      </form>
      <div className="mb-3 d-flex justify-content-around">
        <button
          disabled={!isEditable}
          onClick={submitHandler}
          className="btn btn-lg btn-dark"
        >
          Submit
        </button>
        <button
          disabled={isEditable}
          onClick={editHandler}
          className="btn btn-lg btn-dark"
        >
          Edit
        </button>
      </div>
    </Card>
  );
}

export default ProfileCard;
