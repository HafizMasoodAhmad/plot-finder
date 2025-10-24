// utils/mapUtils.ts
import L from "leaflet";

/**
 * Check if a point is inside a circle
 * @param lat Latitude of point
 * @param lng Longitude of point
 * @param circleCenter [lat, lng] center of circle
 * @param radiusInMeters Circle radius in meters
 * @returns boolean
 */
export const isInsideCircle = (
  lat: number,
  lng: number,
  circleCenter: [number, number] | null,
  radiusInMeters: number
): boolean => {
  if (!circleCenter) return false;

  const center = L.latLng(circleCenter[0], circleCenter[1]);
  const point = L.latLng(lat, lng);

  const distance = center.distanceTo(point); // in meters
  return distance <= radiusInMeters;
};
