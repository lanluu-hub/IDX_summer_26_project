const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "dateListed-desc", label: "Date Listed: Newest" },
  { value: "dateListed-asc", label: "Date Listed: Oldest" },
  { value: "sqft-desc", label: "Square Footage: High to Low" },
  { value: "sqft-asc", label: "Square Footage: Low to High" },
  { value: "beds-desc", label: "Beds: High to Low" },
  { value: "beds-asc", label: "Beds: Low to High" },
];

// props: value (current combined string, or null/"" for "no sort applied"), onChange
const SortControls = ({ value, onChange }) => {
  const handleChange = (e) => {
    const selected = e.target.value;
    const [sortBy, sortOrder] = selected.split("-");
    // careful: "dateListed-asc".split("-") is fine, but if you ever add a sortBy key
    // with a hyphen in it this breaks — your current keys (price/dateListed/sqft/beds) are safe
    onChange(sortBy, sortOrder);
  };

  return (
    <select value={value} onChange={handleChange} className="form-select">
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default SortControls;
