const { DataTypes }=require("sequelize");
const sequelize=require("../config/database");

const User = sequelize.define("User",{
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status : {
        type: DataTypes.STRING,
        defaultValue: 'online'
    },
    currentLocation: {
        type: DataTypes.INTEGER
    },
    locationType: {
        type: DataTypes.STRING
    },
    chatUserId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    chatAuthToken: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
}, {
    tableName: "User",
    timestamps: false
});

module.exports = User;