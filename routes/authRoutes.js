const express = require("express");
const router = express.Router();
const Hive = require("../controllers/authController");

//Rutas publicas
router.post("/login", Hive.login);
router.post("/logout", Hive.logout);
router.post("/decode-token", Hive.decodeToken);

module.exports = router;
