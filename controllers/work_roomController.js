const WorkRoom = require("../models/work_room");

exports.getWorkRooms = async(request, response) => {
    try{
        const { id_hive } = request.params;
        if(!id_hive){
            return response.status(400).json({message: "id_hive required."});
        }
        const work_rooms=await WorkRoom.findAll({
            where: { id_hive }
        });

        response.json(work_rooms);
    }catch(error){
        response.status(500).json({ error: error.message });
    }
}

exports.addWorkRoom = async(request, response) => {
    try{
        const { id_hive, max_users }=request.body;
        const newRoom = await WorkRoom.create({ id_hive, max_users });

        response.json(newRoom);
    }catch(error){
        response.status(500).json({ error: error.message });
    }
}

exports.deleteWorkRoom = async(request, response) => {
    try{
        const { id_room }=request.params;
        
        const deleteRoom = await WorkRoom.findByPk(id_room);
        if(!deleteRoom){
            return response.status(404).json({message: "Room not found."});
        }

        await deleteRoom.destroy();

        response.json("Work room deleted with success.");
    }catch(error){
        response.status(500).json({ error: error.message });
    }
}