require("dotenv").config();

module.exports = {
  development: {
    username: process.env.KC_USERNAME || process.env.POSTGRES_USER,
    password: process.env.KC_PASSWORD || process.env.POSTGRES_PASSWORD,
    database: process.env.KC_DB || process.env.POSTGRES_DB,
    host: process.env.PGHOST || "localhost",
    port: process.env.PGPORT || 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: false, // local normalmente no usa SSL
    },
  },
  test: {
    username: process.env.KC_USERNAME || process.env.POSTGRES_USER,
    password: process.env.KC_PASSWORD || process.env.POSTGRES_PASSWORD,
    database: process.env.KC_DB || process.env.POSTGRES_DB,
    host: process.env.PGHOST || "localhost",
    port: process.env.PGPORT || 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: false,
    },
  },
  production: {
    username: process.env.KC_USERNAME || process.env.POSTGRES_USER,
    password: process.env.KC_PASSWORD || process.env.POSTGRES_PASSWORD,
    database: process.env.KC_DB || process.env.POSTGRES_DB,
    host: process.env.PGHOST || "localhost",
    port: process.env.PGPORT || 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};