const express = require("express");
const app = express();
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const hiveRoutes = require("./routes/hiveRoutes");
const work_roomRoutes = require("./routes/work_roomRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/hive", hiveRoutes);
app.use("/api/work_room", work_roomRoutes);

app.get("/", (req, res) => {
  res.send("The API is running.");
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Conectado a la base de datos Postgre de Supabase de Detodito Market");
    return sequelize.sync({ alter: true });
  })

  .then(() => {
    console.log("Modelos vinculados");
  })
  .catch((err) => console.error("DB error:", err));
app.listen(3001, () => console.log("Listening to port 3001"));