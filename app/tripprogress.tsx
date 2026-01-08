import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming, withRepeat } from 'react-native-reanimated';
import * as Location from 'expo-location';

export default function TripProgress() {
    const router = useRouter();
    const { tripId } = useLocalSearchParams<{ tripId: string }>();
    const { requests, updateRequest } = useDriverStore();
    const trip = (requests || []).find(t => t.id === tripId);
    const [isActive, setIsActive] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const pulseScale = useSharedValue(1);

    
    useEffect(() => {
        if (isActive) {
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Denied', 'Location permission is required');
                    setIsActive(false);
                    return;
                }

                const newLocation = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = newLocation.coords;
                setCurrentLocation({ latitude, longitude });
            })();

            pulseScale.value = withRepeat(
                withTiming(1.2, { duration: 1000 }), -1, true
            );
        } else {
            pulseScale.value = withTiming(1, { duration: 300 });
            setCurrentLocation(null);
        }
    }, [isActive]);

    const animatedPulseStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: pulseScale.value }],
        };
    });

    if (!trip) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Trip Not Found</Text>
                    <View style={{ width: 24 }} />
                </View>
            </SafeAreaView>
        );
    }

    const handleStartStop = () => {
        if (!isActive) {
            setIsActive(true);
            updateRequest(trip.id, { status: 'in-progress' });
        } else {
            setIsActive(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Trip In Progress</Text>
                    <View style={{ width: 24 }} />
                </View>

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.content}>
                    <View style={styles.tripCard}>
                        <Text style={styles.tripRoute}>
                            {trip.pickupLocation} → {trip.destination}
                        </Text>
                        <View style={styles.tripDetails}>
                            <View style={styles.detailRow}>
                                <Ionicons name="cube-outline" size={20} color="#000" />
                                <Text style={styles.detailText}>{trip.cropType}</Text>
                                <Text style={styles.detailValue}>{trip.totalWeight} kg</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Ionicons name="location-outline" size={20} color="#000" />
                                <Text style={styles.detailText}>Distance</Text>
                                <Text style={styles.detailValue}>{trip.distance?.toFixed(2)} km</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.statusContainer}>
                        <Animated.View style={[styles.statusIndicator, animatedPulseStyle, isActive && styles.statusIndicatorActive]}>
                            <Ionicons
                                name={isActive ? "play-circle" : "pause-circle"}
                                size={64}
                                color={isActive ? "#000" : "#757575"}
                            />
                        </Animated.View>
                        <Text style={[styles.statusText, isActive && styles.statusTextActive]}>
                            {isActive ? 'Trip Active' : 'Trip Paused'}
                        </Text>
                        <Text style={styles.statusDescription}>
                            {isActive
                                ? 'Your location is being tracked'
                                : 'Tap Start to begin tracking your trip'}
                        </Text>
                    </View>

                    {currentLocation && (
                        <View style={styles.locationCard}>
                            <Ionicons name="location" size={24} color="#000" />
                            <View style={styles.locationInfo}>
                                <Text style={styles.locationLabel}>Current Location</Text>
                                <Text style={styles.locationValue}>
                                    {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                                </Text>
                            </View>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.startStopButton, isActive && styles.startStopButtonActive]}
                        onPress={handleStartStop}
                    >
                        <Ionicons
                            name={isActive ? "stop-circle" : "play-circle"}
                            size={24}
                            color="#FFF"
                        />
                        <Text style={styles.startStopButtonText}>
                            {isActive ? 'Stop Trip' : 'Start Trip'}
                        </Text>
                    </TouchableOpacity>

                    {trip.status === 'in-progress' && (
                        <TouchableOpacity
                            style={styles.deliveryButton}
                            onPress={() => router.push({ pathname: '/delivery', params: { tripId: trip.id } })}
                        >
                            <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                            <Text style={styles.deliveryButtonText}>Confirm Delivery</Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#000',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    tripCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    tripRoute: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#000',
        marginBottom: 16,
    },
    tripDetails: {
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    detailText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        flex: 1,
    },
    detailValue: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#000',
    },
    statusContainer: {
        alignItems: 'center',
        padding: 32,
        marginBottom: 24,
    },
    statusIndicator: {
        marginBottom: 16,
    },
    statusIndicatorActive: {
        // Pulse animation handled by animated style
    },
    statusText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        color: '#757575',
        marginBottom: 8,
    },
    statusTextActive: {
        color: '#000',
    },
    statusDescription: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        textAlign: 'center',
    },
    locationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        gap: 12,
    },
    locationInfo: {
        flex: 1,
    },
    locationLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#757575',
        marginBottom: 4,
    },
    locationValue: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#000',
    },
    startStopButton: {
        backgroundColor: '#000',
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 12,
    },
    startStopButtonActive: {
        backgroundColor: '#757575',
    },
    startStopButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
    deliveryButton: {
        backgroundColor: '#000',
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    deliveryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
});

