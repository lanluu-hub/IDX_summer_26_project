// utils/photos.js
// RETS photos normally arrive as a JSON string, but accepting an array
// keeps the utility safe for already-normalized callers.

export const parsePhotos = (rawPhotos) => {
  if (Array.isArray(rawPhotos)) {
    return rawPhotos;
  }

  if (!rawPhotos) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawPhotos);

    return Array.isArray(parsed) ? parsed : [];
    // Malformed photo data should degrade to the card placeholder rather than
    // crash the entire listings grid.
  } catch (error) {
    console.error("Failed to parse property photos:", error);
    return [];
  }
};

export const getFirstPhoto = (rawPhotos) => {
  const photos = parsePhotos(rawPhotos);

  return photos[0] ?? null;
};
