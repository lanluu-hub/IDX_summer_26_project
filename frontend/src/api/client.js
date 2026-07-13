const fetchProperties = async () => {
  const response = await fetch("/api/properties");

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const result = await response.json();
  return result;
};

export default fetchProperties;
