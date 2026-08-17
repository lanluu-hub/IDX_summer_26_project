import { useEffect, useState } from "react";
import { fetchOpenHouses } from "../api/client";
import { formatDate } from "../utils/formatDate";
import { formatTime } from "../utils/formatTime";

const getOpenHouseDetail = (openHouseAlldata) => {
  try {
    if (
      openHouseAlldata === null ||
      openHouseAlldata === undefined ||
      openHouseAlldata === ""
    ) {
      return null;
    }

    const details = JSON.parse(openHouseAlldata);

    return details;
  } catch (error) {
    console.error("Parse failed at:", error.message);
    return null;
  }
};

const OpenHouseList = ({ id }) => {
  const [openHouses, setOpenHouses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadOpenHouses({ id }) {
    setLoading(true);
    setError(null);

    try {
      const openHouses = await fetchOpenHouses({ id });

      if (openHouses) {
        setOpenHouses(openHouses);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOpenHouses({ id });
  }, [id]);

  return (
    <section className="my-4">
      {/* {Error Occur} */}
      {error && <p className="text-muted">Unable to load open houses.</p>}

      {/* {Loading} */}
      {loading && (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading open houses...</span>
          </div>
        </div>
      )}

      {/* Only show empty state once loading/error are ruled out, otherwise
          this briefly flashes before data arrives. */}
      {!loading && !error && openHouses.length === 0 && (
        <p className="text-muted">No open houses scheduled.</p>
      )}

      {!loading && !error && openHouses.length > 0 && (
        <>
          <h2 className="h4 mb-3">Open Houses</h2>

          <div className="row g-3">
            {openHouses.map((house) => {
              const details = getOpenHouseDetail(house.all_data);

              return (
                <div key={house.id} className="col-12">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h3 className="h5 mb-3">
                        <i className="bi bi-calendar-event me-2"></i>
                        {formatDate(house.OpenHouseDate)}
                      </h3>

                      <p className="mb-2">
                        <i className="bi bi-clock me-2"></i>
                        {formatTime(house.OH_StartTime)} -{" "}
                        {formatTime(house.OH_EndTime)}
                      </p>

                      {details?.OpenHouseRemarks ? (
                        <p className="mb-0 text-secondary">
                          <i className="bi bi-info-circle me-2"></i>
                          {details.OpenHouseRemarks}
                        </p>
                      ) : (
                        <p className="mb-0 text-muted">
                          No additional information available.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};

export default OpenHouseList;
