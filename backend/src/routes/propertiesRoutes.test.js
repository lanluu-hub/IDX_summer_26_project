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

describe("GET /api/properties", () => {
  describe("success", () => {
    test("return a paginated list of properties", async () => {
      // Arrange - Create small property fixture
      const properties = [
        {
          L_ListingID: 101,
          L_Address: "627 SE 179th Ave",
          L_City: "Portland",
          L_SystemPrice: 450000,
        },
      ];

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
      const properties = [
        {
          L_ListingID: 101,
          L_Address: "627 SE 179th Ave",
          L_City: "Portland",
          L_SystemPrice: 450000,
        },
      ];

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
      const properties = [
        {
          L_ListingID: 101,
          L_Address: "627 SE 179th Ave",
          L_City: "Portland",
          L_SystemPrice: 450000,
        },
      ];

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
      const properties = [
        {
          L_ListingID: 101,
          L_Address: "627 SE 179th Ave",
          L_City: "Portland",
          L_SystemPrice: 450000,
        },
      ];

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
      const properties = [
        {
          L_ListingID: 101,
          L_Address: "627 SE 179th Ave",
          L_City: "Portland",
          L_SystemPrice: 450000,
        },
      ];

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
      const properties = [
        {
          L_ListingID: 101,
          L_Address: "627 SE 179th Ave",
          L_City: "Portland",
          L_SystemPrice: 450000,
        },
      ];

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
      expect(selectSql).toContain("L_SystemPrice");
      expect(selectSql).toContain(">=");
      expect(selectParams).toEqual([200000, 20, 0]);
    });

    test("filter property by a valid maxPrice", async () => {
      // Arrange
      const properties = [
        {
          L_ListingID: 101,
          L_Address: "627 SE 179th Ave",
          L_City: "Portland",
          L_SystemPrice: 450000,
        },
      ];

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
      expect(selectSql).toContain("L_SystemPrice");
      expect(selectSql).toContain("<=");
      expect(selectParams).toEqual([500000, 20, 0]);
    });

    test.each([
      ["beds", { beds: "2" }],
      ["beds (5+)", { beds: "5+" }],
    ])("filter property by a valid %s", async (_description, query) => {
      // Arrange
      const properties = [
        {
          L_ListingID: 101,
          L_Address: "627 SE 179th Ave",
          L_City: "Portland",
          L_SystemPrice: 450000,
        },
      ];

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
      expect(selectSql).toContain("L_Keyword2");
      if (query.beds === "5+") {
        expect(selectSql).toContain(">=");
      } else {
        expect(selectSql).toContain("=");
      }
      expect(selectParams).toEqual([parseInt(query.beds, 10), 20, 0]);
    });

    test.each([
      ["baths", { baths: "3.0" }],
      ["baths (5.0 +)", { baths: "5.0+" }],
    ])("filter property by a valid %s", async (_description, query) => {
      // Arrange
      const properties = [
        {
          L_ListingID: 101,
          L_Address: "627 SE 179th Ave",
          L_City: "Portland",
          L_SystemPrice: 450000,
        },
      ];

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
      expect(selectSql).toContain("LM_Dec_3");
      if (query.baths === "5.0+") {
        expect(selectSql).toContain(">=");
      } else {
        expect(selectSql).toContain("=");
      }
      expect(selectParams).toEqual([parseFloat(query.baths), 20, 0]);
    });

    test("valid price range interaction", async () => {
      // Arrange
      const properties = [
        {
          L_ListingID: 101,
          L_Address: "627 SE 179th Ave",
          L_City: "Portland",
          L_SystemPrice: 450000,
        },
      ];

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
      expect(selectSql).toContain("L_SystemPrice");
      expect(selectSql).toContain(">=");
      expect(selectSql).toContain("<=");
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
