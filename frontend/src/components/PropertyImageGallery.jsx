import { useState } from "react";
import { Carousel, Modal, Row, Col } from "react-bootstrap";
import PlaceholderImage from "./PlaceholderImage";

const parsePhotos = (rawPhotos) => {
  try {
    if (rawPhotos === null || rawPhotos === undefined) {
      return [];
    }

    const parsedPhotos = JSON.parse(rawPhotos);
    if (!Array.isArray(parsedPhotos)) {
      return [];
    }

    return parsedPhotos;
  } catch (error) {
    console.error("Parse failed at:", error.message);
    return [];
  }
};

const PropertyImageGallery = ({ property }) => {
  const photos = parsePhotos(property.L_Photos);
  const [activeIdx, setActiveIdx] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  if (photos.length === 0) {
    return <PlaceholderImage height="400px" />;
  }

  const handleSelect = (selectedIdx) => {
    setActiveIdx(selectedIdx);
  };

  return (
    <>
      {/* Main carousel */}
      <Carousel
        activeIndex={activeIdx}
        onSelect={handleSelect}
        indicators={false}
      >
        {photos.map((url, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100 rounded "
              src={url}
              alt={index}
              onClick={() => setShowLightbox(true)}
              style={{
                cursor: "pointer",
                height: "400px",
                objectFit: "cover",
              }}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      <Modal
        show={showLightbox}
        onHide={() => setShowLightbox(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="p-0">
          {/* Full-size image carousel */}
          <Carousel
            activeIndex={activeIdx}
            onSelect={handleSelect}
            indicators={false}
          >
            {photos.map((url, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={url}
                  alt={`Property photo ${index + 1}`}
                  style={{
                    height: "75vh",
                    objectFit: "contain",
                    backgroundColor: "#000",
                  }}
                />
              </Carousel.Item>
            ))}
          </Carousel>

          {/* Thumbnail strip */}
          <div
            className="d-flex gap-2 overflow-auto p-2"
            style={{
              backgroundColor: "#000",
            }}
          >
            {photos.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => handleSelect(index)}
                style={{
                  width: "80px",
                  height: "60px",
                  flexShrink: 0,
                  objectFit: "cover",
                  cursor: "pointer",
                  opacity: index === activeIdx ? 1 : 0.6,
                  border:
                    index === activeIdx
                      ? "3px solid white"
                      : "3px solid transparent",
                  borderRadius: "4px",
                  transition: "opacity 0.2s ease",
                }}
              />
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PropertyImageGallery;
