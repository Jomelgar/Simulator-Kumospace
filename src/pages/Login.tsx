import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../asset/logo.png";
import "./Login.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    // Por ahora, simplemente navegamos a la página principal
    navigate("/inicio");
  };

  const onNavigateToSignUp = () => {
    navigate("/sign_in");
  };

  return (
    <div className="login-container">
      {/* Left side - Logo */}
      <div className="login-left-side">
        <img src={logoImage} alt="Rooms Hive Logo" className="login-logo" />
      </div>

      {/* Right side - Login form */}
      <div className="login-right-side">
        <div className="login-form-wrapper">
          {/* Title - "Login" with golden "o" */}
          <h1 className="login-title">
            <span className="text-white">L</span>
            <span className="text-gold">o</span>
            <span className="text-white">gin</span>
          </h1>

          {/* Form */}
          <form className="login-form">
            {/* Username field */}
            <div>
              <label className="login-label">Username</label>
              <input
                type="text"
                placeholder="Example username"
                className="login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password field */}
            <div>
              <label className="login-label">Password</label>
              <input
                type="password"
                placeholder="**********"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </form>

          {/* Bottom buttons */}
          <div className="login-actions">
            <button
              type="button"
              onClick={onNavigateToSignUp}
              className="login-button login-button-secondary"
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={handleLogin}
              className="login-button login-button-primary"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
