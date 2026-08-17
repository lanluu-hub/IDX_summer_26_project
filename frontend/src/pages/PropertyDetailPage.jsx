import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchOpenHouses, fetchPropertyDetail } from "../api/client";
import PropertyHeader from "../components/PropertyHeader";
import PropertyStats from "../components/PropertyStats";
import DescriptionSection from "../components/DescriptionSection";
import PropertyDetailsSection from "../components/PropertyDetailsSection";
import OpenHouseList from "../components/OpenHouseList";
import PropertyImageGallery from "../components/PropertyImageGallery";
import PropertyMap from "../components/PropertyMap";
import React from "react";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  async function loadPropertyDetail({ id }) {
    setLoading(true);
    setError(null);

    try {
      const property = await fetchPropertyDetail({ id });

      setPropertyData(property);
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
    <main className="container">
      <h1>Detail</h1>
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
      {!loading && !error && propertyData && (
        <>
          <PropertyImageGallery property={propertyData} />

          <PropertyHeader property={propertyData} />

          <PropertyStats
            beds={propertyData.L_Keyword2}
            baths={propertyData.LM_Dec_3}
            sqft={propertyData.LM_Int2_3}
            yearBuilt={propertyData.YearBuilt}
          />

          <div className="row g-4">
            <div className="col-lg-7">
              <DescriptionSection remark={propertyData.L_Remarks} />

              {propertyData.LMD_MP_Latitude == 0 ||
              propertyData.LMD_MP_Longitude == 0 ? (
                <span className="text-muted">Map unavailable</span>
              ) : (
                <div className="shadow-sm rounded">
                  <PropertyMap
                    apiKey={API_KEY}
                    lat={propertyData.LMD_MP_Latitude}
                    lng={propertyData.LMD_MP_Longitude}
                  />
                </div>
              )}
              <OpenHouseList id={propertyData.L_ListingID} />
            </div>

            <div className="col-lg-5">
              <PropertyDetailsSection property={propertyData} />
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default PropertyDetailPage;
