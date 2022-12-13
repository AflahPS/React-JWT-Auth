import React from "react";
import Card from "../components/Card";
import RegisterForm from "../components/RegisterForm";

function Register() {
  return (
    <div>
      <Card addClass={"w-50 mt-5"}>
        <RegisterForm />
      </Card>
    </div>
  );
}

export default Register;
