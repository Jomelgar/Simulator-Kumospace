const Notification = require("../models/notification");
const User = require("../models/user");

exports.createNotification = async (chatUserId, title, content) => {
  try {
    if (!chatUserId) {
      console.warn("chatUserId vacío");
      return;
    }

    const user = await User.findOne({
      where: { chatUserId }
    });

    if (!user) {
      console.warn("Usuario no encontrado para chatUserId:", chatUserId);
      return;
    }

    await Notification.create({
      id_user: user.id_user,
      title,
      content
    });
  } catch (error) {
    console.error("Error creando notificación:", error);
  }
};
