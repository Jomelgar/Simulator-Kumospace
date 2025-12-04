import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../asset/logo.png";
import hexagonImage from "../asset/hexagon.png";
import { loginRequest } from "../api/authApi";
import "./Login.css";

export function LoginPage() {
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState<"username" | "password" | null>(null);
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const { username, password } = form;
      const response = await loginRequest(username, password);

      if (response?.status === 200) {
        navigate("/dashboard");
      } else {
        setErrors({ general: response?.data?.message || "Login failed" });
      }
    } catch (err) {
      console.error(err);
      setErrors({ general: "Server error, please try again later" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="gradient-blur"></div>

      {/* LEFT SIDE */}
      <div className="login-left-wrapper">
        <img src={logoImage} alt="Rooms Hive Logo" className="login-left-logo" />
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right-side">
        <div className="login-form-wrapper">
          <div className="hexagon-container">
            <img src={hexagonImage} className="hexagon-icon" alt="Hexagon" />
          </div>

          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to continue to your account</p>

          <form className="login-form" onSubmit={handleSubmit}>
            

            {/* USERNAME */}
            <div className="login-field-group">
              <label className={`login-label ${activeField === "username" ? "label-active" : ""}`}>
                USERNAME
              </label>
              <input
                name="username"
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                onFocus={() => setActiveField("username")}
                onBlur={() => setActiveField(null)}
                className={`login-input ${activeField === "username" ? "input-active" : ""}`}
                disabled={loading}
              />
              {errors.username && <p className="input-error">{errors.username}</p>}
            </div>

            {/* PASSWORD */}
            <div className="login-field-group">
              <label className={`login-label ${activeField === "password" ? "label-active" : ""}`}>
                PASSWORD
              </label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setActiveField("password")}
                onBlur={() => setActiveField(null)}
                className={`login-input ${activeField === "password" ? "input-active" : ""}`}
                disabled={loading}
              />
              {errors.password && <p className="input-error">{errors.password}</p>}
            </div>

            {/* General error */}
            {errors.general && <p className="general-error">{errors.general}</p>}

            {/* Forgot password */}
            <div className="forgot-wrapper">
              <button type="button" className="forgot-text" disabled={loading}>Forgot password?</button>
            </div>

            {/* BUTTON */}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="divider"><span>or</span></div>

          <div className="signup-wrapper">
            <p className="signup-text">Don’t have an account? </p>
            <button onClick={() => navigate("/signin")} className="signup-link" disabled={loading}>
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
