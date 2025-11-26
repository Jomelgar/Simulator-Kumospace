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
    max_users: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: "Work_Room",
    timestamps: false
});

module.exports = Work_Room;