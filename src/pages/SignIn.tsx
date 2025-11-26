import React from "react";
import logoImage from "../asset/logo.png";
import "./SignIn.css";

const SignIn: React.FC = () => {
  return (
    <div className="signin-container">
      {/* Left side - Logo */}
      <div className="signin-left-side">
        <img
          src={logoImage}
          alt="Rooms Hive Logo"
          className="signin-logo"
        />
      </div>

      {/* Right side - Sign up form */}
      <div className="signin-right-side">
        <div className="signin-form-wrapper">
          {/* Title */}
          <h1 className="signin-title">
            Sign up
          </h1>

          {/* Form */}
          <form className="signin-form">
            {/* Username field */}
            <div>
              <label className="signin-label">
                Username
              </label>
              <input
                type="text"
                placeholder="Example username"
                className="signin-input"
              />
            </div>

            {/* Password field */}
            <div>
              <label className="signin-label">
                Password
              </label>
              <input
                type="password"
                placeholder="**********"
                className="signin-input"
              />
            </div>

            {/* Email field */}
            <div>
              <label className="signin-label">
                Email
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="signin-input"
              />
            </div>
          </form>

          {/* Bottom links */}
          <div className="signin-actions">
            <a
              href="#"
              className="signin-action-link"
            >
              Login
            </a>
            <a
              href="#"
              className="signin-action-link"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
