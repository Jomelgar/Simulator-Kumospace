const express = require("express");
const router = express.Router();
const User = require("../controllers/userController");

router.get("/getUsers", User.getUsers);
router.post("/addUser", User.addUser);
router.get("/inviteUser/:email", User.inviteUser);

module.exports = router;

