import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../asset/logo.png";
import hexagonImage from "../asset/hexagon.png";
import "./Login.css";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [activeField, setActiveField] = useState<"password" | "confirm" | null>(
    null
  );
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.password.trim()) newErrors.password = "Password is required";
    if (!form.confirm.trim()) newErrors.confirm = "Confirm your password";
    if (form.password !== form.confirm)
      newErrors.confirm = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1500);
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
          <div className="hexagon-container">
            <img src={hexagonImage} className="hexagon-icon" alt="Hexagon" />
          </div>

          <h1 className="login-title">Reset Password</h1>
          <p className="login-subtitle">Create your new password</p>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* PASSWORD */}
            <div className="login-field-group">
              <label
                className={`login-label ${
                  activeField === "password" ? "label-active" : ""
                }`}
              >
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
                className={`login-input ${
                  activeField === "password" ? "input-active" : ""
                }`}
                disabled={loading}
              />

              {errors.password && (
                <p className="input-error">{errors.password}</p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="login-field-group">
              <label
                className={`login-label ${
                  activeField === "confirm" ? "label-active" : ""
                }`}
              >
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
                className={`login-input ${
                  activeField === "confirm" ? "input-active" : ""
                }`}
                disabled={loading}
              />

              {errors.confirm && (
                <p className="input-error">{errors.confirm}</p>
              )}
            </div>

            {/* BUTTON */}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Password"}
            </button>
          </form>

          {/* BACK TO LOGIN */}
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
