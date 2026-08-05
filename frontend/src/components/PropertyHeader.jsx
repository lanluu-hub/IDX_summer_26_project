import { formatPrice } from "../utils/formatPrice";
import { formatAddress } from "../utils/formatAddress";
import { formatTitle } from "../utils/formatTitle";

const PropertyHeader = ({ property }) => {
  return (
    <section className="container">
      <span className="fs-4">{formatPrice(property.L_SystemPrice)}</span>
      <h1>
        {formatTitle(
          property.L_Type_,
          property.SubdivisionName,
          property.L_City,
          property.L_Address,
        )}
      </h1>
      <address className="fw-lighter fs-5">
        <i className="bi bi-geo-alt me-2"></i>
        {formatAddress(
          property.L_Address,
          property.L_City,
          property.L_State,
          property.L_Zip,
        )}
      </address>
      <hr />
    </section>
  );
};

export default PropertyHeader;
