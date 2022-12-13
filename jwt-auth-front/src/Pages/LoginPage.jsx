import React from "react";

import Card from "../components/Card";
import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <div>
      <Card addClass={"w-50 mt-5"}>
        <LoginForm />
      </Card>
    </div>
  );
}

export default Login;
