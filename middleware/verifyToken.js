const jswToken = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });

const VerifyToken = (req, res, next) => {
  const token = req.cookies["JWT"];

  if (!token) {
    return res
      .status(401)
      .json({ status: "No token provided", message: "No puedes acceder" });
  }

  try {
    const decoded = jswToken.verify(token, process.env.SECRET_KEY);
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
