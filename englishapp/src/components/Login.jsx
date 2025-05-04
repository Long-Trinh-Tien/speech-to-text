import React, { useState, useEffect, useRef, useContext } from "react";
import { sendLoginMessageToBackend } from "../function/sendMessageToBackend";
import "./css/Login.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../function/UserContext.jsx";
export default function LogIn(props) {
  // Use useContext to get username from UserContext, change it to setGlobalUsername to prevent confusion
  // between the local state and the global state
  const { setUsername: setGlobalUsername } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    // Bắt đầu loading
    setLoading(true);
    setError("");
    try {
      const status = await sendLoginMessageToBackend(username, password);
      if (status) {
        props.loginStatusChange(true);
		setGlobalUsername(username); // Set the global username to the logged-in username
        navigate("/main");
      } else {
        setError("Invalid username or password.");
      }
    } catch (error) {
      setError(error.error || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="button-container">
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <a href="/register">Don't have account?</a>
        </div>
      </form>
    </div>
  );
}
