const WorkRoom = require("../models/work_room");

exports.getWorkRoomsService = async (id_hive) => {
    if (!id_hive) {
        const err = new Error("id_hive required.");
        err.statusCode = 400;
        throw err;
    }

    const work_rooms = await WorkRoom.findAll({
        where: { id_hive }
    });

    return work_rooms;
};


exports.addWorkRoomService = async (data) => {
    const { id_hive, room_name, max_users } = data;

    if (!id_hive || !room_name) {
        const err = new Error("id_hive and room_name are required.");
        err.statusCode = 400;
        throw err;
    }

    const newRoom = await WorkRoom.create({ id_hive, room_name, max_users });
    return newRoom;
};

exports.deleteWorkRoomService = async (id_room) => {
    if (!id_room) {
        const err = new Error("id_room required.");
        err.statusCode = 400;
        throw err;
    }

    const room = await WorkRoom.findByPk(id_room);
    if (!room) {
        const err = new Error("Room not found.");
        err.statusCode = 404;
        throw err;
    }

    await room.destroy();
    return "Work room deleted with success.";
};

exports.updateWorkRoomService = async (id_room, data) => {
    const { room_name, max_users, is_locked } = data;

    if (!id_room) {
        const err = new Error("id_room required.");
        err.statusCode = 400;
        throw err;
    }

    const room = await WorkRoom.findByPk(id_room);
    if (!room) {
        const err = new Error("Room not found.");
        err.statusCode = 404;
        throw err;
    }

    await room.update({ room_name, max_users, is_locked });
    return room;
};