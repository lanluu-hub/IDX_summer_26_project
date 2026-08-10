const PropertyMap = ({ apiKey, lat, lng }) => {
  if (!lat || !lng) {
    return <span className="text-muted">Map unavailable</span>;
  }
  // Combine latitude and longitude into a single string for the query parameter
  const coordinateQuery = encodeURIComponent(`${lat},${lng}`);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${coordinateQuery}&zoom=15`;

  return (
    <>
      <iframe
        src={mapUrl}
        title="Property Map"
        width="100%"
        height="450"
        loading="lazy"
        allowFullScreen
        style={{ border: 0 }}
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
        className="btn btn-primary animate__animated my-2"
        target="_blank"
        rel="noopener noreferrer"
        role="button"
      >
        <i className="bi bi-geo-alt-fill me-2"></i>Get Directions
      </a>
    </>
  );
};

export default PropertyMap;
