import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";
import Pagination from "./Pagination";

const mockOnPageChange = vi.fn();

let user;

beforeEach(() => {
  vi.clearAllMocks();
  user = userEvent.setup();
});

describe("Pagination Component Test", () => {
  test("renders summary text with correct numbers", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        itemsPerPage={10}
        total={95}
        onPageChange={mockOnPageChange}
      />,
    );

    // firstIndex=21, lastIndex=30
    expect(
      screen.getByText((content, element) => {
        return element.textContent === "Showing 21-30 of 95 properties";
      }),
    );
  });

  test("renders summary text at final page", () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={10}
        itemsPerPage={10}
        total={95}
        onPageChange={mockOnPageChange}
      />,
    );

    // firstIndex=21, lastIndex=30
    expect(
      screen.getByText((content, element) => {
        return element.textContent === "Showing 91-95 of 95 properties";
      }),
    );
  });

  test("Previous/Next disabled states", () => {
    const { rerender } = render(
      <Pagination
        currentPage={1}
        totalPages={10}
        itemsPerPage={10}
        total={95}
        onPageChange={mockOnPageChange}
      />,
    );

    // Previous disabled & Next is enable
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).toBeEnabled();

    rerender(
      <Pagination
        currentPage={10}
        totalPages={10}
        itemsPerPage={10}
        total={95}
        onPageChange={mockOnPageChange}
      />,
    );

    // Previous Enabled & Next is Disabled
    expect(screen.getByRole("button", { name: /previous/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  test("clicking a page number navigates", async () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        itemsPerPage={10}
        total={95}
        onPageChange={mockOnPageChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "3" }));

    expect(mockOnPageChange).toHaveBeenLastCalledWith(3);
  });

  test("hidden when only one page", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        itemsPerPage={10}
        total={9}
        onPageChange={mockOnPageChange}
      />,
    );

    expect(screen.queryByRole("navigation")).toBeNull();
    expect(screen.getByText(/showing/i)).toBeInTheDocument(); // Check summary text still show rerender
  });

  test("renders nothing when there are no pages", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={0}
        itemsPerPage={10}
        total={0}
        onPageChange={mockOnPageChange}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  test("clicking the active page is a no-op", async () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        itemsPerPage={10}
        total={95}
        onPageChange={mockOnPageChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "1" }));

    expect(mockOnPageChange).toHaveBeenCalledTimes(0);
  });

  test("ellipsis renders in the DOM", () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={24}
        itemsPerPage={10}
        total={240}
        onPageChange={mockOnPageChange}
      />,
    );

    expect(screen.getAllByText("...")).toHaveLength(2);
  });

  test("clicking on previous render previous page", async () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={24}
        itemsPerPage={10}
        total={240}
        onPageChange={mockOnPageChange}
      />,
    );

    const previousBtn = screen.getByRole("button", { name: /previous/i });

    await user.click(previousBtn);

    expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    expect(mockOnPageChange).toHaveBeenCalledWith(9);
  });

  test("clicking on next render next page", async () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={24}
        itemsPerPage={10}
        total={240}
        onPageChange={mockOnPageChange}
      />,
    );

    const nextBtn = screen.getByRole("button", { name: /next/i });

    await user.click(nextBtn);

    expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    expect(mockOnPageChange).toHaveBeenCalledWith(11);
  });
});
