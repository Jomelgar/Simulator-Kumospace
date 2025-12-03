const express = require("express");
const router = express.Router();
const Hive = require("../controllers/hiveController");
const { VerifyToken } = require("../middleware/verifyToken");

//Rutas que requieren autenticación
router.use(VerifyToken);
router.get("/getHives/:id_user", Hive.getHives);
router.post("/createHive", Hive.createHive);
router.post("/invitedToHive", Hive.invitedToHive);
router.get("/getPrivateRooms/:id_hive", Hive.getPrivateRooms);
router.put("/updatePrivateRoom/:id_private_room", Hive.updatePrivateRoom);

module.exports = router;
