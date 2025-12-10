const nodemailer = require("nodemailer");
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
  // Verifica el token
  try {
    const token = req.cookies["JWT"];

    if (!token) {
      return res.status(400).json({ message: "Token requerido." });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      message: "Token válido",
      token: token,
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

exports.UserThenToken = async (req, res) => {
  try {
    const id_user = req.params.id;
    console.log("ID de usuario recibido:", req.params);
    if (!id_user) {
      // 400 si no se proporciona el ID
      return res.status(400).json({ message: "ID de usuario requerido." });
    }

    const user = await User.findOne({
      where: { id_user: id_user },
      attributes: [
        "id_user",
        "user_name",
        "password",
        "email",
        "first_name",
        "last_name",
        "imageURL",
        "status",
        "currentLocation",
        "locationType",
      ],
    });

    if (!user) {
      // 404 si el ID existe en el token, pero no en la base de datos (raro, pero posible)
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // 3. Respuesta exitosa (200 OK)
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error al buscar usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.check = (req, res) => {
  res.status(200).json();
};

const resetCodes = {}; 
// { email: { code: "123456", expires: 123123123 } }

// Transporter SMTP (puedes usar Gmail, SendGrid, etc.)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.requestReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email requerido." });

    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(404).json({ message: "No existe un usuario con ese email." });

    // Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Guardarlo temporalmente (expira en 10 min)
    resetCodes[email] = {
      code,
      expires: Date.now() + 10 * 60 * 1000
    };

    // Enviar correo con nodemailer
    await transporter.sendMail({
      from: `"Hive Support" <hive_support@hiveroom.org>`,
      to: email,
      subject: "Código de recuperación de contraseña",
      text: `Hola ${user.first_name || user.user_name},\n\nTu código de recuperación es: ${code}\n\nEste código expira en 10 minutos.`,
    });

    return res.status(200).json({ message: "Código enviado al email." });

  } catch (error) {
    console.error("requestReset error:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};


exports.verifyReset = (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code)
      return res.status(400).json({ message: "Email y código requeridos." });

    const stored = resetCodes[email];

    if (!stored)
      return res.status(400).json({ message: "No hay código generado para este email." });

    if (Date.now() > stored.expires)
      return res.status(400).json({ message: "El código expiró." });

    if (stored.code !== code)
      return res.status(400).json({ message: "Código incorrecto." });

    return res.status(200).json({ message: "Código válido." });

  } catch (error) {
    console.error("verifyReset error:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword)
      return res.status(400).json({ message: "Todos los campos son requeridos." });

    const stored = resetCodes[email];

    if (!stored)
      return res.status(400).json({ message: "No hay solicitud de recuperación para este email." });

    if (Date.now() > stored.expires)
      return res.status(400).json({ message: "El código expiró." });

    if (stored.code !== code)
      return res.status(400).json({ message: "Código incorrecto." });

    // Buscar usuario
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado." });

    // Encriptar nueva contraseña
    const hash = await bcrypt.hash(newPassword, 12);

    await user.update({ password: hash });

    // Eliminar el código
    delete resetCodes[email];

    return res.status(200).json({ message: "Contraseña actualizada correctamente." });

  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
