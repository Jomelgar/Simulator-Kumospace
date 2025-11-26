const express = require("express");
const router = express.Router();
const Hive = require("../controllers/hiveController");

router.get("/getHives/:id_user", Hive.getHives);
router.post("/createHive", Hive.createHive);
router.post("/invitedToHive", Hive.invitedToHive);

module.exports = router;