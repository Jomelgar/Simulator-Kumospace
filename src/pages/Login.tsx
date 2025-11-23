import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from "../asset/logo.png";


const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    // Por ahora, simplemente navegamos a la página principal
    navigate('/inicio');
  };

  const onNavigateToSignUp = () => {
    navigate('/sign_in');
  };
  return (
    <div className="flex h-screen">
      {/* Left side - Logo */}
      <div className="w-[44%] bg-[rgb(255,255,255)] flex items-center justify-center">
        <img
          src={logoImage}
          alt="Rooms Hive Logo"
          className="w-[1100px] h-auto"
        />
      </div>

      {/* Right side - Login form */}
      <div className="w-[56%] bg-black flex items-center justify-center">
        <div className="w-full max-w-[500px] px-8">
          {/* Title - "Login" with golden "o" */}
          <h1 className="text-[64px] mb-10 text-center flex items-center justify-center" style={{ fontWeight: '400', letterSpacing: '0.02em' }}>
            <span className="text-white">L</span>
            <span className="text-[#f4b942]">o</span>
            <span className="text-white">gin</span>
          </h1>

          {/* Form */}
          <form className="space-y-7">
            {/* Username field */}
            <div>
              <label className="text-white text-[24px] block mb-2" style={{ fontWeight: '300' }}>
                Username
              </label>
              <input
                type="text"
                placeholder="Example username"
                className="w-full bg-transparent border border-white rounded-lg px-4 py-3 text-white placeholder-gray-500 text-[16px]"
                style={{ outline: 'none' }}
              />
            </div>

            {/* Password field */}
            <div>
              <label className="text-white text-[24px] block mb-2" style={{ fontWeight: '300' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="**********"
                className="w-full bg-transparent border border-white rounded-lg px-4 py-3 text-white placeholder-gray-500 text-[16px]"
                style={{ outline: 'none' }}
              />
            </div>
          </form>

          {/* Bottom links */}
          <div className="flex justify-between mt-20">
            <button
              onClick={onNavigateToSignUp}
              className="text-[#f4b942] text-[24px] underline hover:opacity-80 bg-transparent border-none cursor-pointer"
              style={{ textUnderlineOffset: '4px' }}
            >
              Sign up
            </button>
            <button
              onClick={handleLogin}
              className="text-[#f4b942] text-[24px] underline hover:opacity-80 bg-transparent border-none cursor-pointer"
              style={{ textUnderlineOffset: '4px' }}
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
