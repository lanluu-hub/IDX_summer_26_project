const fetchProperties = async ({ filters, limit, offset }) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "") {
      params.append(key, value);
    }
  });

  if (limit !== undefined) {
    params.append("limit", limit);
  }

  if (offset !== undefined) {
    params.append("offset", offset);
  }

  const queryStr = params.toString(); // e.g. "city=Portland&beds=3"
  const url = queryStr ? `/api/properties?${queryStr}` : "/api/properties";

  const response = await fetch(url);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `HTTP error! Status: ${response.status}, Message: ${result.error}`,
    );
  }
  return result;
};

const fetchPropertyDetail = async ({ id }) => {
  if (!id) {
    throw new Error("Property ID is required");
  }

  const url = `/api/properties/${id}`;

  const response = await fetch(url);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `HTTP error! Status: ${response.status}, Message: ${result.error}`,
    );
  }
  return result;
};

const fetchOpenHouses = async ({ id }) => {
  if (!id) {
    throw new Error("Property ID is required");
  }

  const url = `/api/properties/${id}/openhouses`;

  const response = await fetch(url);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `HTTP error! Status: ${response.status}, Message: ${result.error}`,
    );
  }
  return result;
};

export { fetchProperties, fetchPropertyDetail, fetchOpenHouses };
