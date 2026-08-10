const { parse } = require("dotenv");
const pool = require("../config/db");

const getProperties = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit, 10);
    let offset = parseInt(req.query.offset, 10);
    const city = req.query.city;
    const zipcode = req.query.zipcode;
    const minPrice = parseInt(req.query.minPrice, 10);
    const maxPrice = parseInt(req.query.maxPrice, 10);
    const beds = parseInt(req.query.beds, 10);
    const baths = parseFloat(req.query.baths);
    const sortOrder = req.query.sortOrder;
    const sortBy = req.query.sortBy;
    let queryStr = "SELECT * FROM rets_property";
    let queryCount = "SELECT COUNT(*) AS total FROM rets_property";
    let queryWhere = " WHERE 1 = 1";
    const queryParams = [];
    const DEFAULT_LIMIT = 20;
    const DEFAULT_OFFSET = 0;
    const MAX_LIMIT = 100;
    const SORT_WHITELIST = {
      price: "L_SystemPrice",
      dateListed: "ListingContractDate",
      sqft: "LM_Int2_3",
      beds: "L_Keyword2",
    };
    const SORT_ORDERS = new Set(["asc", "desc"]);

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

      if (req.query.beds === "5+") {
        queryWhere += " AND L_Keyword2 >= ?";
      } else {
        queryWhere += " AND L_Keyword2 = ?";
      }
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

      if (req.query.baths === "5+") {
        queryWhere += " AND LM_Dec_3 >= ?";
      } else {
        queryWhere += " AND LM_Dec_3 = ?";
      }
      queryParams.push(rounded);
    }

    let orderByClause = " ORDER BY L_ListingID ASC";
    let sortDirection = null;

    if (sortBy !== undefined) {
      const sortColumn = SORT_WHITELIST[sortBy];
      if (!sortColumn) {
        return res.status(400).json({
          error: "sortBy must be one of: price, dateListed, sqft, beds",
        });
      }

      if (sortOrder !== undefined && !SORT_ORDERS.has(sortOrder)) {
        return res.status(400).json({
          error: `sortOrder is invalid, ${sortOrder}`,
        });
      }
      sortDirection = sortOrder ?? "asc";
      sortDirection = sortDirection.toUpperCase();

      orderByClause = ` ORDER BY ${sortColumn} ${sortDirection}`;
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

    // Add Sortby & orderBy
    queryStr += orderByClause;

    // Add LIMIT and OFFSET
    queryStr += " LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);
    console.log(queryStr, queryParams);
    const [rows] = await pool.query(queryStr, queryParams);

    return res.status(200).json({
      total: totalRows.total, // Index into first element of 2 array and grab the total
      limit,
      offset,
      results: rows,
    });
  } catch (err) {
    return internalErr(res, err);
  }
};

const getPropertyById = async (req, res) => {
  try {
    const idParam = parseListingID(req.params.id);

    if (idParam === null) {
      return res.status(400).json({
        error: "Invalid Property id, Listing ID must be a positive integer.",
      });
    }

    const targetProperty = await findPropertyByListingId(idParam);

    if (!targetProperty) {
      return res.status(404).json({
        error: `property not found`,
      });
    }

    res.status(200).json(targetProperty);
  } catch (err) {
    return internalErr(res, err);
  }
};

const getPropertyOpenHouses = async (req, res) => {
  try {
    const idParam = parseListingID(req.params.id);
    if (idParam === null) {
      return res.status(400).json({
        error: "Invalid Property id, Listing ID must be a positive integer.",
      });
    }

    const targetProperty = await findPropertyByListingId(idParam);

    if (!targetProperty) {
      return res.status(404).json({
        error: `property not found`,
      });
    }

    const queryStr =
      "SELECT * FROM rets_openhouse WHERE L_ListingID = ? ORDER BY OpenHouseDate, OH_StartTime";

    const [events] = await pool.query(queryStr, [idParam]);

    return res.status(200).json(events);
  } catch (err) {
    return internalErr(res, err);
  }
};

// Helper Function
const parseListingID = (value) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0 || !Number.isSafeInteger(id)) {
    return null;
  }
  return id;
};

const internalErr = (res, err) => {
  console.error(err);
  return res.status(500).json({
    error: "Internal server error",
  });
};

const findPropertyByListingId = async (id) => {
  const queryStr = "SELECT * FROM rets_property WHERE L_ListingID = ?";
  const [rows] = await pool.query(queryStr, [id]);
  return rows[0] || null;
};

// Exports an object
module.exports = {
  getProperties,
  getPropertyById,
  getPropertyOpenHouses,
};
