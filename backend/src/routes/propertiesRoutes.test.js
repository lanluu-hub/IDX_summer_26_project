// Note:
// Arrange: What state and dependency behavior does this scenario need?
// Act: What request does the client make?
// Assert: What observable result proves the behavior?
const request = require("supertest");

jest.mock("../config/db", () => ({
  query: jest.fn(),
}));

const pool = require("../config/db");
const app = require("../app");

// Test cleanup
beforeEach(() => {
  jest.clearAllMocks();
});

const __fixture__ = [
  {
    L_ListingID: 101,
    L_Address: "627 SE 179th Ave",
    L_City: "Portland",
    L_SystemPrice: 450000,
  },
];

const __fixture_porperty__ = {
  L_ListingID: 101,
  L_Address: "627 SE 179th Ave",
};

const __fixture_openhouse__ = [
  {
    L_ListingID: 101,
    OpenHouseDate: "2026-08-30",
    OH_StartTime: "10:00:00",
  },
];

describe("GET /api/properties", () => {
  describe("success", () => {
    test("return a paginated list of properties", async () => {
      // Arrange - Create small property fixture
      const properties = __fixture__;

      // The controller makes two database calls
      // configure two results in order:
      // Correspond to controller's destructuring
      //  const [[totalRows]] = await pool.query(...);
      //  const [rows] = await pool.query(...);
      pool.query
        .mockResolvedValueOnce([[{ total: 1 }]])
        .mockResolvedValueOnce([properties]);

      // Act - Use Supertest against the exported Express app
      const res = await request(app).get("/api/properties");

      // Assert
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        total: 1,
        limit: 20,
        offset: 0,
        results: properties,
      });
      expect(pool.query).toHaveBeenCalledTimes(2);
    });
  });

  describe("test Pagination", () => {
    test("test valid pagination parameters", async () => {
      // Arrange
      const properties = __fixture__;

      pool.query
        .mockResolvedValueOnce([[{ total: 1 }]])
        .mockResolvedValueOnce([properties]);

      // Act
      const res = await request(app).get("/api/properties?limit=10&offset=20");
      const [sql, params] = pool.query.mock.calls[1];

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.limit).toBe(10);
      expect(res.body.offset).toBe(20);
      expect(res.body.results).toEqual(properties);
      expect(pool.query).toHaveBeenCalledTimes(2);

      expect(sql).toContain("LIMIT ? OFFSET ?");
      expect(params).toEqual([10, 20]);
    });

    test.each([
      ["lower boundary", 1],
      ["upper boundary", 100],
    ])("accepts pagination %s", async (_description, limit) => {
      // Arrange
      const properties = __fixture__;

      pool.query
        .mockResolvedValueOnce([[{ total: 1 }]])
        .mockResolvedValueOnce([properties]);

      // Act using .query(query)
      const res = await request(app).get("/api/properties").query({ limit });

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.limit).toBe(limit);
      expect(res.body.offset).toBe(0);
      expect(res.body.results).toEqual(properties);
      expect(pool.query).toHaveBeenCalledTimes(2);
    });

    test.each([
      ["zero limit", { limit: 0 }],
      ["limit above upper bound", { limit: 101 }],
      ["nonnumeric limit", { limit: "abc" }],
      ["negative offset", { offset: -1 }],
      ["nonnumeric offset", { offset: "abc" }],
    ])("reject %s", async (_description, query) => {
      // Act
      const res = await request(app).get("/api/properties").query(query);

      // Assert
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(pool.query).not.toHaveBeenCalled();
    });
  });

  describe("test filters", () => {
    test("filters properties by a valid city", async () => {
      // Arrange
      const properties = __fixture__;

      pool.query
        .mockResolvedValueOnce([[{ total: 1 }]])
        .mockResolvedValueOnce([properties]);

      // Act
      const res = await request(app)
        .get("/api/properties")
        .query({ city: " Portland " });

      const [countSql, countParams] = pool.query.mock.calls[0];
      const [selectSql, selectParams] = pool.query.mock.calls[1];

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.results).toEqual(properties);
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(countSql).toContain("COUNT(*)");
      expect(selectSql).toContain("L_City");
      expect(selectParams).toEqual(["Portland", 20, 0]);
    });

    test("filter property by a valid zipcode", async () => {
      // Arrange
      const properties = __fixture__;

      pool.query
        .mockResolvedValueOnce([[{ total: 1 }]])
        .mockResolvedValueOnce([properties]);

      // Act
      const res = await request(app)
        .get("/api/properties")
        .query({ zipcode: "97200" });

      const [countSql, countParams] = pool.query.mock.calls[0];
      const [selectSql, selectParams] = pool.query.mock.calls[1];

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.results).toEqual(properties);
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(countSql).toContain("COUNT(*)");
      expect(selectSql).toContain("L_zip");
      expect(selectSql).toContain("=");
      expect(selectParams).toEqual(["97200", 20, 0]);
    });

    test("filter property by a valid minPrice", async () => {
      // Arrange
      const properties = __fixture__;

      pool.query
        .mockResolvedValueOnce([[{ total: 1 }]])
        .mockResolvedValueOnce([properties]);

      // Act
      const res = await request(app)
        .get("/api/properties")
        .query({ minPrice: 200000 });

      const [countSql, countParams] = pool.query.mock.calls[0];
      const [selectSql, selectParams] = pool.query.mock.calls[1];

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.results).toEqual(properties);
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(countSql).toContain("COUNT(*)");
      expect(countSql).toContain("AND L_SystemPrice >= ?");
      expect(selectSql).toContain("AND L_SystemPrice >= ?");
      expect(selectParams).toEqual([200000, 20, 0]);
    });

    test("filter property by a valid maxPrice", async () => {
      // Arrange
      const properties = __fixture__;

      pool.query
        .mockResolvedValueOnce([[{ total: 1 }]])
        .mockResolvedValueOnce([properties]);

      // Act
      const res = await request(app)
        .get("/api/properties")
        .query({ maxPrice: 500000 });

      const [countSql, countParams] = pool.query.mock.calls[0];
      const [selectSql, selectParams] = pool.query.mock.calls[1];

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.results).toEqual(properties);
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(countSql).toContain("COUNT(*)");
      expect(countSql).toContain("AND L_SystemPrice <= ?");
      expect(selectSql).toContain("AND L_SystemPrice <= ?");
      expect(selectParams).toEqual([500000, 20, 0]);
    });

    test.each([
      ["beds", { beds: "2" }],
      ["beds (5+)", { beds: "5+" }],
    ])("filter property by a valid %s", async (_description, query) => {
      // Arrange
      const properties = __fixture__;

      pool.query
        .mockResolvedValueOnce([[{ total: 1 }]])
        .mockResolvedValueOnce([properties]);

      // Act
      const res = await request(app).get("/api/properties").query(query);

      const [countSql, countParams] = pool.query.mock.calls[0];
      const [selectSql, selectParams] = pool.query.mock.calls[1];

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.results).toEqual(properties);
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(countSql).toContain("COUNT(*)");
      if (query.beds === "5+") {
        expect(selectSql).toContain("AND L_Keyword2 >= ?");
      } else {
        expect(selectSql).toContain("AND L_Keyword2 = ?");
      }
      expect(selectParams).toEqual([parseInt(query.beds, 10), 20, 0]);
    });

    test.each([
      ["baths", { baths: "3.0" }],
      ["baths (5.0 +)", { baths: "5.0+" }],
    ])("filter property by a valid %s", async (_description, query) => {
      // Arrange
      const properties = __fixture__;

      pool.query
        .mockResolvedValueOnce([[{ total: 1 }]])
        .mockResolvedValueOnce([properties]);

      // Act
      const res = await request(app).get("/api/properties").query(query);

      const [countSql, countParams] = pool.query.mock.calls[0];
      const [selectSql, selectParams] = pool.query.mock.calls[1];

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.results).toEqual(properties);
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(countSql).toContain("COUNT(*)");
      if (query.baths === "5.0+") {
        expect(selectSql).toContain("AND LM_Dec_3 >= ?");
      } else {
        expect(selectSql).toContain("AND LM_Dec_3 = ?");
      }
      expect(selectParams).toEqual([parseFloat(query.baths), 20, 0]);
    });

    test("valid price range interaction", async () => {
      // Arrange
      const properties = __fixture__;

      pool.query
        .mockResolvedValueOnce([[{ total: 1 }]])
        .mockResolvedValueOnce([properties]);

      const query = { minPrice: 200000, maxPrice: 500000 };

      // Act
      const res = await request(app).get("/api/properties").query(query);

      const [countSql, countParams] = pool.query.mock.calls[0];
      const [selectSql, selectParams] = pool.query.mock.calls[1];

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.results).toEqual(properties);
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(countSql).toContain("COUNT(*)");
      expect(selectSql).toContain(
        "AND L_SystemPrice >= ? AND L_SystemPrice <= ?",
      );
      expect(selectParams).toEqual([200000, 500000, 20, 0]);
    });
  });

  describe("Invalid Input", () => {
    test.each([
      ["empty city", { city: "   " }],
      ["malformed ZIP", { zipcode: "9720" }],
      ["nonnumeric ZIP", { zipcode: "abcde" }],
      ["negative minimum price", { minPrice: -1 }],
      ["nonnumeric minimum price", { minPrice: "abc" }],
      ["negative maximum price", { maxPrice: -1 }],
      ["nonnumeric maximum price", { maxPrice: "abc" }],
      ["minimum above maximum", { minPrice: 500000, maxPrice: 200000 }],
      ["negative beds", { beds: -1 }],
      ["nonnumeric beds", { beds: "abc" }],
      ["negative baths", { baths: -0.5 }],
      ["nonnumeric baths", { baths: "abc" }],
    ])("reject %s", async (_description, query) => {
      // Arrange
      // Act
      const res = await request(app).get("/api/properties").query(query);

      // Assert
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(pool.query).not.toHaveBeenCalled();
    });
  });
});

