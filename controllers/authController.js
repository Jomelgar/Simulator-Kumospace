const User = require("../models/user");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { user_name, password } = req.body;
    const user = await User.findOne({ where: { user_name } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ user: user }, process.env.JWT_SECRET);

    const cookieOption = {
      expires: new Date(Date.now() + 86400000), //1dia
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    };
    res.cookie("JWT", token, cookieOption);

    return res.status(200).json({ token, duration: process.env.JWT_EXPIRES });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.decodeToken = (req, res) => {
  try {
    const token = req.cookies["JWT"];

    if (!token) {
      return res.status(400).json({ message: "Token requerido." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({
      message: "Token válido",
      payload: decoded,
    });
  } catch (error) {
    console.error("Error decoding token:", error);
    return res.status(401).json({ message: "Invalid token." });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("JWT", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ message: "Logged out" });
};

exports.check = (req,res) => {
  res.status(200).json()
}