const User = require("../models/user");

exports.getUsers = async( request, response) => {
    try{
        const users = await User.findAll();
        response.json(users);
    }catch(error){
        response.status(500).json({error: error.message});
    }
}

exports.addUser = async( request, response) => {
    try{
        const { user_name, password, email, first_name, last_name }=request.body;
        const newUser = await User.create({ user_name, password, email, first_name, last_name });
        
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