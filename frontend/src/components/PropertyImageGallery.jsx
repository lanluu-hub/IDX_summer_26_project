import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import PlaceholderImage from "./PlaceholderImage";
import { parsePhotos } from "../utils/photos";

const PropertyImageGallery = ({ property }) => {
  const photos = parsePhotos(property?.L_Photos);

  const [activeIdx, setActiveIdx] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  if (photos.length === 0) {
    return <PlaceholderImage height="400px" />;
  }

  const activePhoto = photos[activeIdx];

  const goPrevious = () => {
    setActiveIdx((current) =>
      current === 0 ? photos.length - 1 : current - 1,
    );
  };

  const goNext = () => {
    setActiveIdx((current) =>
      current === photos.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <>
      {/* Main image */}
      <div>
        <button
          type="button"
          className="border-0 bg-transparent p-0 w-100"
          onClick={() => setShowLightbox(true)}
          aria-label="Open property photos"
        >
          <img
            src={activePhoto}
            alt={`Property photo ${activeIdx + 1}`}
            className="d-block w-100 rounded"
            style={{
              height: "400px",
              objectFit: "cover",
              cursor: "zoom-in",
            }}
          />
        </button>

        {/* Scrollable thumbnail strip */}
        {photos.length > 1 && (
          <div
            className="d-flex gap-2 overflow-auto mt-2 pb-1"
            aria-label="Property photo thumbnails"
          >
            {photos.map((url, index) => (
              <button
                key={`${url}-${index}`}
                type="button"
                className="border-0 bg-transparent p-0 flex-shrink-0"
                onClick={() => setActiveIdx(index)}
                aria-label={`View property photo ${index + 1}`}
                aria-current={index === activeIdx ? "true" : undefined}
              >
                <img
                  src={url}
                  alt={`Thumbnail ${index + 1}`}
                  style={{
                    width: "80px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    cursor: "pointer",
                    opacity: index === activeIdx ? 1 : 0.6,
                    border:
                      index === activeIdx
                        ? "3px solid var(--bs-primary)"
                        : "3px solid transparent",
                    transition: "opacity 0.2s ease",
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen lightbox */}
      <Modal
        show={showLightbox}
        onHide={() => setShowLightbox(false)}
        centered
        contentClassName="bg-dark border-0"
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          className="bg-dark border-0"
        >
          <Modal.Title className="text-white">
            {activeIdx + 1} / {photos.length}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="bg-dark p-0 d-flex flex-column">
          {/* Main lightbox image */}
          <div className="position-relative flex-grow-1 d-flex align-items-center justify-content-center">
            <img
              src={activePhoto}
              alt={`Property photo ${activeIdx + 1}`}
              className="img-fluid"
              style={{
                maxWidth: "100%",
                maxHeight: "calc(100vh - 150px)",
                objectFit: "contain",
              }}
            />

            {/* Previous arrow */}
            {photos.length > 1 && (
              <Button
                variant="dark"
                onClick={goPrevious}
                className="position-absolute start-0 top-50 translate-middle-y ms-3 rounded-circle"
                style={{
                  width: "48px",
                  height: "48px",
                  fontSize: "24px",
                  opacity: 0.8,
                }}
                aria-label="Previous photo"
              >
                &#8249;
              </Button>
            )}

            {/* Next arrow */}
            {photos.length > 1 && (
              <Button
                variant="dark"
                onClick={goNext}
                className="position-absolute end-0 top-50 translate-middle-y me-3 rounded-circle"
                style={{
                  width: "48px",
                  height: "48px",
                  fontSize: "24px",
                  opacity: 0.8,
                }}
                aria-label="Next photo"
              >
                &#8250;
              </Button>
            )}
          </div>

          {/* Lightbox thumbnail strip */}
          {photos.length > 1 && (
            <div
              className="d-flex gap-2 overflow-auto p-3 flex-shrink-0"
              style={{ backgroundColor: "#111" }}
            >
              {photos.map((url, index) => (
                <button
                  key={`${url}-${index}`}
                  type="button"
                  className="border-0 bg-transparent p-0 flex-shrink-0"
                  onClick={() => setActiveIdx(index)}
                  aria-label={`View property photo ${index + 1}`}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      width: "80px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      opacity: index === activeIdx ? 1 : 0.5,
                      border:
                        index === activeIdx
                          ? "3px solid white"
                          : "3px solid transparent",
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PropertyImageGallery;
