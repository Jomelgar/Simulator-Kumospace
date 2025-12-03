const express = require("express");
const router = express.Router();
const Work_Room = require("../controllers/work_roomController");
const { VerifyToken } = require("../middleware/verifyToken");

//Rutas que requieren autenticación
router.use(VerifyToken);
router.get("/getWorkRooms/:id_hive", Work_Room.getWorkRooms);
router.post("/addWorkRoom", Work_Room.addWorkRoom);
router.delete("/deleteWorkRoom/:id_room", Work_Room.deleteWorkRoom);
router.put("/updateWorkRoom/:id_room", Work_Room.updateWorkRoom);

module.exports = router;