describe("GET /api/properties/:id", () => {
  test("returns a property for an existing ID", async () => {
    // Arrange
    const property = __fixture__;

    pool.query.mockResolvedValueOnce([[property]]);

    // Act
    const res = await request(app).get("/api/properties/101");

    const [sql, params] = pool.query.mock.calls[0];

    // Assert
    expect(res.status).toBe(200);
    expect(res.body).toEqual(property);
    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(sql).toContain("WHERE L_ListingID = ?");
    expect(params).toEqual([101]);
  });

  test("returns 404 when the property does not exist", async () => {
    // Arrange
    const property = __fixture__;

    pool.query.mockResolvedValueOnce([[]]);

    // Act
    const res = await request(app).get("/api/properties/100");

    const [sql, params] = pool.query.mock.calls[0];

    // Assert
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(sql).toContain("WHERE L_ListingID = ?");
    expect(params).toEqual([100]);
  });

  test("returns 400 for a nonnumeric ID", async () => {
    // Arrange
    const property = __fixture__;

    // Act
    const res = await request(app).get("/api/properties/abc");

    // Assert
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(pool.query).not.toHaveBeenCalled();
  });
});

describe("GET /api/properties/:id/openhouses", () => {
  test("return open houses with existing parent", async () => {
    // Arrange
    const property = __fixture_porperty__;
    const openhouses = __fixture_openhouse__;

    pool.query
      .mockResolvedValueOnce([[property]])
      .mockResolvedValueOnce([openhouses]);

    // Act
    const res = await request(app).get("/api/properties/101/openhouses");

    const [propertySql, propertyParams] = pool.query.mock.calls[0];
    const [openHouseSql, openHouseParams] = pool.query.mock.calls[1];

    // Assert
    expect(res.status).toBe(200);
    expect(res.body).toEqual(openhouses);
    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(propertySql).toContain("FROM rets_property");
    expect(openHouseSql).toContain("FROM rets_openhouse");
    expect(openHouseSql).toContain("ORDER BY OpenHouseDate, OH_StartTime");
    expect(propertyParams).toEqual([101]);
    expect(openHouseParams).toEqual([101]);
  });

  test("return existing parent with no open houses", async () => {
    // Arrange
    const property = __fixture_porperty__;
    const openhouses = __fixture_openhouse__;

    pool.query.mockResolvedValueOnce([[property]]).mockResolvedValueOnce([[]]);

    // Act
    const res = await request(app).get("/api/properties/100/openhouses");

    const [propertySql, propertyParams] = pool.query.mock.calls[0];
    const [openHouseSql, openHouseParams] = pool.query.mock.calls[1];

    // Assert
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(propertySql).toContain("FROM rets_property");
    expect(openHouseSql).toContain("FROM rets_openhouse");
    expect(openHouseSql).toContain("ORDER BY OpenHouseDate, OH_StartTime");
    expect(propertyParams).toEqual([100]);
    expect(openHouseParams).toEqual([100]);
  });

  test("openhouses with missing parent", async () => {
    // Arrange
    const property = __fixture_porperty__;
    const openhouses = __fixture_openhouse__;

    pool.query.mockResolvedValueOnce([[]]);

    // Act
    const res = await request(app).get("/api/properties/102/openhouses");

    // Assert
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  test("openhouse with invalid id", async () => {
    // Arrange
    const property = __fixture_porperty__;
    const openhouses = __fixture_openhouse__;

    // Act
    const res = await request(app).get("/api/properties/abc/openhouses");

    // Assert
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(pool.query).not.toHaveBeenCalled();
  });
});
