import { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import { fetchProperties } from "../api/client";

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

  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true);
        const data = await fetchProperties();
        // DEBUG
        console.log(data);
        setProperties(data);
      } catch (err) {
        // fetchProperties() has no internal try/catch (by design, see
        // client.js) - errors bubble up and get caught here.
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
    // Empty deps: fetch once on mount only.
  }, []);

  return (
    <section className="container py-4" role="region">
      <h2 className="mb-4">Properties List</h2>

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
              <PropertyCard property={property} />
            </div>
          ))}
      </div>
      {!loading && !error && (
        <p className="text-end">
          Showing {properties.results?.length} of {properties.total} properties
        </p>
      )}
    </section>
  );
}

export default ListingPage;
