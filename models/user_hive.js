const { DataTypes }=require("sequelize");
const sequelize=require("../config/database");

const User_Hive = sequelize.define("User_Hive",{
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
    }  
}, {
    tableName: "User_Hive",
    timestamps: false
});

module.exports = User_Hive;