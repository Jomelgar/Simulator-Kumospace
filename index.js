const express = require("express");
require("dotenv").config();
const app = express();
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const hiveRoutes = require("./routes/hiveRoutes");
const authRoutes = require("./routes/authRoutes");
const work_roomRoutes = require("./routes/work_roomRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/hive", hiveRoutes);
app.use("/api/work_room", work_roomRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("The API is running.");
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Conectado a HiveRoom DB");
    return sequelize.sync({ alter: true });
  })

  .then(() => {
    console.log("Modelos vinculados");
  })
  .catch((err) => console.error("DB error:", err));
app.listen(process.env.PORT|| 3001, () => console.log("Listening to port 3001"));