import React, { useMemo, useState, useEffect, type CSSProperties } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Map, Marker } from '@vis.gl/react-maplibre';
import type { StyleSpecification } from 'maplibre-gl';
import type { LocationMapProps, MapMarker, MapRegion } from './LocationMap.types';
import 'maplibre-gl/dist/maplibre-gl.css';

const MONOCHROME_STYLE: StyleSpecification = {
    version: 8,
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    sources: {
        osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
        },
    },
    layers: [
        {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            paint: {
                'raster-saturation': -1,
                'raster-brightness-min': 0.2,
                'raster-brightness-max': 0.7,
                'raster-contrast': 0.6,
            },
        },
    ],
};

const MAP_STYLE: CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

const convertRegionToViewState = (region: MapRegion) => {
    const zoomFromDelta = (delta: number) => {
        if (!delta) return 12;
        const zoom = 8 - Math.log2(delta);
        return Math.min(17, Math.max(3, zoom));
    };

    return {
        latitude: region.latitude,
        longitude: region.longitude,
        zoom: zoomFromDelta(region.latitudeDelta),
        bearing: 0,
        pitch: 0,
    };
};


const LocationMap: React.FC<LocationMapProps> = ({ region, markers = [], onMapPress }) => {
    const targetViewState = useMemo(() => convertRegionToViewState(region), [region]);
    const [viewState, setViewState] = useState<any>(targetViewState);

    useEffect(() => {
        setViewState(targetViewState);
    }, [targetViewState]);

    return (
        <View style={styles.container}>
            <Map
                style={MAP_STYLE}
                mapStyle={MONOCHROME_STYLE}
                attributionControl={false}
                dragRotate={false}
                touchPitch={false}
                scrollZoom={true}
                viewState={viewState}
                initialViewState={targetViewState}
                onMove={(evt: any) => setViewState(evt.viewState)}
                onClick={(evt) =>
                    onMapPress?.({
                        latitude: evt.lngLat.lat,
                        longitude: evt.lngLat.lng,
                    })
                }
            >
                {markers.map((marker: MapMarker) => (
                    <Marker
                        key={marker.id}
                        longitude={marker.coordinate.longitude}
                        latitude={marker.coordinate.latitude}
                        anchor="bottom"
                    >
                        <View style={[styles.markerContainer, { borderColor: marker.accentColor }]}>
                            <View style={[styles.markerDot, { backgroundColor: marker.accentColor }]} />
                            <View>
                                <Text style={styles.markerLabel}>{marker.label}</Text>
                                {marker.description ? (
                                    <Text style={styles.markerDescription}>{marker.description}</Text>
                                ) : null}
                            </View>
                        </View>
                    </Marker>
                ))}
            </Map>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    markerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.85)',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        gap: 8,
    },
    markerDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    markerLabel: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    markerDescription: {
        color: '#b5b5b5',
        fontSize: 10,
    },
});

export default LocationMap;
