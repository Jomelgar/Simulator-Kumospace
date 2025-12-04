const multer = require("multer");
const path = require("path");

const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/Users/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const hiveStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/Hives/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Instancias de multer
const uploadUser = multer({ storage: userStorage });
const uploadHive = multer({ storage: hiveStorage });

module.exports = { uploadUser, uploadHive };
