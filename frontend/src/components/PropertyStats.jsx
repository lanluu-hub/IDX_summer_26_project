const PropertyStats = ({ beds, baths, sqft, yearBuilt }) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="d-flex align-items-center border rounded p-3 h-100">
            <i className="bi bi-moon fs-3 me-3"></i>

            <div>
              <p className="text-muted small mb-1">Bedroom</p>
              <p className="fw-bold fs-6 mb-0">{beds} Bedrooms</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="d-flex align-items-center border rounded p-3 h-100">
            <i className="bi bi-droplet fs-3 me-3"></i>

            <div>
              <p className="text-muted small mb-1">Bathroom</p>
              <p className="fw-bold fs-6 mb-0">{baths} Bathrooms</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="d-flex align-items-center border rounded p-3 h-100">
            <i className="bi bi-bounding-box-circles fs-3 me-3"></i>

            <div>
              <p className="text-muted small mb-1">Size</p>
              <p className="fw-bold fs-6 mb-0">
                {sqft} ft<sup>2</sup>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="d-flex align-items-center border rounded p-3 h-100">
            <i className="bi bi-calendar-month fs-3 me-3"></i>

            <div>
              <p className="text-muted small mb-1">Year Built</p>
              <p className="fw-bold fs-6 mb-0">{yearBuilt}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyStats;
