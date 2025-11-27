const User = require("../models/user");
const bycrypt = require("bcryptjs");

exports.getUsers = async( request, response) => {
    try{
        const users = await User.findAll();
        response.json(users);
    }catch(error){
        response.status(500).json({error: error.message});
    }
}

exports.getUser = async( request, response) => {
    try{
        const { id_user } = request.params;
        if(!id_user){
            return response.status(400).json({message: "id_user required."});
        }

        const user = await User.findByPk(id_user);
        if(!user){
            return response.status(404).json({message: "User not found."});
        }

        response.json(user);
    }catch(error){
        response.status(500).json({error: error.message});
    }
}

exports.addUser = async( request, response) => {
    try{
        const { user_name, password, email, first_name, last_name }=request.body;

        const cyptedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ user_name, password: cyptedPassword, email, first_name, last_name });
        
        response.json(newUser);
    }catch(error){
        response.status(500).json({error: error.message});
    }
}

exports.inviteUser = async( request, response) => {
    try{
        const { email } = request.params;
        const user = await User.findAll({
            where: { email }
        });
        if(!user){
            return response.status(404).json({ message: "User not found."});
        }

        response.json(user);
    }catch(error){
        response.status(500).json({error: error.message});
    }
}