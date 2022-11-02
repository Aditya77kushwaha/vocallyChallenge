import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Register.css";
import { axiosInstance } from "../../config";

const Register = () => {
  const [user, setuser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const history = useHistory();
  const handleChange = (e) => {
    setuser((prevVal) => ({ ...prevVal, [e?.target?.name]: e?.target?.value }));
  };
  return (
    <div className="register">
      <h2>Signup Here</h2>
      <input
        className="username"
        type="text"
        name="username"
        value={user.username}
        placeholder="username"
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        value={user.email}
        placeholder="email"
        className="email"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        value={user.password}
        placeholder="password"
        className="password"
        onChange={handleChange}
      />
      <button
        className="register-btn"
        onClick={() => {
          console.log(user);
          axiosInstance.post("register", user).then((res) => {
            history.push("/login");
          });
        }}
      >
        Register
      </button>
    </div>
  );
};

export default Register;
