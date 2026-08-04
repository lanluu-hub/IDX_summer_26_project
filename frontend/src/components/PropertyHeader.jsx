import { formatPrice } from "../utils/formatPrice";
import { formatAddress } from "../utils/formatAddress";

const PropertyHeader = ({ price, address, city, state, zip }) => {
  return (
    <div className="container">
      <h1>{formatPrice(price)}</h1>
      <address className="fw-lighter fs-5">
        <i className="bi bi-geo-alt me-2"></i>
        {formatAddress(address, city, state, zip)}
      </address>
      <hr />
    </div>
  );
};

export default PropertyHeader;
