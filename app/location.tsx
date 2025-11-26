import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import BottomBar from '@/components/BottomBar';
import DriverBottomBar from '@/components/DriverBottomBar';
import { useDriverStore } from '@/constants/store';
import * as Location from 'expo-location';
import LocationMap from '@/components/LocationMap';
import type { MapMarker, Coordinates, MapRegion } from '@/components/LocationMap.types';



const mapStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#181818"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1b1b1b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#2c2c2c"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8a8a8a"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#373737"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3c3c3c"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#3d3d3d"
            }
        ]
    }
];

export default function LocationPage() {
    const router = useRouter();
    const {
        userRole,
        trip,
        driverLocation,
        driverCoordinates,
        setDriverLocation,
        setDriverCoordinates,
        setTripDetails,
    } = useDriverStore();
    const isDriver = userRole === 'driver';

    const [pickup, setPickup] = useState(trip.pickupLocation || "Current Location");
    const [destination, setDestination] = useState(trip.destination || "");
    const [currentLoc, setCurrentLoc] = useState(driverLocation || "Current Location");
    const [region, setRegion] = useState<MapRegion>({
        latitude: trip.pickupCoordinates?.latitude ?? -1.9441,
        longitude: trip.pickupCoordinates?.longitude ?? 30.0619,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
    });
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isFetchingGPS, setIsFetchingGPS] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const pickupPreferenceRef = useRef(pickup);

    useEffect(() => {
        pickupPreferenceRef.current = pickup;
    }, [pickup]);

    const applyGpsCoordinates = useCallback(
        (coords: Location.LocationObjectCoords, target?: 'pickup' | 'driver') => {
            const coordinate: Coordinates = {
                latitude: coords.latitude,
                longitude: coords.longitude,
            };

            setRegion((prev) => ({
                ...prev,
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
            }));

            const resolvedTarget = target ?? (isDriver ? 'driver' : 'pickup');

            if (resolvedTarget === 'driver') {
                setDriverCoordinates(coordinate);
                setDriverLocation("Current Location");
                setCurrentLoc("Current Location");
            } else {
                setTripDetails({
                    pickupLocation: "Current Location",
                    pickupCoordinates: coordinate,
                });
                setPickup("Current Location");
            }
        },
        [isDriver, setDriverCoordinates, setDriverLocation, setTripDetails]
    );

    useEffect(() => {
        let watcher: Location.LocationSubscription | null = null;

        const startTracking = async () => {
            try {
                setLocationError(null);
                setIsFetchingGPS(true);
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setLocationError('Enable location access to keep pickup details in sync.');
                    return;
                }

                const currentPosition = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
                applyGpsCoordinates(currentPosition.coords);

                watcher = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.Balanced,
                        distanceInterval: 40,
                    },
                    (freshPosition) => {
                        if (isDriver || pickupPreferenceRef.current === "Current Location") {
                            applyGpsCoordinates(freshPosition.coords);
                        }
                    }
                );
            } catch (error) {
                console.log('Location tracking error', error);
                setLocationError('We could not fetch GPS data. Try again.');
            } finally {
                setIsFetchingGPS(false);
            }
        };

        startTracking();

        return () => {
            watcher?.remove();
        };
    }, [applyGpsCoordinates, isDriver]);

    useEffect(() => {
        const pickupCoordinates = trip.pickupCoordinates;
        if (!pickupCoordinates) {
            return;
        }
        setRegion((prev) => ({
            ...prev,
            latitude: pickupCoordinates.latitude,
            longitude: pickupCoordinates.longitude,
        }));
    }, [trip.pickupCoordinates]);

    useEffect(() => {
        if (driverCoordinates) {
            setRegion((prev) => ({
                ...prev,
                latitude: driverCoordinates.latitude,
                longitude: driverCoordinates.longitude,
            }));
        }
    }, [driverCoordinates]);

    const handleUseGPS = async () => {
        try {
            setLocationError(null);
            setIsFetchingGPS(true);
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            applyGpsCoordinates(location.coords);
        } catch (error) {
            console.log('Manual GPS refresh error', error);
            setLocationError('Unable to refresh GPS right now.');
        } finally {
            setIsFetchingGPS(false);
        }
    };

    const handleManualGeocode = useCallback(
        async (text: string, type: 'pickup' | 'destination' | 'driver') => {
            const query = text.trim();
            if (!query) {
                return;
            }
            try {
                setLocationError(null);
                setIsGeocoding(true);
                const result = await Location.geocodeAsync(query);
                if (!result.length) {
                    setLocationError('No matching place found. Try another landmark.');
                    return;
                }
                const coordinates: Coordinates = {
                    latitude: result[0].latitude,
                    longitude: result[0].longitude,
                };

                setRegion((prev) => ({
                    ...prev,
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude,
                }));

                if (type === 'pickup') {
                    setTripDetails({
                        pickupLocation: query,
                        pickupCoordinates: coordinates,
                    });
                    setPickup(query);
                } else if (type === 'destination') {
                    setTripDetails({
                        destination: query,
                        destinationCoordinates: coordinates,
                    });
                    setDestination(query);
                } else {
                    setDriverLocation(query);
                    setDriverCoordinates(coordinates);
                    setCurrentLoc(query);
                }
            } catch (error) {
                console.log('Geocode error', error);
                setLocationError('We could not locate that place. Please refine the address.');
            } finally {
                setIsGeocoding(false);
            }
        },
        [setTripDetails, setDriverLocation, setDriverCoordinates]
    );

    const mapMarkers: MapMarker[] = useMemo(() => {
        const pins: MapMarker[] = [];

        if (trip.pickupCoordinates) {
            pins.push({
                id: 'farmer',
                coordinate: trip.pickupCoordinates,
                label: 'Farmer',
                description: pickup,
                accentColor: '#F1F5F9',
            });
        }

        if (driverCoordinates) {
            pins.push({
                id: 'driver',
                coordinate: driverCoordinates,
                label: 'Driver',
                description: currentLoc,
                accentColor: '#60A5FA',
            });
        }

        return pins;
    }, [trip.pickupCoordinates, pickup, driverCoordinates, currentLoc]);

    const handleConfirm = () => {
        if (!trip.pickupCoordinates) {
            setLocationError('Set a pickup point before continuing.');
            return;
        }

        setTripDetails({
            pickupLocation: pickup,
            destination,
        });

        router.push('/datetime');
    };

    return (
        <View style={styles.container}>
            <View style={styles.map}>
                <LocationMap region={region} markers={mapMarkers} mapStyle={mapStyle} />
                <View style={styles.mapOverlay}>
                    <Text style={styles.overlayLabel}>{isDriver ? 'Driver focus' : 'Pickup focus'}</Text>
                    <Text style={styles.overlayCoord}>
                        {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}
                    </Text>
                </View>
            </View>

            <SafeAreaView style={styles.contentContainer} pointerEvents="box-none">
                <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>{isDriver ? "Driver Location" : "Set Pickup"}</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </Animated.View>

                <View style={styles.statusRow}>
                    <View style={styles.statusPill}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>
                            {mapMarkers.length ? 'GPS locked' : 'Waiting for GPS'}
                        </Text>
                    </View>
                    {(isFetchingGPS || isGeocoding) && (
                        <View style={styles.statusPill}>
                            <ActivityIndicator size="small" color="#fff" />
                            <Text style={styles.statusText}>
                                {isGeocoding ? 'Searching...' : 'Locating...'}
                            </Text>
                        </View>
                    )}
                </View>
                {locationError ? <Text style={styles.errorText}>{locationError}</Text> : null}

                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.cardContainer}>
                        {isDriver ? (
                            <View style={styles.inputGroup}>
                                <View style={styles.inputRow}>
                                    <Ionicons name="navigate-circle" size={24} color="#2196F3" style={styles.inputIcon} />
                                    <View style={styles.inputTextContainer}>
                                        <Text style={styles.label}>Current Location</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={currentLoc}
                                            onChangeText={setCurrentLoc}
                                            placeholder="Enter your location"
                                            placeholderTextColor="#999"
                                            onSubmitEditing={(event) => handleManualGeocode(event.nativeEvent.text, 'driver')}
                                        />
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={[styles.gpsButton, isFetchingGPS && styles.gpsButtonDisabled]}
                                    onPress={handleUseGPS}
                                    disabled={isFetchingGPS}
                                >
                                    {isFetchingGPS ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Ionicons name="locate" size={20} color="#fff" />
                                    )}
                                    <Text style={styles.gpsButtonText}>Use GPS</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.inputGroup}>
                                <View style={styles.inputRow}>
                                    <Ionicons name="radio-button-on" size={20} color="#4CAF50" style={styles.inputIcon} />
                                    <View style={styles.inputTextContainer}>
                                        <Text style={styles.label}>Pickup Location</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={pickup}
                                            onChangeText={setPickup}
                                            placeholder="Enter pickup location"
                                            placeholderTextColor="#999"
                                            onSubmitEditing={(event) => handleManualGeocode(event.nativeEvent.text, 'pickup')}
                                        />
                                    </View>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.inputRow}>
                                    <Ionicons name="location" size={20} color="#F44336" style={styles.inputIcon} />
                                    <View style={styles.inputTextContainer}>
                                        <Text style={styles.label}>Destination</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={destination}
                                            onChangeText={setDestination}
                                            placeholder="Enter destination"
                                            placeholderTextColor="#999"
                                            onSubmitEditing={(event) => handleManualGeocode(event.nativeEvent.text, 'destination')}
                                        />
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={[styles.gpsButton, isFetchingGPS && styles.gpsButtonDisabled]}
                                    onPress={handleUseGPS}
                                    disabled={isFetchingGPS}
                                >
                                    {isFetchingGPS ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Ionicons name="locate" size={20} color="#fff" />
                                    )}
                                    <Text style={styles.gpsButtonText}>Use My Current Location</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={() => {
                                handleConfirm();
                            }}
                        >
                            <Text style={styles.confirmButtonText}>Confirm Location</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                    </Animated.View>
                </KeyboardAvoidingView>
            </SafeAreaView>

            {isDriver ? <DriverBottomBar /> : <BottomBar />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    mapOverlay: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    overlayLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#b5b5b5',
    },
    overlayCoord: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#fff',
        marginTop: 4,
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#22c55e',
    },
    statusText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 11,
        color: '#fff',
    },
    errorText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#ff6b6b',
        marginBottom: 8,
    },
    backButton: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    headerTitleContainer: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    headerTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#FFF',
    },
    cardContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
        marginBottom: 20,
    },
    inputGroup: {
        gap: 16,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    inputIcon: {
        width: 24,
        textAlign: 'center',
    },
    inputTextContainer: {
        flex: 1,
    },
    label: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    input: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 15,
        color: '#333',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginLeft: 36,
    },
    gpsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333',
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
        marginTop: 8,
    },
    gpsButtonDisabled: {
        opacity: 0.6,
    },
    gpsButtonText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 13,
        color: '#fff',
    },
    confirmButton: {
        backgroundColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        marginTop: 24,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    confirmButtonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#fff',
    },
});
