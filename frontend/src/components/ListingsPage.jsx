import { useState, useEffect, useRef } from "react";
import { fetchProperties } from "../api/client";
import { Link } from "react-router";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";
import Pagination from "./Pagination";

/**
 * ListingPage
 *
 * Fetches a page of properties from the backend and renders them as a
 * Bootstrap grid of PropertyCard components. Handles loading, error, and
 * empty states per Milestone 4 acceptance criteria.
 *
 * API response shape (see client.js -> fetchProperties):
 *   { total: number, limit: number, offset: number, results: Property[] }
 *
 */
function ListingPage() {
  const [properties, setProperties] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    results: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialFilterState = {
    city: "",
    zipcode: "",
    minPrice: "",
    maxPrice: "",
    beds: "",
    baths: "",
  };
  const [filters, setFilters] = useState(initialFilterState);
  const latestRequestId = useRef(0); // prevent race condition

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const handleChange = (e) => {
    let value = e.target.value;
    let name = e.target.name;

    setFilters((prevalue) => {
      return {
        ...prevalue, // Spread Operator
        [name]: value,
      };
    });
  };

  async function loadProperties({ filterParams = filters, limit, offset }) {
    const requestId = ++latestRequestId.current;

    try {
      setLoading(true);
      setError(null);

      const data = await fetchProperties({
        filters: filterParams,
        limit,
        offset,
      });

      if (requestId === latestRequestId.current) {
        setProperties(data);
      }
    } catch (err) {
      // fetchProperties() has no internal try/catch (by design, see
      // client.js) - errors bubble up and get caught here.
      if (requestId === latestRequestId.current) {
        setError(err.message);
      }
    } finally {
      if (requestId === latestRequestId.current) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    loadProperties({
      filterParams: filters,
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    });
    // Empty deps: fetch once on mount only.
  }, []);

  const totalPages = Math.ceil(properties.total / itemsPerPage);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadProperties({ filterParams: filters, limit: itemsPerPage, offset: 0 });
  };

  const handleReset = (e) => {
    setFilters(initialFilterState);
    setCurrentPage(1);
    loadProperties({
      filterParams: initialFilterState,
      limit: itemsPerPage,
      offset: 0,
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);

    loadProperties({
      filterParams: filters,
      limit: itemsPerPage,
      offset: (newPage - 1) * itemsPerPage,
    });

    window.scrollTo(0, 0);
  };

  return (
    <section className="container py-4" role="region">
      <PropertyFilters
        filters={filters}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />

      {/* {Error Occur} */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* {Loading} */}
      {loading && (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading Properties...</span>
          </div>
        </div>
      )}

      {/* {!loading && !error && (
        <p className="text-start">
          Showing <strong>{properties.results?.length}</strong> of{" "}
          <strong>{properties.total}</strong> properties
        </p>
      )} */}

      {/* Only show empty state once loading/error are ruled out, otherwise
          this briefly flashes before data arrives. */}
      {!loading && !error && properties.results?.length === 0 && (
        <p className="text-muted">No properties found.</p>
      )}

      {/* {render properties} */}
      <div className="row">
        {!loading &&
          !error &&
          properties.results.map((property) => (
            <div
              key={property.L_ListingID}
              className="col-sm-6 col-md-4 col-lg-3 mb-4"
            >
              <Link
                to={`/property/${property.L_ListingID}`}
                className="text-decoration-none text-reset"
              >
                <PropertyCard property={property} />
              </Link>
            </div>
          ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(properties.total / itemsPerPage)}
        itemsPerPage={itemsPerPage}
        total={properties.total}
        onPageChange={handlePageChange}
      />
    </section>
  );
}

export default ListingPage;
