export function formatTitle(typeRaw, subdivision, city, fallbackAddress) {
  const location = subdivision || city || "";
  let formattedType = "";

  if (typeRaw) {
    const specialCases = {
      SingleFamilyResidence: "Single-Family Residence",
      CoOwnership: "Co-Ownership",
      ManufacturedHome: "Manufactured Home",
      ManufacturedOnLand: "Manufactured on Land",
      MobileHome: "Mobile Home",
      BoatSlip: "Boat Slip",
      MixedUse: "Mixed Use",
      OwnYourOwn: "Own Your Own",
      StockCooperative: "Stock Cooperative",
    };

    if (specialCases[typeRaw]) {
      formattedType = specialCases[typeRaw];
    } else {
      // 2. Fallback: Split camelCase into spaced words
      formattedType = typeRaw
        .replace(/(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/g, " ")
        .trim();
    }
  }

  if (formattedType && location) {
    return `${formattedType} in ${titleCase(location)}`;
  } else if (location) {
    return titleCase(location); // Omit type completely if null
  }

  return fallbackAddress || "Property Details";
}

// Simple helper to clean up casing
function titleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
}
