const express = require("express");
const router = express.Router();
const {VerifyToken} = require("../middleware/verifyToken");
const Hive = require("../controllers/authController");

//Rutas publicas
router.post("/login", Hive.login);
router.use(VerifyToken);
router.post("/logout", Hive.logout);
router.post("/decode-token", Hive.decodeToken);

module.exports = router;
