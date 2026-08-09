const PropertyMap = ({ apiKey, lat, lng }) => {
  if (!lat || !lng) {
    return <span className="text-muted">Map unavailable</span>;
  }
  // Combine latitude and longitude into a single string for the query parameter
  const coordinateQuery = encodeURIComponent(`${lat},${lng}`);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${coordinateQuery}&zoom=17`;

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
    </>
  );
};

export default PropertyMap;
