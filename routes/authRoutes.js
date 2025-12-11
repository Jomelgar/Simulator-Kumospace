const express = require("express");
const router = express.Router();
const { VerifyToken } = require("../middleware/verifyToken");
const Hive = require("../controllers/authController");

//Rutas publicas
router.post("/login", Hive.login);


router.post("/request-reset", Hive.requestReset);
router.post("/verify-reset", Hive.verifyReset);
router.post("/reset-password", Hive.resetPassword);

//Barrera de seguridad
router.use(VerifyToken);
//Rutas con verificacion de token
router.get("/check", Hive.check);
router.post("/logout", Hive.logout);
router.post("/decode-token", Hive.decodeToken);
router.get("/decode-user/:id", Hive.UserThenToken);


module.exports = router;
