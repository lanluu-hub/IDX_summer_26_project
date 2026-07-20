const fetchProperties = async (params) => {
  const response = await fetch("/api/properties");

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const result = await response.json();
  return result;
};

const fetchPropertyDetail = async (id) => {};

export { fetchProperties, fetchPropertyDetail };
