import { useState } from "react";
import { Carousel } from "react-bootstrap";

const PropertyImageCarousel = ({ photos }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    e.stopPropagation();
    setActiveIdx(selectedIndex);
  };

  const handleCarouselControlPrev = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setActiveIdx((currentIdx) =>
      currentIdx === 0 ? photos.length - 1 : currentIdx - 1,
    );
  };

  const handleCarouselControlNext = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setActiveIdx((currentIdx) =>
      currentIdx === photos.length - 1 ? 0 : currentIdx + 1,
    );
  };

  return (
    <div className="position-relative">
      <Carousel
        activeIndex={activeIdx}
        onSelect={handleSelect}
        controls={false}
        indicators={false}
        interval={null}
      >
        {photos.map((photo, index) => (
          <Carousel.Item key={index}>
            <img
              src={photo}
              className="d-block w-100"
              style={{ height: "220px", objectFit: "cover" }}
              alt=""
            />
          </Carousel.Item>
        ))}
      </Carousel>
      <button
        type="button"
        className="carousel-control-prev"
        onClick={handleCarouselControlPrev}
        aria-label="Previous image"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
      </button>

      <button
        type="button"
        className="carousel-control-next"
        onClick={handleCarouselControlNext}
        aria-label="Next image"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
      </button>

      <span
        className="position-absolute bottom-0 end-0 m-2 badge text-bg-dark"
        style={{
          fontSize: "0.875rem",
          fontWeight: 600,
        }}
      >
        {activeIdx + 1} / {photos.length}
      </span>
    </div>
  );
};

export default PropertyImageCarousel;
