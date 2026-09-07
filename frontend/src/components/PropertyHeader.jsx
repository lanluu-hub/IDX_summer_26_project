import { formatPrice } from "../utils/formatPrice";
import { formatAddress } from "../utils/formatAddress";
import { formatTitle } from "../utils/formatTitle";

const PropertyHeader = ({ property }) => {
  return (
    <section className="mb-4">
      <span className="display-6 fw-bold mb-1 text-success">
        {formatPrice(property.L_SystemPrice)}
      </span>
      <h2 className="mb-2">
        {formatTitle(
          property.L_Type_,
          property.SubdivisionName,
          property.L_City,
          property.L_Address,
        )}
      </h2>
      <div className="text-muted fs-5 mb-0">
        <i className="bi bi-geo-alt me-2"></i>
        {formatAddress(
          property.L_Address,
          property.L_City,
          property.L_State,
          property.L_Zip,
        )}
      </div>
      <hr />
    </section>
  );
};

export default PropertyHeader;
