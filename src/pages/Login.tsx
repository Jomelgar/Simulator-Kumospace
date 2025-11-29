import React from "react";
import logoImage from "../asset/logo.png";
import hexagonImage from "../asset/hexagon.png"; // ajustá el nombre según tu asset
import "./Login.css";

interface LoginProps {
  onNavigateToSignUp: () => void;
}

export function Login({ onNavigateToSignUp }: LoginProps) {
  return (
    <div className="login-container">
      {/* LEFT SIDE */}
      <div className="login-left">
        <img src={logoImage} alt="Rooms Hive Logo" className="login-logo" />
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-card">
          {/* Icono */}
          <img src={hexagonImage} className="login-icon" />

          {/* Título */}
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to continue to your account</p>

          {/* FORM */}
          <form className="login-form">
            {/* USERNAME */}
            <div className="form-group">
              <label className="label">USERNAME</label>
              <input
                type="text"
                className="input"
                placeholder="Enter your username"
              />
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label className="label">PASSWORD</label>
              <input
                type="password"
                className="input"
                placeholder="Enter your password"
              />
            </div>

            {/* Forgot password */}
            <div className="forgot-container">
              <button className="forgot-btn" type="button">
                Forgot password?
              </button>
            </div>

            {/* Sign In button */}
            <button type="submit" className="signin-btn">
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <div className="line" />
            <span>or</span>
            <div className="line" />
          </div>

          {/* Sign up link */}
          <p className="signup-text">
            Don’t have an account?{" "}
            <button className="signup-btn" onClick={onNavigateToSignUp}>
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
