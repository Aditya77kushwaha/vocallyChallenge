import React from "react";
import { useHistory, Link } from "react-router-dom";
import "./Header.css";

const Header = ({ client, setclient }) => {
  const history = useHistory();
  return (
    <div className="topnav">
      {client?.username ? (
        <>
          <div className="usename">
            <div className="username1">
              <p style={{ fontSize: "20px", color: "#ffff" }}>
                Hi {client?.username}
              </p>
            </div>
          </div>
          <div className="button-container">
            <div className="button-container1">
              <button
                className="login-button"
                onClick={() => {
                  localStorage.clear();
                  setclient({});
                  history?.push("/login");
                }}
              >
              <p>Logout</p> 
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="loglink">
          <div className="loglink1">
            <Link className="link-text" to="/login" style={{textDecoration: 'none'}}>
            
              <span>Login</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
