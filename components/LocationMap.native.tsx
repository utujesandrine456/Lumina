import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type { LocationMapProps, MapMarker } from './LocationMap.types';

const LocationMap: React.FC<LocationMapProps> = ({
    region,
    markers = [],
    mapStyle = [],
    onMapPress,
}) => {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                region={region}
                customMapStyle={mapStyle}
                showsUserLocation
                loadingEnabled
                toolbarEnabled={false}
                pitchEnabled={false}
                showsBuildings={false}
                showsTraffic={false}
                showsCompass={false}
                onPress={(event) => onMapPress?.(event.nativeEvent.coordinate)}
            >
                {markers.map((marker: MapMarker) => (
                    <Marker key={marker.id} coordinate={marker.coordinate} tracksViewChanges={false}>
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
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    markerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.85)',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
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
