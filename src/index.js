import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import axios from "axios";
import qs from "qs";
const root = document.querySelector("#root");

const App = () => {
  const [auth, setAuth] = useState({});

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState("");

  const [roles, setRoles] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    findUserFromToken();
  }, []);

  useEffect(() => {
    axios.get("/api/users").then(response => setUsers(response.data));
  }, []);

  useEffect(() => {
    axios.get("/api/roles").then(response => setRoles(response.data));
  }, []);

  const findUserFromToken = () => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      return;
    }
    axios
      .get("api/auth", {
        headers: {
          authentication: token
        }
      })
      .then(response => setAuth(response.data))
      .catch((ex = console.log(ex)));

    console.log(token);
  };

  const onSubmit = async ev => {
    ev.preventDefault();
    const credentials = {
      username,
      password
    };
    console.log(credentials);

    axios
      .post("/api/auth", credentials)
      .then(response => {
        //console.log(response.data.token)
        window.localStorage.setItem("token", response.data.token);
        findUserFromToken();
      })
      .catch(ex => {
        //console.log(ex));
        setError("bad credentials");
      });
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    setAuth({});
    setError("");
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <ul>
        {roles.map(role => {
          if (role.role_name === false) {
            return <li>{role}</li>;
          }
        })}
      </ul>

      <h1>Auth App</h1>
      {!auth.id && (
        <form onSubmit={onSubmit}>
          <h2>Login</h2>
          <div className="error">{error}</div>
          <input
            value={username}
            onChange={ev => setUsername(ev.target.value)}
          />
          <input
            type="password"
            value={password}
            onChange={ev => setPassword(ev.target.value)}
          />
          <button>Save</button>
        </form>
      )}

      {auth.id && <button onClick={logout}>Logout {auth.username}</button>}
    </div>
  );
};

render(<App />, root);
