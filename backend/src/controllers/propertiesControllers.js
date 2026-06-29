const pool = require("../config/db");

const properties = async (req, res) => {
  // Temporary
  try {
    const db_query = "SELECT * FROM rets_property LIMIT 1";
    const [rows] = await pool.query(db_query);
    res.status(200).json({
      results: rows,
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
  properties,
};
