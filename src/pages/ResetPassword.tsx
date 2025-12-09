import React, { useState } from "react"; 
import { useNavigate, useLocation } from "react-router-dom";
import logoImage from "../asset/logo.png";
import hexagonImage from "../asset/hexagon.png";
import "./Login.css";
import { resetPassword } from "../api/authApi"; // función que hace POST /auth/reset-password

export default function ResetPassword() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || ""; // viene desde VerifyCode
  const code = state?.code || "";   // también viene desde VerifyCode

  const [activeField, setActiveField] = useState(null);
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.password.trim()) newErrors.password = "Password is required";
    if (!form.confirm.trim()) newErrors.confirm = "Confirm your password";
    if (form.password !== form.confirm)
      newErrors.confirm = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setApiError("");
    setLoading(true);

    try {
      const response = await resetPassword(email, code, form.password);

      if (response?.status === 200) {
        // Contraseña cambiada correctamente
        navigate("/login");
      } else {
        setApiError(response?.data?.message || "Unable to reset password. Try again.");
      }
    } catch (err) {
      console.error(err);
      setApiError("Server error. Please try later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="gradient-blur"></div>

      {/* LEFT */}
      <div className="login-left-wrapper">
        <img src={logoImage} alt="Rooms Hive Logo" className="login-left-logo" />
      </div>

      {/* RIGHT */}
      <div className="login-right-side">
        <div className="login-form-wrapper">
          <div className="hexagon-container">
            <img src={hexagonImage} className="hexagon-icon" alt="Hexagon" />
          </div>

          <h1 className="login-title">Reset Password</h1>
          <p className="login-subtitle">Create your new password</p>

          {apiError && (
            <p style={{ color: "red", marginBottom: "10px" }}>{apiError}</p>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            {/* PASSWORD */}
            <div className="login-field-group">
              <label className={`login-label ${activeField === "password" ? "label-active" : ""}`}>
                NEW PASSWORD
              </label>
              <input
                name="password"
                type="password"
                placeholder="Enter your new password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setActiveField("password")}
                onBlur={() => setActiveField(null)}
                className={`login-input ${activeField === "password" ? "input-active" : ""}`}
                disabled={loading}
              />
              {errors.password && <p className="input-error">{errors.password}</p>}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="login-field-group">
              <label className={`login-label ${activeField === "confirm" ? "label-active" : ""}`}>
                CONFIRM PASSWORD
              </label>
              <input
                name="confirm"
                type="password"
                placeholder="Confirm new password"
                value={form.confirm}
                onChange={handleChange}
                onFocus={() => setActiveField("confirm")}
                onBlur={() => setActiveField(null)}
                className={`login-input ${activeField === "confirm" ? "input-active" : ""}`}
                disabled={loading}
              />
              {errors.confirm && <p className="input-error">{errors.confirm}</p>}
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Password"}
            </button>
          </form>

          <div className="signup-wrapper" style={{ marginTop: "1rem" }}>
            <button
              onClick={() => navigate("/login")}
              className="signup-link"
              disabled={loading}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
