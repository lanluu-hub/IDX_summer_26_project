import { describe, test, expect } from "vitest";
import generatePagination from "./pagination";

describe("generatePagination Testing", () => {
  test("returns all pages when totalPages is small (no ellipsis needed)", () => {
    const result = generatePagination(1, 9);
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test("shows both ellipses when currentPage is in the middle of a large range", () => {
    const result = generatePagination(10, 24);
    expect(result).toEqual([1, "...", 8, 9, 10, 11, 12, "...", 24]);
  });

  test("shows only right ellipsis when currentPage is near the start", () => {
    const result = generatePagination(3, 24);
    expect(result).toEqual([1, 2, 3, 4, 5, "...", 24]);
  });

  test("shows only left ellipsis when currentPage is near the end", () => {
    const result = generatePagination(22, 24);
    expect(result).toEqual([1, "...", 20, 21, 22, 23, 24]);
  });

  test("shows only single page", () => {
    const result = generatePagination(1, 1);
    expect(result).toEqual([1]);
  });

  test("Debug Challenge test (no double last page)", () => {
    const result = generatePagination(24, 24);
    expect(result).toEqual([1, "...", 22, 23, 24]);
  });
});
