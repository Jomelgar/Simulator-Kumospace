const express = require("express");
const router = express.Router();
const Hive = require("../controllers/authController");

router.post("/login", Hive.login);
router.post("/decode-token", Hive.decodeToken);

module.exports = router;
