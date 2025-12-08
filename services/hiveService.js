// services/hive.service.js
const Hive = require("../models/hive");
const Private_Room = require("../models/private_room");

exports.getPrivateRoomsService = async (id_hive) => {
    if (!id_hive) {
        throw new Error("id_hive required.");
    }

    const hiveExists = await Hive.findByPk(id_hive);
    if (!hiveExists) {
        const err = new Error("Hive not found.");
        err.statusCode = 404;
        throw err;
    }

    const rooms = await Private_Room.findAll({
        where: { id_hive }
    });

    return rooms;
};

exports.getPrivateRoomOfUser= async(id_hive, id_user) => {
    if (!id_hive || !id_user) {
        throw new Error("id required.");
    }

    const rooms = await Private_Room.findAll({
        where: { id_hive, id_user }
    });

    return rooms;
}

exports.updatePrivateRoomService = async (id_private_room, is_locked) => {
    // Validaciones
    if (!id_private_room) {
        const err = new Error("id_private_room required.");
        err.statusCode = 400;
        throw err;
    }

    const private_room = await Private_Room.findByPk(id_private_room);
    if (!private_room) {
        const err = new Error("Private room not found.");
        err.statusCode = 404;
        throw err;
    }

    await private_room.update({ is_locked });

    return private_room;
};
