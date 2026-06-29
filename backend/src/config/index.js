require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  DB_HOST: process.env.HOST,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_DATABASE: process.env.DB_DATABASE,
};
