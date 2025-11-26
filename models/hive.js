const { DataTypes }=require("sequelize");
const sequelize=require("../config/database");

const Hive=sequelize.define("Hive", {
    id_hive: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hive_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    id_owner: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    count_users: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "Hive",
    timestamps: false
});

module.exports = Hive;