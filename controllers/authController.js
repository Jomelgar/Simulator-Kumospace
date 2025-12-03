const User = require("../models/user");
const bcrypt = require("bcryptjs");
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

    const token = jwt.sign({ user: user }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    const cookieOption = {
      expires: new Date(Date.now() + 3600000), //1hora
      httpOnly: true,
      sameSite: "strict",
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
    const { token } = req.body;

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
