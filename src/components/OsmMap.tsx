"use client";

import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
  GeoJSON,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import React from "react";
import { isInsideCircle } from "@/utils/mapUtils";
import PlotList from "./PlotList";
import ParcelDetails from "./ParcelDetails";
import { fetchGoodParcels } from "@/services/parcelService";

// Fix default icon issue in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Component to control map flyTo
function FlyToLocation({ position }: { position: [number, number] | null }) {
  const map = useMap();
  if (position) {
    map.flyTo(position, 13, { animate: true });
  }
  return null;
}

// Component to handle map clicks
function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  React.useEffect(() => {
    const handleClick = (e: any) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onMapClick]);

  return null;
}

export default function OsmMap() {
  const listRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [locationName, setLocationName] = useState<string>("");
const [searchRadius, setSearchRadius] = useState<number>(0);
  const [unit, setUnit] = useState<"km" | "mile">("km"); // New unit state
  const [isMapClicked, setIsMapClicked] = useState<boolean>(false);
  const [circleCenter, setCircleCenter] = useState<[number, number] | null>(
    null
  );
  const [circleLocked, setCircleLocked] = useState(false);

  const [position, setPosition] = useState<[number, number] | null>([
    31.5497, 74.3436,
  ]);
  const searchRef = useRef<HTMLInputElement>(null);

  //  State to store fetched parcels
  const [parcels, setParcels] = useState<any>(null);
  const [selectedParcel, setSelectedParcel] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleSearch = async () => {
    if (!searchRef.current?.value) return;
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchRef.current.value });
    if (results.length > 0) {
      const { x, y, label } = results[0];
      setPosition([y, x]);
      setLocationName(label);
      setIsMapClicked(false);
      setCircleCenter(null);
    } else {
      alert("Location not found");
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    // Case 1: No circle exists yet
    if (!circleCenter) {
      setCircleCenter([lat, lng]);
      setIsMapClicked(true); // Map has been clicked
      setCircleLocked(true); // Lock the circle
    } else {
      // Case 2: Circle already exists
      if (isInsideCircle(lat, lng, circleCenter, radiusInMeters)) {
        // Click is inside the circle → do nothing
        return;
      } else {
        // Click is outside the circle → reset everything
        setCircleCenter([lat, lng]); // Set new center
        setIsMapClicked(true);
        setCircleLocked(true);
        setParcels(null); // Clear parcels
        setSearchRadius(0); // Reset radius
        setSelectedParcel(null)
        alert("You clicked outside the circle. Please select a new radius to search.");
      }
    }
  };






  const handleRadiusAreaSearch = async () => {
  setLoading(true);

  if (!circleCenter) {
    alert("Click on the map to set a central point");
    setLoading(false);
    return;
  }

  try {
    // Fetch local server data
    const res = await fetch("/data/serverData.geojson"); // Make sure this file is inside public/
    if (!res.ok) throw new Error("Failed to load file");

    const data = await res.json();

    // Simulate network delay (e.g., 2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));


    if (data?.parcels) {
      const geojson = {
        type: "FeatureCollection",
        features: data.parcels.map((parcel: any) => ({
          type: "Feature",
          geometry: parcel.geometry,
          properties: {
            gml_id: parcel.gml_id,
            parcelarea: parcel.parcelarea,
            freearea: parcel.freearea,
            free_pct: parcel.free_pct,
          },
        })),
      };

      setParcels(geojson);
    } else {
      console.warn("No 'parcels' found in JSON");
    }
  } catch (error) {
    console.error("Error loading local JSON:", error);
  } finally {
    setLoading(false);
  }
};


