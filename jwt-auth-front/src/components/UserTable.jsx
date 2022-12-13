import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import swal from "sweetalert";
import { allUsersActions } from "../store/allUsersSlice";
import Card from "./Card";
import axios from "../utils/axios";
import style from "./Style.module.css";

function UserTable() {
  const token = useSelector((state) => state.jwt.token);
  const users = useSelector((state) => state.allUsers.users);
  const dispatch = useDispatch();

  // SUSPEND_HANDLER
  const handleSuspend = async (id, e) => {
    try {
      console.log(e.target.innerHTML);
      const isConfirmed = await swal({
        title: "Are you sure?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (!isConfirmed) return;

      const res = await axios({
        url: `/user/ban/${id}`,
        method: "PATCH",
        headers: {
          authorization: "Bearer " + token,
        },
      });

      if (res.data.status === "success") {
        e.target.innerHTML = e.target.innerHTML === "Ban" ? "Unban" : "Ban";
        swal("Success!", "Profile edited successfully !", "success");
      }
    } catch (err) {
      console.log(err);
      swal("Sorry!", err.message, "error");
    }
  };

  // DELETE_HANDLER
  const handleDelete = async (id, e) => {
    try {
      const isConfirmed = await swal({
        title: "Are you sure?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (!isConfirmed) return;

      const res = await axios({
        url: `/user/${id}`,
        method: "DELETE",
        headers: {
          authorization: "Bearer " + token,
        },
      });

      if (res.data.status === "success") {
        swal("Success!", "User deleted successfully !", "success");
        e.target.parentNode.parentNode.parentNode.removeChild(
          e.target.parentNode.parentNode
        );
      }
    } catch (err) {
      console.log(err);
      swal("Sorry!", err.message, "error");
    }
  };

  // GET /users
  const userFetch = async () => {
    const res = await axios({
      url: "user/all",
      method: "GET",
      headers: { authorization: token ? "Bearer " + token : "" },
    });
    dispatch(allUsersActions.setAllUsers(res.data.data));
  };

  useEffect(() => {
    userFetch();
  }, []);

  return (
    <Card addClass={"mx-5"}>
      <div className="text-light text-center my-4">
        <h2>Users</h2>
      </div>
      <table className="table table-dark table-hover p-3">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        {users &&
          users.map((user, index) => (
            <tbody key={user._id}>
              <tr>
                <th scope="row">
                  <img className={style.userImage} src={user.image} alt="" />
                </th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    onClick={(e) => handleSuspend(user._id, e)}
                    className="btn btn-sm btn-outline-warning"
                  >
                    {user.isBanned ? "Unban" : "Ban"}
                  </button>
                </td>
                <td>
                  <button
                    onClick={(e) => handleDelete(user._id, e)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
      </table>
    </Card>
  );
}

export default UserTable;
