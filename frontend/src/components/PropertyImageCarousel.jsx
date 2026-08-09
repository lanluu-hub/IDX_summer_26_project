import { useState } from "react";
import { Carousel } from "react-bootstrap";

const PropertyImageCarousel = ({ photos }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    e.stopPropagation();
    setActiveIdx(selectedIndex);
  };

  return (
    <div className="position-relative">
      <Carousel
        activeIndex={activeIdx}
        onSelect={handleSelect}
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
