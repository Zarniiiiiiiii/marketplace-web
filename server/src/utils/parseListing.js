export function normalizeListingForResponse(listing) {
  return {
    ...listing,
    gallery: safeJsonParse(listing.gallery)
  };
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value || '[]');
  } catch {
    return [];
  }
}
