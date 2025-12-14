const User = require("../models/user");
const { register, login, change_email } = require("../externals/chatservice");
const bcrypt = require("bcryptjs");
const { decodeToken } = require("../middleware/decodeToken");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

exports.getUsers = async (request, response) => {
    try {
        const users = await User.findAll();
        response.json(users);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
}

exports.getUser = async (request, response) => {
    try {
        const { id_user } = request.params;
        if (!id_user) {
            return response.status(400).json({ message: "id_user required." });
        }

        const user = await User.findByPk(id_user);
        if (!user) {
            return response.status(404).json({ message: "User not found." });
        }

        response.json(user);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
}

exports.addUser = async (request, response) => {
    try {
        const { user_name, password, email, first_name, last_name } = request.body;

        const cryptedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({ user_name, password: cryptedPassword, email, first_name, last_name });

        try {
            //Guardar usuario en el servicio de chat
            const isCreated = await register(user_name, email, password, `${first_name} ${last_name}`);
            if (isCreated === false) {
                return response.status(201).json({ chatCreated: isCreated });
            }
            const { token, userId } = await login(user_name, password);
            await newUser.update({ chatUserId: userId, chatAuthToken: token });
        } catch (error) {
            console.error("Error al registrar el usuario en el servicio de chat: ", error);
            return response.status(201).json({ chatCreated: false });
        }

        response.status(200).json({ chatCreated: true });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
}

exports.inviteUser = async (request, response) => {
    try {
        const { email } = request.params;
        const user = await User.findAll({
            where: { email }
        });
        if (!user) {
            return response.status(404).json({ message: "User not found." });
        }

        response.json(user);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
}

exports.updateUser = async (request, response) => {
    try {
        const { id_user } = request.params;
        // Combine fields from both requirements: Profile editing + Status updates
        const {
            first_name, last_name, email, phone, location, title, about, skills, // Profile fields
            status, description, currentLocation, locationType // Status fields
        } = request.body;

        const updateUser = await User.findByPk(id_user);
        if (!updateUser) {
            return response.status(404).json({ message: "User not found." });
        }

        // Logic to update email in chat service if it changes
        if (email && email !== updateUser.email && updateUser.chatUserId) {
            try {
                const emailChanged = await change_email(updateUser.chatUserId, email);
                if (!emailChanged) {
                    console.error("Failed to update email in chat service");
                    // Optionally handle partial failure or just log it
                }
            } catch (chatError) {
                console.error("Error calling change_email:", chatError);
            }
        }

        let newImageUrl = updateUser.imageURL;
        if (request.file) {
            newImageUrl = `/uploads/Users/${request.file.filename}`;
            if (updateUser.imageURL) {
                const oldPath = path.join(__dirname, "..", updateUser.imageURL);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        let parsedSkills = skills;
        if (typeof skills === 'string') {
            try {
                parsedSkills = JSON.parse(skills);
            } catch (error) {
                console.error("Error parsing skills:", error);
                parsedSkills = [];
            }
        }

        await updateUser.update({
            first_name, last_name, email, phone, location, title, about,
            status, description, currentLocation, locationType,
            imageURL: newImageUrl,
            skills: parsedSkills
        });
        response.json(updateUser);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
}

exports.getChat = async (req, res) => {
    const token = req.cookies?.JWT;
    if (!token) {
        return res
            .status(401)
            .json({ status: "No token provided", message: "No puedes acceder" });
    }

    const decode = decodeToken(token);
    if (!decode) return res
        .status(401)
        .json({ status: "Invalid token", message: "No puedes acceder" });

    return res.status(200).json({ authToken: decode.chatAuthToken, userId: decode.chatUserId })
}