export type Coordinates = {
    latitude: number;
    longitude: number;
};

export type MapMarker = {
    id: string;
    coordinate: Coordinates;
    label: string;
    description?: string;
    accentColor: string;
};

export type MapRegion = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

export interface LocationMapProps {
    region: MapRegion;
    markers?: MapMarker[];
    mapStyle?: any[];
    onMapPress?: (coordinate: Coordinates) => void;
}

