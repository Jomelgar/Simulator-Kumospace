const { DataTypes }=require("sequelize");
const sequelize=require("../config/database");

const Work_Room = sequelize.define("Work_Room", {
    id_room: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
        type: DataTypes.STRING,
        allowNull: false
    },
    max_users: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    is_locked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    tableName: "Work_Room",
    createdAt: "created_at",
    updatedAt: "updated_at",
    timestamps: true
});

module.exports = Work_Room;