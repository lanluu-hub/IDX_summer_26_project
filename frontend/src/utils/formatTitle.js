import { formatPropertyType } from "./formatPropertyType";

export function formatTitle(typeRaw, subdivision, city, fallbackAddress) {
  const location = subdivision || city || "";
  let formattedType = "";

  formattedType = `${formatPropertyType(typeRaw)}`;

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
