import React, { useState } from "react";
import logoImage from "../asset/logo.png";
import "./SignIn.css";
import { useNavigate } from "react-router-dom";

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const handleCreateAccount = () => {
    if (!name || !username || !password || !email) {
      setError("All fields are required.");
      return;
    }

    setError("");
    alert("Account created successfully! (Aquí harías el POST real)");
  };

  return (
    <div className="signin-container">
      {/* Left side - Logo */}
      <div className="signin-left-side">
        <img src={logoImage} alt="Rooms Hive Logo" className="signin-logo" />
      </div>

      {/* Right side */}
      <div className="signin-right-side">
        <div className="signin-form-wrapper">
          {/* Professional Title */}
          <h1 className="signin-title">Sign Up</h1>

          {/* Form */}
          <form className="signin-form" onSubmit={(e) => e.preventDefault()}>
            {/* Name */}
            <div>
              <label className="signin-label">Name</label>
              <input
                type="text"
                placeholder="Kenny Example"
                className="signin-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Username */}
            <div>
              <label className="signin-label">Username</label>
              <input
                type="text"
                placeholder="Example username"
                className="signin-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="signin-label">Password</label>
              <input
                type="password"
                placeholder="**********"
                className="signin-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <label className="signin-label">Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="signin-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </form>

          {/* Error Message */}
          {error && <p className="signin-error">{error}</p>}

          {/* Actions */}
          <div className="signin-actions">
            <button
              type="button"
              className="signin-button signin-button-secondary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              type="button"
              className="signin-button signin-button-primary"
              onClick={handleCreateAccount}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;