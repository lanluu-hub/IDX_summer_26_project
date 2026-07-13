import "./PropertyCard.css";

function getFirstPhoto(photos) {
  try {
    if (photos === null || photos === undefined || photos === "") {
      return null;
    }

    const photoSrc = JSON.parse(photos);

    if (Array.isArray(photoSrc) && photoSrc.length === 0) {
      return null;
    }

    return photoSrc[0];
  } catch (error) {
    console.error("Parse failed at:", error.message);
    return null;
  }
}

function PropertyCard({ property }) {
  const image = getFirstPhoto(property.L_Photos);

  return (
    <div className="property-card-container">
      <div className="property-card">
        <div className="property-image">
          {image ? (
            <img src={image} alt="Property" />
          ) : (
            <div className="no-image">No Image</div>
          )}
        </div>

        <div className="property-content">
          <h3>${Number(property.L_SystemPrice).toLocaleString()}</h3>

          <p className="property-address">{property.L_Address}</p>

          <p>
            {property.L_City}, {property.L_State}
          </p>

          <p>
            <strong>Beds:</strong> {property.L_Keyword2} &nbsp;|&nbsp;
            <strong>Baths:</strong> {property.LM_Dec_3}
          </p>

          <p>
            <strong>Living Area:</strong> {property.LM_Int2_3} sqft
          </p>
        </div>
      </div>
    </div>
  );
}
export default PropertyCard;
