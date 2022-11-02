import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import "./Login.css";
import { axiosInstance } from "../../config";

const Login = ({ client, setclient }) => {
  const [user, setuser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [islogin, setislogin] = useState(false);

  const history = useHistory();
  const handleChange = (e) => {
    setuser((prevVal) => ({ ...prevVal, [e?.target?.name]: e?.target?.value }));
  };

  return (
    <div class="form">
      <h2>Login Here</h2>
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
        className="login-btn"
        onClick={() => {
          setislogin(true);
          axiosInstance
            .post("login", user)
            .then((res) => {
              setclient(res.data);
              localStorage.setItem("client", JSON.stringify(res.data));
            })
            .catch((e) => {
              console.log("LOGIN ERROR", e);
            })
            .finally(() => {
              setislogin(false);
              history.push("/");
            });
        }}
        disabled={islogin}
      >
        Login
        {islogin && (
          <>
            <span
              className="spinner-border spinner-border-sm ms-2"
              role="status"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Loading...</span>
          </>
        )}
      </button>
      <p class="link">
        {" "}
        <b> Don't have an account</b> <br />
        <Link to=""> Sign Up here</Link>
      </p>
    </div>
  );
};

export default Login;
