const fetchProperties = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "") {
      params.append(key, value);
    }
  });

  const queryStr = params.toString(); // e.g. "city=Portland&beds=3"
  const url = queryStr ? `/api/properties?${queryStr}` : `/api/properties`;

  const response = await fetch(url);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `HTTP error! Status: ${response.status}, Message: ${result.error}`,
    );
  }
  return result;
};

const fetchPropertyDetail = async (id) => {};

export { fetchProperties, fetchPropertyDetail };
