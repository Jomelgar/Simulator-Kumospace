const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Private_Room = sequelize.define("Private_Room", {
    id_private_room: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "User",
            key: "id_user"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    },
    id_hive: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Hive",
            key: "id_hive"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    },
    room_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    is_locked: {
        type: DataTypes.BOOLEAN,
        defaultValue: true 
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
}, {
    tableName: "Private_Room",
    createdAt: "created_at",
    updatedAt: "updated_at",
    timestamps: true
});

module.exports = Private_Room;