import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../asset/logo.png";
import hexagonImage from "../asset/hexagon.png";
import "./SignIn.css";

export function SignInPage() {
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState<string | null>(null);

  // 🔹 Estados del formulario
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    terms: false,
  });

  // 🔹 Estados de errores
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 🔹 Manejo general de inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔹 Validación
  const validateRegisterForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.terms) {
      newErrors.terms = "You must accept the terms";
    }

    return newErrors;
  };

  // 🔹 Envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateRegisterForm();

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    
  };

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
          <form className="signin-form" onSubmit={handleSubmit}>
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
                name="firstName"
                type="text"
                placeholder="Enter your first name"
                onChange={handleChange}
                onFocus={() => setActiveField("first")}
                onBlur={() => setActiveField(null)}
                className={`signin-input ${
                  activeField === "first" ? "input-active" : ""
                }`}
              />
              {errors.firstName && (
                <p className="input-error">{errors.firstName}</p>
              )}
            </div>

            {/* LAST NAME */}
            <div className="signin-field-group">
              <label
                className={`signin-label ${
                  activeField === "second" ? "label-active" : ""
                }`}
              >
                LAST NAME
              </label>

              <input
                name="lastName"
                type="text"
                placeholder="Enter your second name"
                onChange={handleChange}
                onFocus={() => setActiveField("second")}
                onBlur={() => setActiveField(null)}
                className={`signin-input ${
                  activeField === "second" ? "input-active" : ""
                }`}
              />
              {errors.lastName && (
                <p className="input-error">{errors.lastName}</p>
              )}
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
                name="username"
                type="text"
                placeholder="Choose a username"
                onChange={handleChange}
                onFocus={() => setActiveField("username")}
                onBlur={() => setActiveField(null)}
                className={`signin-input ${
                  activeField === "username" ? "input-active" : ""
                }`}
              />
              {errors.username && (
                <p className="input-error">{errors.username}</p>
              )}
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
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleChange}
                onFocus={() => setActiveField("email")}
                onBlur={() => setActiveField(null)}
                className={`signin-input ${
                  activeField === "email" ? "input-active" : ""
                }`}
              />
              {errors.email && (
                <p className="input-error">{errors.email}</p>
              )}
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
                name="password"
                type="password"
                placeholder="Create a password"
                onChange={handleChange}
                onFocus={() => setActiveField("password")}
                onBlur={() => setActiveField(null)}
                className={`signin-input ${
                  activeField === "password" ? "input-active" : ""
                }`}
              />
              {errors.password && (
                <p className="input-error">{errors.password}</p>
              )}
            </div>

            {/* TERMS */}
            <div className="terms-wrapper">
              <input
                name="terms"
                type="checkbox"
                className="terms-check"
                onChange={handleChange}
              />
              <p className="terms-text">
                I agree to the <span>Terms of Service</span>{" "}
                and <span>Privacy Policy</span>
              </p>
            </div>
            {errors.terms && (
              <p className="input-error">{errors.terms}</p>
            )}

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
