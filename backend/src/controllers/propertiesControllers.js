const pool = require("../config/db");

const searchProperties = async (req, res) => {
  // Temporary
  try {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    const queryStr = "SELECT * FROM rets_property ORDER BY id LIMIT ? OFFSET ?";
    const queryParams = [];

    queryParams.push(limit);
    queryParams.push(offset);

    const [rows] = await pool.query(queryStr, queryParams);

    const totalRows = await pool.query(
      "SELECT COUNT(*) AS total FROM rets_property",
    );

    res.status(200).json({
      total: totalRows[0][0].total, // Index into first element of 2 array and grab the total
      limit: limit,
      offset: offset,
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
  searchProperties,
};
