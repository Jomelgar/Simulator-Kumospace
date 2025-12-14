const { DataTypes }=require("sequelize");
const sequelize=require("../config/database");

const Notification = sequelize.define("Notification", {
    id_notification: {
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
    },title:{
        type: DataTypes.STRING,
        allowNull: false,
    },content:{
        type: DataTypes.STRING,
        allowNull: false,
    },date:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{
    tableName: "Notification",
    timestamps: false
});

module.exports = Notification;
