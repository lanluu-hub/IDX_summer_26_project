const pool = require("../config/db");

const searchProperties = async (req, res) => {
  // Temporary
  try {
    let limit = parseInt(req.query.limit, 10) || 20;
    let offset = parseInt(req.query.offset, 10) || 0;
    const MAX_LIMIT = 100;

    // Validate query parameters
    if (isNaN(limit)) {
      return res.status(400).json({
        error: "limit must be positive integer",
      });
    } else if (limit < 0 || limit > MAX_LIMIT) {
      return res.status(400).json({
        error: "limit must be a positive integer no greater than 100",
      });
    }

    if (isNaN(offset) || offset < 0) {
      return res.status(400).json({
        error: "offset must be a positive integer",
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM rets_property ORDER BY id ASC LIMIT ? OFFSET ?",
      [limit, offset],
    );

    const [[totalRows]] = await pool.query(
      "SELECT COUNT(*) AS total FROM rets_property",
    );

    return res.status(200).json({
      total: totalRows.total, // Index into first element of 2 array and grab the total
      limit: limit,
      offset: offset,
      results: rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      database: "Disconnected",
    });
  }
};

// Exports an object
module.exports = {
  searchProperties,
};
