import "./PropertyCard.css";
import { formatPrice } from "../utils/formatPrice";
import PlaceholderImage from "./PlaceholderImage";
import PropertyImageCarousel from "./PropertyImageCarousel";
import { parsePhotos } from "../utils/photos";
import PropTypes from "prop-types";

function PropertyCard({ property }) {
  const parsedPhotos = parsePhotos(property.L_Photos);

  return (
    <div className="card h-100 shadow-sm property-card">
      {parsedPhotos.length === 0 && <PlaceholderImage height="220px" />}
      {parsedPhotos.length === 1 && (
        <img
          src={parsedPhotos[0]}
          className="card-img-top"
          style={{ height: "220px", objectFit: "cover" }}
          alt=""
        />
      )}
      {parsedPhotos.length > 1 && (
        <PropertyImageCarousel photos={parsedPhotos} />
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

PropertyCard.propTypes = {
  property: PropTypes.shape({
    L_Photos: PropTypes.string,
    L_SystemPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    L_Address: PropTypes.string,
    L_City: PropTypes.string,
    L_State: PropTypes.string,
    L_Keyword2: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    LM_Dec_3: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    LM_Int2_3: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
};

export default PropertyCard;
