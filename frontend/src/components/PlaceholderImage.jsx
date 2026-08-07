const PlaceholderImage = ({ height = "220px" }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ height: height }}
    >
      No Image Available
    </div>
  );
};

export default PlaceholderImage;
