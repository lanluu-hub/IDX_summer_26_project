import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PropertyFilters from "./PropertyFilters";
import { beforeEach } from "vitest";

const testFilters = {
  city: "Portland",
  zipcode: "97201",
  minPrice: "200000",
  maxPrice: "500000",
  beds: "3",
  baths: "2.0",
};

const mockOnChange = vi.fn();
const mockOnSubmit = vi.fn();
const mockOnReset = vi.fn();

const user = userEvent.setup();

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Property Filter Test", () => {
  test("all filters are rendered with correct value", () => {
    render(
      <PropertyFilters
        filters={testFilters}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
      />,
    );

    expect(screen.getByLabelText("City")).toHaveValue("Portland");
    expect(screen.getByLabelText("Zipcode")).toHaveValue("97201");
    expect(screen.getByLabelText("Minimum Price")).toHaveValue(200000);
    expect(screen.getByLabelText("Maximum Price")).toHaveValue(500000);
    expect(screen.getByLabelText("Beds")).toHaveValue("3");
    expect(screen.getByLabelText("Baths")).toHaveValue("2.0");
  });

  test("Typing/selecting in a field calls onChange", async () => {
    render(
      <PropertyFilters
        filters={testFilters}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
      />,
    );

    const cityInput = screen.getByLabelText("City");

    await user.clear(cityInput);
    await user.type(cityInput, "Seattle");

    expect(mockOnChange).toHaveBeenCalled();
  });

  test("Submitting the form calls onSubmit", async () => {
    render(
      <PropertyFilters
        filters={testFilters}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
      />,
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test("Clicking Clear Filters calls onReset", async () => {
    render(
      <PropertyFilters
        filters={testFilters}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
      />,
    );

    await user.click(screen.getByRole("button", { name: /reset/i }));

    expect(mockOnReset).toHaveBeenCalled();
  });
});
