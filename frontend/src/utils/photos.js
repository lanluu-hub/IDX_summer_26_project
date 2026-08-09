// utils/photos.js

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
  } catch (error) {
    console.error("Failed to parse property photos:", error);
    return [];
  }
};

export const getFirstPhoto = (rawPhotos) => {
  const photos = parsePhotos(rawPhotos);

  return photos[0] ?? null;
};
