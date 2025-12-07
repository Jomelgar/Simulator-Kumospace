const jswToken = require("jsonwebtoken");
require("dotenv").config();

const VerifyToken = (req, res, next) => {
  // Intentar obtener token desde cookies
  let token = req.cookies?.JWT;

  // Si no está en cookies, buscar en headers Authorization
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7, authHeader.length);
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ status: "No token provided", message: "No puedes acceder" });
  }

  try {
    const decoded = jswToken.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};

//!NO existe el campo Rol ni permissions en el modelo User actualmente
// const VerifyRolAdmin = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!allowedRoles.includes(req.user.Rol)) {
//       return res.status(403).json({
//         message: "No tienes permisos para realizar esta acción",
//       });
//     }
//     next();
//   };
// };

//!NO existe el campo Rol ni permissions en el modelo User actualmente
// const VerifyPermissions = (...requiredPermissions) => {
//   return (req, res, next) => {
//     if (!req.user.permissions.includes(requiredPermissions)) {
//       return res.status(403).json({
//         status: "Forbidden",
//         message: "No tienes los permisos necesarios",
//       });
//     }
//     next();
//   };
// };

module.exports = {
  VerifyToken,
  //VerifyRolAdmin,
  //VerifyPermissions,
};