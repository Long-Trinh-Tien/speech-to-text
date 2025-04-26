import React, { useState, useEffect, useRef } from "react";
import "./css/Login.css";
import { useNavigate } from "react-router-dom";
import { sendLoginMessageToBackend } from "../function/sendMessageToBackend";

export default function Register() {
  return (
    <div className="login-container">
      <h2>Register</h2>
      <form>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" required />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input type="password" id="confirm-password" required />
        </div>
        <div className="button-container">
          <button type="submit">Register</button>
          <a href="/login">Already have an account?</a>
        </div>
      </form>
    </div>
  );
}
