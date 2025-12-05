const express = require("express");
require("dotenv").config();
const router = express.Router();
const User = require("../controllers/userController");
const { VerifyToken } = require("../middleware/verifyToken");

const { uploadUser } = require("../externals/multer");

//Rutas publicas
router.post("/addUser", User.addUser);

//rutas que requieren autenticación
router.use(VerifyToken);
router.get("/inviteUser/:email", User.inviteUser);
router.get("/getUsers", User.getUsers);
router.get("/getUser/:id_user", User.getUser);
router.post("/getChat",User.getChat);
router.put("/updateUser/:id_user", uploadUser.single("image"), User.updateUser);

module.exports = router;
