import React from "react";
import Navbar from "../components/Navbar";
import UserTable from "../components/UserTable";

function Users() {
  return (
    <div className="text-light">
      <Navbar />
      <UserTable />
    </div>
  );
}

export default Users;
