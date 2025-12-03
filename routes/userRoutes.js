const express = require("express");
require("dotenv").config();
const router = express.Router();
const User = require("../controllers/userController");
const { VerifyToken } = require("../middleware/verifyToken");

//Rutas publicas
router.post("/addUser", User.addUser);

//rutas que requieren autenticación
router.use(VerifyToken);
router.get("/inviteUser/:email", User.inviteUser);
router.get("/getUsers", User.getUsers);
router.get("/getUser/:id_user", User.getUser);

module.exports = router;
