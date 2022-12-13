import React from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/Card";

function ErrorPage() {
  const nav = useNavigate();
  return (
    <Card>
      <div className="text-center">
        <h1>Oops</h1>
        <h4>404 Not found !</h4>
        <button className="btn btn-dark btn-lg my-4" onClick={() => nav("/")}>
          Go back to HOME
        </button>
      </div>
    </Card>
  );
}

export default ErrorPage;
