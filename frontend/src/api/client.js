const fetchProperties = async ({
  filters,
  limit,
  offset,
  sortBy,
  sortOrder,
}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "") {
      params.append(key, value);
    }
  });

  if (sortBy) {
    params.set("sortBy", sortBy);
  }

  if (sortOrder) {
    params.set("sortOrder", sortOrder);
  }

  if (limit !== undefined) {
    params.append("limit", limit);
  }

  if (offset !== undefined) {
    params.append("offset", offset);
  }

  const queryStr = params.toString(); // e.g. "city=Portland&beds=3"
  const url = queryStr ? `/api/properties?${queryStr}` : "/api/properties";

  const response = await fetch(url);
  return parseResponse(response);
};

const fetchPropertyDetail = async ({ id }) => {
  if (!id) {
    throw new Error("Property ID is required");
  }

  const url = `/api/properties/${id}`;

  const response = await fetch(url);
  return parseResponse(response);
};

const fetchOpenHouses = async ({ id }) => {
  if (!id) {
    throw new Error("Property ID is required");
  }

  const url = `/api/properties/${id}/openhouses`;

  const response = await fetch(url);
  return parseResponse(response);
};

const parseResponse = async (res) => {
  const contentType = res.headers.get("content-type");
  let result = null;

  if (contentType?.includes("application/json")) {
    try {
      result = await res.json();
    } catch {
      // invalid or empty json
      result = null;
    }
  }

  if (!res.ok) {
    const message =
      result?.error ||
      "The property service is currently unavailable. Please try again.";

    throw new Error(`HTTP error! Status: ${res.status}, Message: ${message}`);
  }
  return result;
};

export { fetchProperties, fetchPropertyDetail, fetchOpenHouses };
