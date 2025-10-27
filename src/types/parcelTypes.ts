//src/types/parcel.types.ts
export interface ParcelGeometry {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
}

export interface Parcel {
  plotName:string;
  gml_id: string;
  parcelarea: number;
  freearea: number;
  free_pct: number;
  geometry: ParcelGeometry;
}

export interface GeoJsonFeature {
  type: "Feature";
  geometry: ParcelGeometry;
  properties: {
    plotName:string;
    gml_id: string;
    parcelarea: number;
    freearea: number;
    free_pct: number;
  };
}

export interface GeoJsonFeatureCollection {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}



// // // src/types/parcel.types.ts
// import { Polygon, MultiPolygon, Feature, FeatureCollection } from "geojson";

// export type ParcelGeometry = Polygon | MultiPolygon;

// export interface ParcelProperties {
//   gml_id: string;
//   parcelarea: number;
//   freearea: number;
//   free_pct: number;
// }

// export type GeoJsonFeature = Feature<ParcelGeometry, ParcelProperties>;

// export type GeoJsonFeatureCollection = FeatureCollection<ParcelGeometry, ParcelProperties>;
