import { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import logoImage from "../asset/logo.png";
import hexagonImage from "../asset/hexagon.png";
import "./Login.css";
import { requestResetCode } from "../api/authApi"; // <--- Cambiado

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSendCode = async () => {
    if (!email.trim()) {
      setErrorMsg("Email is required");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      // Llamada a la API para solicitar el código
      const response = await requestResetCode(email);

      if (response?.status === 200) {
        // Ir a la pantalla de verificación con el email
        navigate("/verify-code", { state: { email } });
      } else {
        setErrorMsg(response?.data?.message || "Unable to send verification code");
      }
    } catch (error) {
      setErrorMsg("Error sending code. Try again later.");
      console.error(error);
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

            {/* MENSAJE DE ERROR */}
            {errorMsg && (
              <p style={{ color: "red", marginTop: "4px" }}>{errorMsg}</p>
            )}

            <button className="login-btn" onClick={handleSendCode} disabled={loading}>
              {loading ? "Sending..." : "Send Code"}
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
