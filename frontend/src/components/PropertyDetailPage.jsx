import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchOpenHouses, fetchPropertyDetail } from "../api/client";
import PropertyHeader from "./PropertyHeader";
import PropertyStats from "./PropertyStats";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [propertyData, setPropertyData] = useState(null);
  const [openhousesData, setOpenHousesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadPropertyDetail({ id }) {
    setLoading(true);
    setError(null);

    try {
      const [property, openhouses] = await Promise.all([
        fetchPropertyDetail({ id }),
        fetchOpenHouses({ id }),
      ]);

      setPropertyData(property);
      setOpenHousesData(openhouses);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPropertyDetail({ id });
  }, [id]);

  return (
    <main>
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
      {!loading && !error && propertyData === null && (
        <p className="text-muted">No properties found.</p>
      )}

      {/* Gallery */}
      {!loading && !error && <PropertyHeader property={propertyData} />}
      {/* About Property */}
      {!loading && !error && (
        <PropertyStats
          beds={propertyData.L_Keyword2}
          baths={propertyData.LM_Dec_3}
          sqft={propertyData.LM_Int2_3}
          yearBuilt={propertyData.YearBuilt}
        />
      )}
      {/* Map */}
      {/* Open Houses */}
    </main>
  );
};

export default PropertyDetailPage;
