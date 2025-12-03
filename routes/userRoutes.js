const express = require("express");
require("dotenv").config();
const router = express.Router();
const User = require("../controllers/userController");

router.get("/getUsers", User.getUsers);
router.get("/getUser/:id_user", User.getUser);
router.post("/addUser", User.addUser);
router.get("/inviteUser/:email", User.inviteUser);

module.exports = router;
