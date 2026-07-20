import { useState } from "react";

function PropertyFilters({ filters, onChange, onSubmit, onReset }) {
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="my-4">
        <div className="row g-3 p-3 border rounded shadow-sm">
          <div className="form-floating col-md-6">
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={onChange}
              className="form-control"
              id="cityFilter"
              placeholder=" "
            />
            <label htmlFor="cityFilter">City</label>
          </div>

          <div className="form-floating col-md-3">
            <input
              type="text"
              name="zipcode"
              value={filters.zipcode}
              onChange={onChange}
              className="form-control"
              id="zipcodeFilter"
              placeholder=" "
            />
            <label htmlFor="zipcodeFilter">Zipcode</label>
          </div>

          <div className="form-floating col-md-3">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={onChange}
              className="form-control"
              id="minPriceFilter"
              placeholder=" "
            />
            <label htmlFor="minPriceFilter">Minimum Price</label>
          </div>

          <div className="form-floating col-md-4">
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={onChange}
              className="form-control"
              id="maxPriceFilter"
              placeholder=" "
            />
            <label htmlFor="maxPriceFilter">Maximum Price</label>
          </div>

          <div className="form-floating col-md-4">
            <select
              className="form-select"
              name="beds"
              value={filters.beds}
              onChange={onChange}
              id="bedFilter"
              aria-label="Floating label beds filter"
            >
              <option value="">Any</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5+">5+</option>
            </select>
            <label htmlFor="bedFilter">Beds</label>
          </div>

          <div className="form-floating col-md-4">
            <select
              className="form-select"
              name="baths"
              value={filters.baths}
              onChange={onChange}
              id="bathFilter"
              aria-label="Floating label baths filter"
            >
              <option value="">Any</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5+">5+</option>
            </select>
            <label htmlFor="bathFilter">Baths</label>
          </div>
          <div className="col-12 d-flex justify-content-end gap-2">
            <input
              className="btn btn-secondary"
              type="button"
              value="Reset"
              onClick={onReset}
            />
            <input className="btn btn-primary" type="submit" value="Submit" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default PropertyFilters;
