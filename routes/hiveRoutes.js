const express = require("express");
const router = express.Router();
const {uploadHive} = require("../externals/multer");
const Hive = require("../controllers/hiveController");
const { VerifyToken } = require("../middleware/verifyToken");

//Rutas que requieren autenticación
router.use(VerifyToken);
router.get("/getHives/", Hive.getHives);
router.post("/createHive", Hive.createHive);
router.post("/updateHive/:id_hive", uploadHive.single("image"), Hive.updateHive);
router.post("/invitedToHive", Hive.invitedToHive);
router.get("/getPrivateRooms/:id_hive", Hive.getPrivateRooms);
router.put("/updatePrivateRoom/:id_private_room", Hive.updatePrivateRoom);
router.post("/generateInviteCode/:id_hive", Hive.generateInviteCode);
router.post("/joinByCode", Hive.joinByCode);

module.exports = router;
