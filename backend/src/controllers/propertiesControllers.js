const pool = require("../config/db");

const searchProperties = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit, 10);
    let offset = parseInt(req.query.offset, 10);
    const city = req.query.city;
    const zipcode = req.query.zipcode;
    const minPrice = parseInt(req.query.minPrice, 10);
    const maxPrice = parseInt(req.query.maxPrice, 10);
    const beds = parseInt(req.query.beds, 10);
    const baths = parseFloat(req.query.baths);
    let queryStr = "SELECT * FROM rets_property";
    let queryCount = "SELECT COUNT(*) AS total FROM rets_property";
    let queryWhere = " WHERE 1 = 1";
    const queryParams = [];
    const DEFAULT_LIMIT = 20;
    const DEFAULT_OFFSET = 0;
    const MAX_LIMIT = 100;

    // Default if value not provide
    if (req.query.limit === undefined) limit = DEFAULT_LIMIT;
    if (req.query.offset === undefined) offset = DEFAULT_OFFSET;

    // Validate query parameters
    // City filter — optional, must be non-empty string
    if (city !== undefined) {
      if (city.trim().length <= 0) {
        return res.status(400).json({
          error: "City is empty",
        });
      }
      queryWhere += " AND LOWER(TRIM(L_City)) = LOWER(?)";
      queryParams.push(city.trim());
    }

    // Zipcode filter — optional, must be a valid 5-digit ZIP code
    if (zipcode !== undefined) {
      // validate for zipcode in correct format
      if (!/^\d{5}$/.test(zipcode.trim())) {
        return res.status(400).json({
          error: "zipcode is not in correct format",
        });
      }
      queryWhere += " AND L_zip = ?";
      queryParams.push(zipcode.trim());
    }

    // Minimum price filter — optional, must be a non-negative integer
    if (req.query.minPrice !== undefined) {
      if (isNaN(minPrice) || minPrice < 0) {
        return res.status(400).json({
          error: "minPrice must be a positive integer",
        });
      }

      queryWhere += " AND L_SystemPrice >= ?";
      queryParams.push(minPrice);
    }

    // Maximum price filter — optional, must be a non-negative integer and not less than minPrice
    if (req.query.maxPrice !== undefined) {
      if (isNaN(maxPrice) || maxPrice < 0) {
        return res.status(400).json({
          error: "maxPrice must be a positive integer",
        });
      } else if (req.query.minPrice !== undefined && minPrice > maxPrice) {
        return res.status(400).json({
          error: "maxPrice cannot be less than minPrice",
        });
      }
      queryWhere += " AND L_SystemPrice <= ?";
      queryParams.push(maxPrice);
    }

    // Beds filter — optional, must be a non-negative integer
    if (req.query.beds !== undefined) {
      if (isNaN(beds) || beds < 0) {
        return res.status(400).json({
          error: "beds must be a non-negative integer",
        });
      }
      queryWhere += " AND L_Keyword2 = ?";
      queryParams.push(beds);
    }

    // Baths filter — optional, must be a non-negative number (rounded to 1 decimal place)
    if (req.query.baths !== undefined) {
      if (isNaN(baths) || baths < 0) {
        return res.status(400).json({
          error: "baths must be positive number",
        });
      }
      const rounded = Number(baths.toFixed(1));

      queryWhere += " AND LM_Dec_3 = ?";
      queryParams.push(rounded);
    }

    // Pagination — apply defaults and validate limit/offset values
    if (isNaN(limit) || limit <= 0 || limit > MAX_LIMIT) {
      return res.status(400).json({
        error: "limit must be a positive integer no greater than 100",
      });
    }

    if (isNaN(offset) || offset < 0) {
      return res.status(400).json({
        error: "offset must be a non-negative integer",
      });
    }

    // Build the filtered SELECT and COUNT queries using the validated filters
    queryStr += queryWhere;
    queryCount += queryWhere;

    const [[totalRows]] = await pool.query(queryCount, queryParams);

    // Add LIMIT and OFFSET
    queryStr += " ORDER BY id ASC LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);
    const [rows] = await pool.query(queryStr, queryParams);

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
      database: "Internal server error",
    });
  }
};

// Exports an object
module.exports = {
  searchProperties,
};
