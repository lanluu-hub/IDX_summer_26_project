export function formatPropertyType(typeRaw) {
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
  return `${formattedType}`;
}
