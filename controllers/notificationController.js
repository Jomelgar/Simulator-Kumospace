const {decodeToken} = require("../middleware/decodeToken");
const User = require("../models/user");
const Notification = require("../models/notification");

exports.getNotificationUser = async (req, res) => {
    try {
        const token = req.cookies["JWT"];
        if (!token) return res.status(401).json({ error: "No token provided." });

        const payload = decodeToken(token);
        if (!payload) return res.status(401).json({ error: "Invalid token." });

        const notifications = await Notification.findAll({
            where: { id_user: payload.id_user },
            order: [["date", "DESC"]]
        });

        return res.status(200).json({ notifications });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error." });
    }
};

exports.countNew = async (req, res) => {
    try {
        const token = req.cookies["JWT"];
        if (!token) return res.status(401).json({ error: "No token provided." });

        const payload = decodeToken(token);
        if (!payload) return res.status(401).json({ error: "Invalid token." });

        const newCount = await Notification.count({
            where: { id_user: payload.id_user, is_read: false }
        });

        return res.status(200).json({ count: newCount });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error." });
    }
};

exports.readNotification = async (req, res) => {
    try {
        const token = req.cookies["JWT"];
        if (!token) return res.status(404).json({ error: "There is no token provided." });

        const payload = decodeToken(token);
        if (!payload) return res.status(401).json({ error: "Invalid token." });

        const { id_notification } = req.params;
        if (!id_notification) return res.status(404).json({ error: "There is no id_notification provided." });

        const [updatedRows] = await Notification.update(
            { is_read: true },
            { where: { id_notification: id_notification, id_user: payload.id_user } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ error: "Notification not found or already read." });
        }

        return res.status(200).json({ message: "Notification marked as read successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error." });
    }
};
