const Hive = require("../models/hive");
const Private_Room = require("../models/private_room");
const Work_Room = require("../models/work_room");
const { Op } = require("sequelize");
const {decodeToken} = require("../middleware/decodeToken");


exports.getHives = async( request, response ) => {
    try{
        const token = request.cookies?.JWT;
        const payload = decodeToken(token);
        if(!payload){
            return response.status(400).json({message: "id_user required."});
        }
        const users_hives = await Private_Room.findAll({
            where: { id_user: payload.id_user }
        })

        const hiveids=users_hives.map(uh => uh.id_hive);
        if(hiveids.length==0){
            return response.json(hiveids);
        }

        const hives = await Hive.findAll({
            where: { id_hive: {[Op.in]: hiveids} }
        })

        const processed = await Promise.all(
        hives.map(async (h) => {
            const count = await Private_Room.count({
            where: { id_hive: h.id_hive }
            });
            return {
            id_hive: h.id_hive,
            hive_name: h.hive_name,
            description: h.description || `${payload.user_name}'s Hive`,
            user_role: payload.id_user === h.id_owner,
            max_count: count
            };
        })
        );

        response.json(processed);
    }catch(error){
        response.status(500).json({error: error.message})
    }
}

exports.createHive = async( request, response ) => {
    try{
        const { hive_name,size} = request.body;
        let new_size = size || 1;
        const token = request.cookies["JWT"];
        const payload = decodeToken(token);
        if(!payload)
        {
            return response.status(500).json({error: "No token here"});
        }
        const newHive = await Hive.create({ hive_name, id_owner: payload.id_user });

        await Private_Room.create({ id_user: newHive.id_owner, id_hive: newHive.id_hive, room_name: payload.user_name });
        
        for(let i = 1; i <= new_size; i++)
        {
            await Work_Room.create({id_hive: newHive.id_hive, room_name: `Work Room ${i}`,max_users: 4});
        }
        response.status(200).json(newHive);
    }catch(error){
        response.status(500).json({error: error.message})
    }
}

exports.invitedToHive = async( request, response ) => {
    try{
        const { id_user, id_hive, room_name } = request.body;

        const hive = await Hive.findByPk(id_hive);
        if(!hive){
            return response.status(404).json({ message: "Hive not found."});
        }

        const new_room = await Private_Room.create({ id_user, id_hive, room_name});

        response.json({ message: "User invited succesfully." });
    }catch(error){
        response.status(500).json({error: error.message})
    }
}

exports.getPrivateRooms = async(request, response) => {
    try {
        const { id_hive } = request.params;
        if (!id_hive) {
            return response.status(400).json({ message: "id_hive required." });
        }
        
        const hiveExists = await Hive.findByPk(id_hive);
        if (!hiveExists) {
            return response.status(404).json({ message: "Hive not found." });
        }

        const rooms = await Private_Room.findAll({
            where: { id_hive }
        });

        response.json(rooms);
    } catch(error) {
        response.status(500).json({ error: error.message });
    }
}

exports.updatePrivateRoom = async(request, response) => {
    try {
        const { id_private_room } = request.params;
        const { room_name, is_locked } = request.body;
        
        const private_room = await Private_Room.findByPk(id_private_room);
        if (!private_room) {
            return response.status(404).json({ message: "Private room not found." });
        }

        await private_room.update({ room_name, is_locked });

        response.json(private_room);
    } catch(error) {
        response.status(500).json({ error: error.message });
    }
}