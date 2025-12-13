
const express = require("express");
const router = express.Router();
const notification = require("../controllers/notificationController");
const { VerifyToken } = require("../middleware/verifyToken");

//Rutas que requieren autenticación
router.use(VerifyToken);
router.get("/user",notification.getNotificationUser);
router.get("/newCount",notification.countNew);
router.put("/read/:id_notification",notification.readNotification);

module.exports = router;
