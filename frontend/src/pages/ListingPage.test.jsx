// Mock API boundary
vi.mock("../api/client", () => ({
  fetchProperties: vi.fn(),
}));
import { MemoryRouter, Route, Routes } from "react-router";
import { fetchProperties } from "../api/client";
import ListingPage from "./ListingsPage";
import { beforeEach, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const property = {
  L_ListingID: 101,
  L_Photos: null,
  L_SystemPrice: 450000,
  L_Address: "627 SE 179th Ave",
  L_City: "Portland",
  L_State: "OR",
  L_Keyword2: 3,
  LM_Dec_3: 2.5,
  LM_Int2_3: 1850,
};

const propertyResponse = {
  total: 1,
  limit: 20,
  offset: 0,
  results: [property],
};

let user;

beforeEach(() => {
  vi.clearAllMocks();
  user = userEvent.setup();
});

const router = (
  <MemoryRouter initialEntries={["/"]}>
    <Routes>
      <Route path="/" element={<ListingPage />} />
      <Route
        path="/property/:id"
        element={<div>Property Details destination</div>}
      />
    </Routes>
  </MemoryRouter>
);

describe("ListingPage navigation", () => {
  test("navigates to the selected property", async () => {
    // Arrange
    fetchProperties.mockResolvedValue(propertyResponse);

    // Render
    render(router);

    // find Property
    const address = await screen.findByText("627 SE 179th Ave");
    const link = address.closest("a");

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/property/101");

    // Click
    await user.click(link);

    // Assert
    expect(
      await screen.findByText("Property Details destination"),
    ).toBeInTheDocument();
    expect(fetchProperties).toHaveBeenCalledTimes(1);
  });
});
