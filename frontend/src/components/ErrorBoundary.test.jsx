import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

function BrokenComponent() {
  throw new Error("Test error");
}

test("displays fallback UI when a child component throws", () => {
  render(
    <ErrorBoundary>
      <BrokenComponent />
    </ErrorBoundary>,
  );

  expect(
    screen.getByRole("heading", { name: /something went wrong/i }),
  ).toBeInTheDocument();

  expect(
    screen.getByText(/we couldn't display this page/i),
  ).toBeInTheDocument();

  expect(
    screen.getByRole("button", { name: /reload page/i }),
  ).toBeInTheDocument();
});
