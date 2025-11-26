const express = require("express");
const router = express.Router();
const Work_Room = require("../controllers/work_roomController");

router.get("/getWorkRooms/:id_hive", Work_Room.getWorkRooms);
router.post("/addWorkRoom", Work_Room.addWorkRoom);
router.delete("/deleteWorkRoom/:id_room", Work_Room.deleteWorkRoom);

module.exports = router;