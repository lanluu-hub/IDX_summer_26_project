import { expect } from "vitest";
import { fetchProperties } from "./client";

beforeEach(() => {
  global.fetch = vi.fn();
});

test("resolves with parsed JSON data", async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ total: 1, limit: 20, offset: 0, results: [] }),
  });

  const data = await fetchProperties();
  expect(data).toEqual({ total: 1, limit: 20, offset: 0, results: [] });
  expect(fetch).toHaveBeenCalledOnce();
});

test("Http Error Path", async () => {
  global.fetch.mockResolvedValue({
    ok: false,
    status: 400,
    json: async () => ({ error: ". . ." }),
  });
  await expect(fetchProperties()).rejects.toThrow(/Status: 400/);
});

test("does not include empty filters in the request URL", async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({}),
  });
  await fetchProperties({ city: "Portland", zipcode: "" });
  expect(global.fetch).toBeCalledWith("/api/properties?city=Portland");
});

test("builds correct query string from multiple filters", async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({}),
  });

  await fetchProperties({
    city: "Portland",
    beds: "3",
    minPrice: "1000000",
  });

  const calledUrl = global.fetch.mock.calls[0][0];

  expect(calledUrl).toContain("city=Portland");
  expect(calledUrl).toContain("beds=3");
  expect(calledUrl).toContain("minPrice=1000000");
});

test("network error", async () => {
  global.fetch.mockRejectedValue(new Error("Network request failed"));
  await expect(fetchProperties()).rejects.toThrow("Network request failed");
});
