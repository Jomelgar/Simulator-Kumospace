import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoImage from "../asset/logo.png";
import hexagonImage from "../asset/hexagon.png";
import "./Login.css";

export default function VerifyCode() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || "";

  const [code, setCode] = useState("");

  const handleVerify = () => {
    if (!code.trim()) return;
    navigate("/reset-password", { state: { email } });
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

          <h1 className="login-title">Enter Code</h1>
          <p className="login-subtitle">We sent a code to {email}</p>

          <div className="login-form">
            <label className="login-label">VERIFICATION CODE</label>
            <input
              type="text"
              className="login-input"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <button className="login-btn" onClick={handleVerify}>
              Verify Code
            </button>

            <button
              className="forgot-text"
              style={{ marginTop: "16px" }}
              onClick={() => navigate("/forgot-password")}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