const handleParcelClick = (feature: any) => {
  setSelectedParcel(feature); // Open modal

  if (parcels?.features) {
    const index = parcels.features.findIndex(
      (f: any) => f.properties?.gml_id === feature.properties?.gml_id
    );
    if (index !== -1) setActiveIndex(index);
  }

  // Safely get first coordinate
  if (feature.geometry?.coordinates) {
    let coords = feature.geometry.coordinates;

    // If Polygon with nested array: [ [ [lng, lat], ... ] ]
    if (feature.geometry.type === "Polygon") coords = coords[0];

    // If MultiPolygon: [ [ [ [lng, lat], ... ] ] ]
    if (feature.geometry.type === "MultiPolygon") coords = coords[0][0];

    // coords[0] should now be [lng, lat]
    const firstCoord = coords[0];

    if (Array.isArray(firstCoord)) {
      const [lng, lat] = firstCoord;
      setPosition([lat, lng]);
    } else {
      console.warn("Invalid geometry coordinates:", coords);
    }
  }
};


  useEffect(() => {
    if (activeIndex !== null && listRefs.current[activeIndex]) {
      listRefs.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex]);


// Convert searchRadius to number safely
const radiusInMeters = unit === "km" ? searchRadius * 1000 : searchRadius * 1609.34; // fallback if no radius selected
  // Scroll to active item when activeIndex changes
  return (
    <div className="flex px-2">
      <div className="flex flex-col mx-1 my-2 space-y-3">
        {/* Location Search Input */}
        <div className="h-10 w-64">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search location..."
            className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
        </div>

        {/* Search Radius Dropdown */}

        <select
          value={searchRadius}
          onChange={(e) => setSearchRadius(Number(e.target.value))}
          disabled={!isMapClicked}
          className={`w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
            isMapClicked
              ? "border-gray-300 bg-white"
              : "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
          }`}
        >
          {searchRadius === 0 && <option value={0}>Please select radius</option>}
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>

        {/* Unit Selection Radio Buttons */}
        <div className="flex items-center space-x-4 w-64">
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              value="km"
              checked={unit === "km"}
              onChange={() => setUnit("km")}
              disabled={!isMapClicked}
            />
            <span>KM</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              value="mile"
              checked={unit === "mile"}
              onChange={() => setUnit("mile")}
              disabled={!isMapClicked}
            />
            <span>Miles</span>
          </label>
        </div>

        {/* Search Button */}
        <div className="h-10 w-64">
          <button
            onClick={handleRadiusAreaSearch}
            disabled={!isMapClicked || searchRadius === 0} // disable if radius not selected
            className={`w-64 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors ${
              !isMapClicked || searchRadius === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            Search by Radius
          </button>
        </div>
        {!isMapClicked && position && (
          <div className="text-sm text-gray-600 w-64">
            💡 Click on the map to select a center point for your search
          </div>
        )}

        {/* List of Plots */}
        <PlotList
          parcels={parcels}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setPosition={setPosition}
          listRefs={listRefs}
          loading={loading}
          setSelectedParcel={setSelectedParcel}

        />
      </div>

      {/* Map */}
      <MapContainer
        center={position || [51.505, -0.09]}
        zoom={2}
        style={{ height: "90vh", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && (
          <Marker position={position}>
            <Popup>
              <strong>{locationName}</strong>
              <br />
              {position[0]}, {position[1]}
            </Popup>
          </Marker>
        )}
        {circleCenter && (
          <Circle
            center={circleCenter}
            radius={radiusInMeters} // Now based on selected unit
            pathOptions={{
              color: "orange",
              fillColor: "white",
              fillOpacity: 0.2,
              weight: 2,
            }}
          >
            <Popup>
              <strong>Search Area</strong>
              <br />
              Radius: {searchRadius} {unit}
              <br />
              Center: {circleCenter[0].toFixed(4)}, {circleCenter[1].toFixed(4)}
            </Popup>
          </Circle>
        )}

        {/* Show parcels from dummy GeoJSON */}
        {parcels && (
          <GeoJSON
            data={parcels}
            style={(feature) => ({
              color:
                activeIndex !== null &&
                parcels.features[activeIndex].properties?.gml_id ===
                  feature?.properties?.gml_id
                  ? "orange" // highlight clicked parcel
                  : "green",
              weight: 2,
              fillColor: "lightgreen",
              fillOpacity: 0.4,
            })}
            onEachFeature={(feature, layer) => {
              layer.on("click", () => handleParcelClick(feature));
            }}
          />
        )}

        <FlyToLocation position={position} />
        <MapClickHandler onMapClick={handleMapClick} />
      </MapContainer>
      {/* Side Panel for Parcel Details */}
      <ParcelDetails
        selectedParcel={selectedParcel}
        onClose={() => setSelectedParcel(null)}
       
      />
    </div>
  );
}
