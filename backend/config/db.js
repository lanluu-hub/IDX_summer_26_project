const config = require("./index");
const mysql = require("mysql2/promise");

const db_host = config.DB_HOST;
const db_database = config.DB_DATABASE;
const db_user = config.DB_USER;
const db_pwd = config.DB_PASS;

const pool = mysql.createPool({
  host: db_host,
  user: db_user,
  password: db_pwd,
  database: db_database,
  connectionLimit: 10,
});

module.exports = pool;
