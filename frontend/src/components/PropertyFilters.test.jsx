import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PropertyFilters from "./PropertyFilters";
import { beforeEach, describe, expect } from "vitest";
import { useState } from "react";

const testFilters = {
  city: "Portland",
  zipcode: "97201",
  minPrice: "200000",
  maxPrice: "500000",
  beds: "3",
  baths: "2.0",
};

const emptyFilters = {
  city: "",
  zipcode: "",
  minPrice: "",
  maxPrice: "",
  beds: "",
  baths: "",
};

const mockOnChange = vi.fn();
const mockOnSubmit = vi.fn();
const mockOnReset = vi.fn();

let user;

beforeEach(() => {
  vi.clearAllMocks();
  user = userEvent.setup();
});

const StatefulPropertyFilters = ({
  onChangeSpy = vi.fn(),
  onResetSpy = vi.fn(),
}) => {
  const [filters, setFilters] = useState(testFilters);

  const handleChange = (event) => {
    const { name, value } = event.target;

    onChangeSpy({ name, value });

    setFilters((previousFilters) => ({
      ...previousFilters,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFilters(emptyFilters);
    onResetSpy();
  };

  return (
    <PropertyFilters
      filters={filters}
      onChange={handleChange}
      onSubmit={mockOnSubmit}
      onReset={handleReset}
    />
  );
};

const renderFilters = (override = {}) => {
  return render(
    <PropertyFilters
      filters={testFilters}
      onChange={mockOnChange}
      onSubmit={mockOnSubmit}
      onReset={mockOnReset}
      {...override}
    />,
  );
};

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

  describe("Typing/selecting in a field calls onChange", () => {
    test("updates the city when the user types", async () => {
      const onChangeSpy = vi.fn();

      render(<StatefulPropertyFilters onChangeSpy={onChangeSpy} />);

      const cityInput = screen.getByLabelText("City");

      await user.clear(cityInput);
      await user.type(cityInput, "Seattle");

      expect(cityInput).toHaveValue("Seattle");
      expect(onChangeSpy).toHaveBeenLastCalledWith({
        name: "city",
        value: "Seattle",
      });
    });

    test("updates beds when an option is selected", async () => {
      const onChangeSpy = vi.fn();

      render(<StatefulPropertyFilters onChangeSpy={onChangeSpy} />);

      const bedsSelect = screen.getByLabelText("Beds");

      await user.selectOptions(bedsSelect, "5+");

      expect(bedsSelect).toHaveValue("5+");
      expect(onChangeSpy).toHaveBeenLastCalledWith({
        name: "beds",
        value: "5+",
      });
    });
  });

  test("Submitting the form calls onSubmit", async () => {
    mockOnSubmit.mockImplementation((event) => {
      event.preventDefault();
    });

    renderFilters();

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnReset).not.toHaveBeenCalled();
  });

  test("Clicking Clear Filters calls onReset", async () => {
    const onResetSpy = vi.fn();

    render(<StatefulPropertyFilters onResetSpy={onResetSpy} />);

    expect(screen.getByLabelText("City")).toHaveValue("Portland");
    expect(screen.getByLabelText("Beds")).toHaveValue("3");

    await user.click(screen.getByRole("button", { name: /reset/i }));

    expect(screen.getByLabelText("City")).toHaveValue("");
    expect(screen.getByLabelText("Zipcode")).toHaveValue("");
    expect(screen.getByLabelText("Minimum Price")).toHaveValue(null);
    expect(screen.getByLabelText("Maximum Price")).toHaveValue(null);
    expect(screen.getByLabelText("Beds")).toHaveValue("");
    expect(screen.getByLabelText("Baths")).toHaveValue("");
    expect(onResetSpy).toHaveBeenCalledTimes(1);
  });
});
