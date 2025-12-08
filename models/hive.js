const { DataTypes }=require("sequelize");
const sequelize=require("../config/database");

const Hive=sequelize.define("Hive", {
    id_hive: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hive_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_owner: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    imageURL: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    invite_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true
    }
}, {
    tableName: "Hive",
    timestamps: false
});

module.exports = Hive;