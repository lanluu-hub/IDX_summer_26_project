import { formatPropertyType } from "../utils/formatPropertyType";

const PropertyDetailsSection = ({ property }) => {
  const UNKNOWN = <span className="text-muted">Unknown</span>;

  // Array map to eliminate repeating list item boilerplate
  const details = [
    {
      label: "Property Type",
      value: property.L_Type_ ? formatPropertyType(property.L_Type_) : UNKNOWN,
    },
    {
      label: "Status",
      value: property.L_Status ?? UNKNOWN,
    },
    {
      label: "County",
      value: property.CountyOrParish ?? UNKNOWN,
    },
    {
      label: "Lot Size",
      value: property.LotSizeAcres ? `${property.LotSizeAcres} Acres` : UNKNOWN,
    },
    {
      label: "Living Area",
      value: property.LM_Int2_3 ? (
        <>
          {property.LM_Int2_3} ft<sup>2</sup>
        </>
      ) : (
        UNKNOWN
      ),
    },
    {
      label: "Year Built",
      value: property.YearBuilt ?? UNKNOWN,
    },
    {
      label: "Stories",
      value: property.StoriesTotal ?? UNKNOWN,
    },
    {
      label: "Style",
      value: property.ArchitecturalStyle ?? UNKNOWN,
    },
    {
      label: "Parcel Number",
      value: property.ParcelNumber ?? UNKNOWN,
    },
    {
      label: "Days on Market",
      value: property.DaysOnMarket ?? UNKNOWN,
    },
  ];

  return (
    <section className="mb-4">
      <h2 className="h4 mb-3">Property Details</h2>

      <ul className="list-group list-group-flush">
        {details.map((item) => (
          <li
            key={item.label}
            className="list-group-item d-flex justify-content-between align-items-start py-3"
          >
            <strong className="text-secondary">{item.label}</strong>

            <span className="text-end fw-semibold ps-3">{item.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PropertyDetailsSection;
