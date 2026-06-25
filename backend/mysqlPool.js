require("dotenv").config();
const mysql = require("mysql2/promise");

const db_host = process.env.HOST;
const db_database = process.env.DB_DATABASE;
const db_user = process.env.DB_USER;
const db_pwd = process.env.DB_PASS;

const pool = mysql.createPool({
  host: db_host,
  user: db_user,
  password: db_pwd,
  database: db_database,
  connectionLimit: 10,
});

module.exports = pool;
