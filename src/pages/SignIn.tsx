import React from "react";
import logoImage from "../asset/logo.png";

const SignIn: React.FC = () => {
  return (
    <div className="flex h-screen w-full">
      {/* Left side - Logo */}
      <div className="w-[44%] bg-[rgb(255,255,255)] flex items-center justify-center">
        <img
          src={logoImage}
          alt="Rooms Hive Logo"
          className="w-3/4 max-w-[500px] h-auto"
        />
      </div>

      {/* Right side - Sign up form */}
      <div className="w-[56%] bg-black flex items-center justify-center">
        <div className="w-full max-w-[500px] px-8">
          {/* Title */}
          <h1
            className="text-white text-[64px] mb-10 text-center"
            style={{ fontWeight: "400", letterSpacing: "0.02em" }}
          >
            Sign up
          </h1>

          {/* Form */}
          <form className="space-y-7">
            {/* Username field */}
            <div>
              <label
                className="text-white text-[24px] block mb-2"
                style={{ fontWeight: "300" }}
              >
                Username
              </label>
              <input
                type="text"
                placeholder="Example username"
                className="w-full bg-transparent border border-white rounded-lg px-4 py-3 text-white placeholder-gray-500 text-[16px]"
                style={{ outline: "none" }}
              />
            </div>

            {/* Password field */}
            <div>
              <label
                className="text-white text-[24px] block mb-2"
                style={{ fontWeight: "300" }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="**********"
                className="w-full bg-transparent border border-white rounded-lg px-4 py-3 text-white placeholder-gray-500 text-[16px]"
                style={{ outline: "none" }}
              />
            </div>

            {/* Email field */}
            <div>
              <label
                className="text-white text-[24px] block mb-2"
                style={{ fontWeight: "300" }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full bg-transparent border border-white rounded-lg px-4 py-3 text-white placeholder-gray-500 text-[16px]"
                style={{ outline: "none" }}
              />
            </div>
          </form>

          {/* Bottom links */}
          <div className="flex justify-between mt-20">
            <a
              href="#"
              className="text-[#f4b942] text-[24px] underline hover:opacity-80"
              style={{ textUnderlineOffset: "4px" }}
            >
              Login
            </a>
            <a
              href="#"
              className="text-[#f4b942] text-[24px] underline hover:opacity-80"
              style={{ textUnderlineOffset: "4px" }}
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
