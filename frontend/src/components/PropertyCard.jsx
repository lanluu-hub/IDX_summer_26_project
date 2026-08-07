import "./PropertyCard.css";
import { formatPrice } from "../utils/formatPrice";
import PlaceholderImage from "./PlaceholderImage";

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
    <div className="card h-100 shadow-sm">
      {image ? (
        <img
          src={image}
          alt=""
          className="card-img-top"
          style={{ height: "220px", objectFit: "cover" }}
        />
      ) : (
        <PlaceholderImage height="220px" />
      )}

      <div className="card-body">
        <h3 className="card-title text-success">
          {formatPrice(property.L_SystemPrice)}
        </h3>
        <address>
          <p className="fw-bold mb-1">{property.L_Address}</p>

          <p className="text-muted mb-2">
            {property.L_City}, {property.L_State}
          </p>
        </address>
        <p className="mb-2">
          <strong>Beds:</strong> {property.L_Keyword2} &nbsp;|&nbsp;
          <strong>Baths:</strong> {property.LM_Dec_3}
        </p>

        <p className="mb-3">
          <strong>Living Area:</strong> {property.LM_Int2_3} sqft
        </p>
      </div>
    </div>
  );
}

export default PropertyCard;
