import { expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PropertyCard from "./PropertyCard";

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

describe("Property Card Component test", () => {
  test("render property data correctly", () => {
    render(<PropertyCard property={property} />);

    const details = screen.getByText("Beds:").closest("p");

    expect(
      screen.getByRole("heading", { name: "$450,000" }),
    ).toBeInTheDocument();
    expect(screen.getByText("627 SE 179th Ave")).toBeInTheDocument();
    expect(screen.getByText("Portland, OR")).toBeInTheDocument();
    expect(screen.getByText("No Image Available"));
    expect(details).toHaveTextContent("Beds:");
    expect(details).toHaveTextContent("3");
    expect(details).toHaveTextContent("Baths:");
    expect(details).toHaveTextContent("2.5");
  });

  test("render property with 1 photo", () => {
    const photoUrl = "https://example.com/house.jpg";
    const propertyWithOnePhoto = {
      ...property,
      L_Photos: JSON.stringify([photoUrl]),
    };

    const { container } = render(
      <PropertyCard property={propertyWithOnePhoto} />,
    );

    const image = container.querySelector("img");

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", photoUrl);
    expect(screen.queryByText("No Image Available")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Previous image" }),
    ).not.toBeInTheDocument();
  });

  test("render property with multiple photos", () => {
    const photoUrl = [
      "https://example.com/house-front.jpg",
      "https://example.com/house-kitchen.jpg",
    ];
    const propertyWithMultiplePhotos = {
      ...property,
      L_Photos: JSON.stringify(photoUrl),
    };

    render(<PropertyCard property={propertyWithMultiplePhotos} />);

    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Previous image" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next image" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("No Image Available")).not.toBeInTheDocument();
  });
});
