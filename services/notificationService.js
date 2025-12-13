const Notification = require("../models/notification");
const User = require("../models/user");

exports.createNotification  = async(chatUserId, title,content) => {
    const user = await User.findOne({where: {chatUserId: chatUserId}});
    if(!user) return;
    await Notification.create({
        id_user: user.id_user,
        title,
        content
    });
};