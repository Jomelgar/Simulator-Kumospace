const express = require("express");
const app = express();
const sequelize = require("./config/database");

const userRoutes = require("./routes/userRoutes");
const hiveRoutes = require("./routes/hiveRoutes");
const work_roomRoutes = require("./routes/work_roomRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRoutes, hiveRoutes, work_roomRoutes);

app.get("/", (req, res) => {
  res.send("La API esta corriendo..");
});

sequelize.sync({alter: true});