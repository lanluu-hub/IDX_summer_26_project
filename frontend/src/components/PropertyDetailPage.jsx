import { useParams } from "react-router";

const PropertyDetailPage = () => {
  let { id } = useParams();
  return (
    <>
      <p>Property {id}</p>
    </>
  );
};

export default PropertyDetailPage;
