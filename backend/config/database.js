require("dotenv").config({path: "../.env"});
const { Sequelize } = require("sequelize");
const pg=require("pg");

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl: false,
  },
  logging: false,
});

module.exports = sequelize;