const User = require("../models/user");
const {register,login} = require("../externals/chatservice");
const bcrypt = require("bcryptjs");
require("dotenv").config();

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

        const cryptedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({ user_name, password: cryptedPassword, email, first_name, last_name });
        
        //Guardar usuario en el servicio de chat
        const isCreated = await register(user_name, email, password, `${first_name} ${last_name}`);
        if(isCreated === false) {return response.status(201).json({chatCreated: isCreated});}
        const {token , userId } = await login(user_name,password);
        await User.update({chatUserId: userId, chatAuthToken: token}, { where: { id_user: newUser.id_user } });
        
        response.status(200).json({chatCreated: isCreated});
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