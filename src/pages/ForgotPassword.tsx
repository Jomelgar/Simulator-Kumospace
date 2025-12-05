import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../asset/logo.png";
import hexagonImage from "../asset/hexagon.png";
import "./Login.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSendCode = () => {
    if (!email.trim()) return;
    navigate("/verify-code", { state: { email } });
  };

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
          {/* Hexagon */}
          <div className="hexagon-container">
            <img src={hexagonImage} className="hexagon-icon" alt="Hexagon" />
          </div>

          <h1 className="login-title">Reset Password</h1>
          <p className="login-subtitle">Enter your email to continue</p>

          <div className="login-form">
            <label className="login-label">EMAIL</label>
            <input
              type="email"
              className="login-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="login-btn" onClick={handleSendCode}>
              Send Code
            </button>

            <button
              className="forgot-text"
              style={{ marginTop: "16px" }}
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
