import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../asset/logo.png";
import hexagonImage from "../asset/hexagon.png";
import "./SignIn.css";

export function SignInPage() {
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState<string | null>(null);

  return (
    <div className="signin-container">
      <div className="gradient-blur"></div>

      {/* LEFT SIDE */}
      <div className="signin-left-wrapper">
        <img
          src={logoImage}
          alt="Rooms Hive Logo"
          className="signin-left-logo"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="signin-right-side">
        <div className="signin-form-wrapper">
          {/* ICON */}
          <div className="hexagon-container">
            <img src={hexagonImage} className="hexagon-icon" alt="Hexagon" />
          </div>

          {/* TITLE */}
          <h1 className="signin-title">Create Account</h1>
          <p className="signin-subtitle">
            Join us and start your journey today
          </p>

          {/* FORM */}
          <form className="signin-form">
            {/* FIRST NAME */}
            <div className="signin-field-group">
              <label
                className={`signin-label ${
                  activeField === "first" ? "label-active" : ""
                }`}
              >
                FIRST NAME
              </label>

              <input
                type="text"
                placeholder="Enter your first name"
                onFocus={() => setActiveField("first")}
                onBlur={() => setActiveField(null)}
                className={`signin-input ${
                  activeField === "first" ? "input-active" : ""
                }`}
              />
            </div>

            {/* SECOND NAME */}
            <div className="signin-field-group">
              <label
                className={`signin-label ${
                  activeField === "second" ? "label-active" : ""
                }`}
              >
                SECOND NAME
              </label>

              <input
                type="text"
                placeholder="Enter your second name"
                onFocus={() => setActiveField("second")}
                onBlur={() => setActiveField(null)}
                className={`signin-input ${
                  activeField === "second" ? "input-active" : ""
                }`}
              />
            </div>

            {/* USERNAME */}
            <div className="signin-field-group">
              <label
                className={`signin-label ${
                  activeField === "username" ? "label-active" : ""
                }`}
              >
                USERNAME
              </label>

              <input
                type="text"
                placeholder="Choose a username"
                onFocus={() => setActiveField("username")}
                onBlur={() => setActiveField(null)}
                className={`signin-input ${
                  activeField === "username" ? "input-active" : ""
                }`}
              />
            </div>

            {/* EMAIL */}
            <div className="signin-field-group">
              <label
                className={`signin-label ${
                  activeField === "email" ? "label-active" : ""
                }`}
              >
                EMAIL
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                onFocus={() => setActiveField("email")}
                onBlur={() => setActiveField(null)}
                className={`signin-input ${
                  activeField === "email" ? "input-active" : ""
                }`}
              />
            </div>

            {/* PASSWORD */}
            <div className="signin-field-group">
              <label
                className={`signin-label ${
                  activeField === "password" ? "label-active" : ""
                }`}
              >
                PASSWORD
              </label>

              <input
                type="password"
                placeholder="Create a password"
                onFocus={() => setActiveField("password")}
                onBlur={() => setActiveField(null)}
                className={`signin-input ${
                  activeField === "password" ? "input-active" : ""
                }`}
              />
            </div>

            {/* TERMS */}
            <div className="terms-wrapper">
              <input type="checkbox" className="terms-check" />
              <p className="terms-text">
                I agree to the <span>Terms of Service</span> and{" "}
                <span>Privacy Policy</span>
              </p>
            </div>

            {/* BUTTON */}
            <button type="submit" className="signin-btn">
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>or</span>
          </div>

          {/* SIGN IN LINK */}
          <div className="signin-login-wrapper">
            <p className="signin-login-text">Already have an account?</p>
            <button
              onClick={() => navigate("/login")}
              className="signin-login-link"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
