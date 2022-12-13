import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
function Home() {
  const user = useSelector((state) => state.user.userData);

  return (
    <div>
      <Navbar />
      <Card addClass={"w-75"}>
        <div className="text-center">
          <h2 className="text-light">Hi {user && user.name.toUpperCase()} !</h2>
        </div>
      </Card>
    </div>
  );
}

export default Home;
