import { expect } from "vitest";
import { fetchProperties } from "./client";

beforeEach(() => {
  globalThis.fetch = vi.fn();
});

test("resolves with parsed JSON data", async () => {
  globalThis.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ total: 1, limit: 20, offset: 0, results: [] }),
  });

  const data = await fetchProperties({
    filters: {},
    limit: 20,
    offset: 0,
  });
  expect(data).toEqual({ total: 1, limit: 20, offset: 0, results: [] });
  expect(fetch).toHaveBeenCalledOnce();
});

test("Http Error Path", async () => {
  globalThis.fetch.mockResolvedValue({
    ok: false,
    status: 400,
    json: async () => ({ error: ". . ." }),
  });
  await expect(
    fetchProperties({
      filters: {},
      limit: 20,
      offset: 0,
    }),
  ).rejects.toThrow(/Status: 400/);
});

test("does not include empty filters in the request URL", async () => {
  globalThis.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({}),
  });
  await fetchProperties({
    filters: { city: "Portland", zipcode: "" },
    limit: 20,
    offset: 0,
  });
  expect(globalThis.fetch).toBeCalledWith(
    "/api/properties?city=Portland&limit=20&offset=0",
  );
});

test("builds correct query string from multiple filters", async () => {
  globalThis.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({}),
  });

  await fetchProperties({
    filters: {
      city: "Portland",
      beds: "3",
      minPrice: "1000000",
    },
    limit: 20,
    offset: 0,
  });

  const calledUrl = globalThis.fetch.mock.calls[0][0];

  expect(calledUrl).toContain("city=Portland");
  expect(calledUrl).toContain("beds=3");
  expect(calledUrl).toContain("minPrice=1000000");
});

test("network error", async () => {
  globalThis.fetch.mockRejectedValue(new Error("Network request failed"));
  await expect(
    fetchProperties({
      filters: {},
      limit: 20,
      offset: 0,
    }),
  ).rejects.toThrow("Network request failed");
});
