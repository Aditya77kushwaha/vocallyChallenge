import React, { useState, useEffect } from "react";
import Login from "./pages/login/Login";
import Home from "./components/home/Home";
import Header from "./components/header/Header";
import Register from "./pages/register/Register";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

function App() {
  const [client, setclient] = useState({});
  const x = JSON.parse(localStorage.getItem("client"));
  useEffect(() => {
    setclient(x);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="App">
      <Router>
      <Header client={client} setclient={setclient} />
        <Switch>
          <Route exact path="/">
            {client?.username ? (
              <Home client={client} setclient={setclient} />
            ) : (
              <Register />
            )}
          </Route>
          <Route path="/login">
            {client?.username ? (
              <Redirect to="/" />
            ) : (
              <Login client={client} setclient={setclient} />
            )}
          </Route>
          <Route path="/register">
            {client?.username ? (
              <Redirect to="/" />
            ) : (
              <Register client={client} setclient={setclient} />
            )}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
