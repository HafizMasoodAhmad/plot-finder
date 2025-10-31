"use client";
import { GeoJsonFeature, GeoJsonFeatureCollection } from "@/types/parcelTypes";
import { getFirstCoordinate } from "@/utils/mapUtils";
import React, { RefObject } from "react";

/**
 * Props for the PlotList component.
 *
 * @property {GeoJsonFeatureCollection} parcels - GeoJSON object containing plot features.
 * @property {number | null} activeIndex - Index of the currently active (highlighted) plot.
 * @property {(index: number) => void} setActiveIndex - Callback to update the active plot index.
 * @property {(pos: [number, number]) => void} setPosition - Callback to update the map position (fly to selected plot).
 * @property {RefObject<(HTMLDivElement | null)[]>} listRefs - Ref array to allow scrolling the active list item into view.
 * @property {boolean} loading - Loading state flag (shows spinner when true).
 */
interface PlotListProps {
  parcels: GeoJsonFeatureCollection | null;
  activeIndex: number | null;
  setActiveIndex: (index: number) => void;
  setPosition: (pos: [number, number]) => void;
  listRefs: RefObject<(HTMLDivElement | null)[]>;
  loading: boolean;
  setSelectedParcel: (feature: GeoJsonFeature ) => void;
}

/**
 * PlotList Component
 * -------------------
 * This component renders a scrollable list of plots (parcels) found within a search radius.
 *
 * Features:
 * - Displays a loading spinner while fetching data.
 * - Renders a sticky header with the title "Plots Found".
 * - Lists all parcels with their name and area.
 * - Highlights the active (selected) parcel in orange.
 * - Scrolls the active parcel into view using `listRefs`.
 * - Clicking a parcel sets it as active and moves the map to its coordinates.
 *
 * Usage:
 * ```tsx
 * <PlotList
 *   parcels={parcels}
 *   activeIndex={activeIndex}
 *   setActiveIndex={setActiveIndex}
 *   setPosition={setPosition}
 *   listRefs={listRefs}
 *   loading={loading}
 * />
 * ```
 */
export default function PlotList({
  parcels,
  activeIndex,
  setActiveIndex,
  setPosition,
  listRefs,
  loading,
  setSelectedParcel
}: PlotListProps) {
  // Show loading spinner if fetching data
  if (loading) {
    return (
      <div className="flex items-center justify-center w-64 h-20">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  // If no parcels exist, render nothing
  if (!parcels || !parcels.features) return null;

  return (
    <div className="flex flex-col w-64 h-full">
      {/* Fixed header */}
      <div className="p-2 bg-white sticky top-0 z-10">
        <h3 className="font-semibold text-gray-700">Plots Found</h3>
      </div>

      {/* Scrollable list of plots */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {parcels.features.map((feature: GeoJsonFeature, idx: number) => (
          <div
            key={idx}
            // Store ref to allow scrolling active item into view
            ref={(el) => {
              listRefs.current[idx] = el;
            }}
            className={`p-2 border rounded-md cursor-pointer 
              ${
                activeIndex === idx
                  ? "bg-orange-200"
                  : "bg-gray-50 hover:bg-orange-100"
              }`}
            onClick={() => {
              // Set clicked parcel as active
              setActiveIndex(idx);
              setSelectedParcel(feature);
              
              // Fly to the first coordinate of the parcel's polygon
              try {
               // Usage:
              const firstCoord = getFirstCoordinate(feature.geometry);
              if (firstCoord) {
                const [lng, lat] = firstCoord;
                setPosition([lat, lng]);
              }

              } catch (err) {
                console.error("Error reading coordinates:", err);
              }
            }}
          >
            {/* Parcel Name */}
            <p className="text-sm font-medium">
              {feature.properties?.plotName || "Unnamed Plot"}
            </p>

            {/* Parcel Area */}
            <p className="text-xs text-gray-500">
              Area: {(feature.properties?.parcelarea.toFixed(2)) || 0} ha
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
