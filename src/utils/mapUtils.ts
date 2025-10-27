// utils/mapUtils.ts
import L from "leaflet";
import { ParcelGeometry } from "@/types/parcelTypes";

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


export const getFirstCoordinate = (geometry: ParcelGeometry): [number, number] | null => {
  const coords = geometry.coordinates;

  if (geometry.type === "Polygon" && Array.isArray(coords[0][0])) {
    return coords[0][0] as [number, number];
  } else if (geometry.type === "MultiPolygon" && Array.isArray(coords[0][0][0])) {
    return coords[0][0][0] as [number, number];
  }
  return null;
};

export const fixDefaultLeafletIcon = () => {
  if (typeof window === "undefined") return; // Skip SSR

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};