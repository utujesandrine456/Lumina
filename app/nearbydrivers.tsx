import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import * as Location from 'expo-location';

export default function NearbyDrivers() {
    const router = useRouter();
    const { nearbyDrivers, drivers, setNearbyDrivers } = useDriverStore();
    const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                let location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;
                setCurrentLocation({ latitude, longitude });
                
                const driversWithDistance = drivers
                    .filter(d => d.availability && d.verified && d.coordinates)
                    .map(driver => {
                        if (!driver.coordinates) return { ...driver, distance: Infinity };
                        const distance = calculateDistance(
                            latitude,
                            longitude,
                            driver.coordinates.latitude,
                            driver.coordinates.longitude
                        );
                        return { ...driver, distance };
                    })
                    .sort((a, b) => a.distance - b.distance);
                
                setNearbyDrivers(driversWithDistance);
            }
        })();
    }, [drivers]);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    const renderDriver = ({ item }: { item: any }) => {
        const distance = item.distance !== undefined ? item.distance : Infinity;
        
        return (
            <TouchableOpacity
                style={styles.driverCard}
                onPress={() => router.push({ pathname: '/bookdriver', params: { driverId: item.id } })}
            >
                <View style={styles.driverHeader}>
                    <View style={styles.driverInfo}>
                        <Ionicons name="person-circle" size={48} color="#000" />
                        <View style={styles.driverDetails}>
                            <Text style={styles.driverName}>{item.name}</Text>
                            <Text style={styles.plateNumber}>{item.plateNumber}</Text>
                        </View>
                    </View>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#000" />
                        <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
                    </View>
                </View>
                
                <View style={styles.driverStats}>
                    <View style={styles.stat}>
                        <Ionicons name="cube-outline" size={20} color="#000" />
                        <Text style={styles.statText}>{item.capacity} kg capacity</Text>
                    </View>
                    <View style={styles.stat}>
                        <Ionicons name="location-outline" size={20} color="#000" />
                        <Text style={styles.statText}>
                            {distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(1)} km`} away
                        </Text>
                    </View>
                </View>

                <View style={styles.availabilityBadge}>
                    <View style={[styles.availabilityDot, { backgroundColor: item.availability ? '#000' : '#757575' }]} />
                    <Text style={styles.availabilityText}>
                        {item.availability ? 'Available' : 'Unavailable'}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Nearby Drivers</Text>
                <View style={{ width: 24 }} />
            </View>

            {nearbyDrivers.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="car-outline" size={64} color="#BDBDBD" />
                    <Text style={styles.emptyText}>No nearby drivers available</Text>
                </View>
            ) : (
                <FlatList
                    data={nearbyDrivers}
                    renderItem={renderDriver}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#000',
    },
    listContent: {
        padding: 20,
    },
    driverCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    driverHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    driverDetails: {
        marginLeft: 12,
        flex: 1,
    },
    driverName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#000',
        marginBottom: 4,
    },
    plateNumber: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rating: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#000',
    },
    driverStats: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 12,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#000',
    },
    availabilityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        gap: 6,
    },
    availabilityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    availabilityText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#000',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#757575',
        marginTop: 16,
    },
});

