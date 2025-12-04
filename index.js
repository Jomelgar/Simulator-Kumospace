const express = require("express");
require("dotenv").config();
const app = express();
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const hiveRoutes = require("./routes/hiveRoutes");
const authRoutes = require("./routes/authRoutes");
const work_roomRoutes = require("./routes/work_roomRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

app.use(morgan("dev"));
//configuración de CORS para permitir solicitudes desde el frontend
app.use(cors({ origin: process.env.CORE_URL, credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/hive", hiveRoutes);
app.use("/api/work_room", work_roomRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("The API is running.");
});

app.post("/Logout", (req, res) => {
  res.clearCookie("JWT", {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000),
  });
  res.status(200).json({ message: "Logged out successfully" });
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

app.listen(process.env.PORT || 3001, () =>
  console.log("Listening to port 3001")
);

