import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../asset/logo.png";
import hexagonImage from "../asset/hexagon.png";
import "./Login.css";

export function LoginPage() {
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState<
    "username" | "password" | null
  >(null);

  return (
    <div className="login-container">
      <div className="gradient-blur"></div>

      {/* LEFT SIDE */}
      <div className="login-left-wrapper">
        <img
          src={logoImage}
          alt="Rooms Hive Logo"
          className="login-left-logo"
        />
      </div>
      {/* RIGHT SIDE */}
      <div className="login-right-side">
        <div className="login-form-wrapper">
          {/* ICON */}
          <div className="hexagon-container">
            <img src={hexagonImage} className="hexagon-icon" alt="Hexagon" />
          </div>

          {/* TITLE */}
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to continue to your account</p>

          {/* FORM */}
          <form className="login-form">
            {/* USERNAME */}
            <div className="login-field-group">
              <label
                className={`login-label ${
                  activeField === "username" ? "label-active" : ""
                }`}
              >
                USERNAME
              </label>

              <input
                type="text"
                placeholder="Enter your username"
                onFocus={() => setActiveField("username")}
                onBlur={() => setActiveField(null)}
                className={`login-input ${
                  activeField === "username" ? "input-active" : ""
                }`}
              />
            </div>

            {/* PASSWORD */}
            <div className="login-field-group">
              <label
                className={`login-label ${
                  activeField === "password" ? "label-active" : ""
                }`}
              >
                PASSWORD
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                onFocus={() => setActiveField("password")}
                onBlur={() => setActiveField(null)}
                className={`login-input ${
                  activeField === "password" ? "input-active" : ""
                }`}
              />
            </div>

            {/* Forgot password */}
            <div className="forgot-wrapper">
              <button type="button" className="forgot-text">
                Forgot password?
              </button>
            </div>

            {/* BUTTON */}
            <button type="submit" className="login-btn">
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>or</span>
          </div>

          {/* SIGN UP */}
          <div className="signup-wrapper">
            <p className="signup-text">Don’t have an account? </p>
            <button
              onClick={() => navigate("/signin")}
              className="signup-link"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
