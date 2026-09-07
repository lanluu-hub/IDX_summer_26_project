const PropertyStats = ({ beds, baths, sqft, yearBuilt }) => {
  const UNKNOWN = <span className="text-muted">Unknown</span>;

  const stats = [
    {
      label: "Bedrooms",
      value: beds ? `${beds} Bedrooms` : UNKNOWN,
      icon: "bi bi-moon",
    },
    {
      label: "Bathrooms",
      value: baths ? `${baths} Bathrooms` : UNKNOWN,
      icon: "bi bi-droplet",
    },
    {
      label: "Living Area",
      value: sqft ? (
        <>
          {sqft} ft<sup>2</sup>
        </>
      ) : (
        UNKNOWN
      ),
      icon: "bi bi-bounding-box-circles",
    },
    {
      label: "Year Built",
      value: yearBuilt ?? UNKNOWN,
      icon: "bi bi-calendar-month",
    },
  ];

  return (
    <section className="mb-4">
      <div className="row g-3">
        {stats.map((stat) => (
          <div key={stat.label} className="col-6 col-lg-3">
            <div className="d-flex align-items-center border rounded p-3 h-100">
              <i className={`${stat.icon} fs-3 me-3`}></i>

              <div>
                <p className="text-muted small mb-1">{stat.label}</p>
                <p className="fw-bold mb-0">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyStats;
