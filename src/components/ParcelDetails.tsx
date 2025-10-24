
/**
 * ParcelDetails Component
 * ------------------------
 * This component renders a side panel that displays details of a selected parcel.
 * 
 * Features:
 * - Renders as a fixed sidebar on the right side of the screen.
 * - Shows the parcel's name (from `BUA24NM` property) or "Unnamed".
 * - Displays all parcel properties in a table format.
 * - Includes a close button to dismiss the panel.
 * - Returns `null` if no parcel is selected.
 * 
 * Usage:
 * ```tsx
 * <ParcelDetails
 *   selectedParcel={selectedParcel}
 *   onClose={() => setSelectedParcel(null)}
 * />
 * ```
 */

"use client";

import React, { useEffect } from "react";

interface ParcelDetailsProps {
  selectedParcel: any;
  onClose: () => void;
}

export default function ParcelDetails({ selectedParcel, onClose }: ParcelDetailsProps) {

  // Debug - when selected parcel changes
  useEffect(() => {
    if (selectedParcel) {
    }
  }, [selectedParcel]);

  // If no parcel is selected, render nothing
  if (!selectedParcel) return null;

  // Extract new API fields from selected parcel
  const properties = selectedParcel.properties || {};
  const title = properties.gml_id || "Parcel Details";

  return (
    <div className="fixed top-16 right-0 h-full w-[400px] bg-white shadow-lg z-[1000] overflow-y-auto">
      
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 h-10 w-10 text-2xl font-bold text-orange-300 hover:text-orange-600"
        onClick={onClose}
      >
        ✕
      </button>

      <div className="p-6">
        {/* Parcel Title */}
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {/* Parcel Information Table */}
        <table className="w-full text-sm border">
          <tbody>
            {Object.entries(properties).map(([key, value]) => (
              <tr key={key} className="border-b">
                <td className="px-2 py-1 text-gray-700 font-medium" style={{ fontSize: "16px" }}>
                  {key.replace(/_/g, " ").toUpperCase()}
                </td>
                <td className="px-2 py-1 text-gray-600" style={{ fontSize: "14px" }}>
                  {value !== null ? String(value) : "—"}
                </td>
              </tr>
            ))}

            {/* Show geometry type */}
            <tr className="border-b">
              <td className="px-2 py-1 text-gray-700 font-medium" style={{ fontSize: "16px" }}>
                Geometry Type
              </td>
              <td className="px-2 py-1 text-gray-600" style={{ fontSize: "14px" }}>
                {selectedParcel.geometry?.type || "—"}
              </td>
            </tr>

            {/* Show first coordinate */}
            <tr className="border-b">
              <td className="px-2 py-1 text-gray-700 font-medium" style={{ fontSize: "16px" }}>
                Coordinates
              </td>
              <td className="px-2 py-1 text-gray-600" style={{ fontSize: "14px" }}>
                {selectedParcel.geometry?.coordinates
                  ? JSON.stringify(selectedParcel.geometry.coordinates[0][0])
                  : "—"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

