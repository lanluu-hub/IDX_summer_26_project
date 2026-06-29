const pool = require("../config/db");

const propertiesCheck = async (req, res) => {
  // Temporary
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

// Exports an object
module.exports = {
  propertiesCheck,
};
