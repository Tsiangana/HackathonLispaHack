export function formatDistance(distance?: number) {
  if (distance === undefined) {
    return 'Nearby';
  }

  return `${distance.toFixed(distance < 10 ? 1 : 0)} km`;
}

export function formatRating(rating: number) {
  return rating.toFixed(1);
}
