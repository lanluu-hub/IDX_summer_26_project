const pool = require("../config/db");

const healthCheck = async (req, res) => {
  try {
    await pool.query("SELECT 1;");
    res.status(200).json({
      status: "OK",
      database: "Connected",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      database: "Disconnected",
    });
  }
};

module.exports = {
  healthCheck,
};
