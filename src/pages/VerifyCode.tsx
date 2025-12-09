import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoImage from "../asset/logo.png";
import hexagonImage from "../asset/hexagon.png";
import "./Login.css";
import { verifyResetCode } from "../api/authApi";

export default function VerifyCode() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || "";

  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) {
      setErrorMsg("Please enter the verification code");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const response = await verifyResetCode(email, code);

      if (response?.status === 200) {
        // Código correcto, navegar a pantalla de reset password
        navigate("/reset-password", { state: { email, code } });
      } else {
        setErrorMsg("Invalid or expired code");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Error verifying code. Try again later.");
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
            />

            {errorMsg && <p style={{ color: "red", marginTop: "4px" }}>{errorMsg}</p>}

            <button className="login-btn" onClick={handleVerify} disabled={loading}>
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            <button
              className="forgot-text"
              style={{ marginTop: "16px" }}
              onClick={() => navigate("/forgot-password")}
              disabled={loading}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
