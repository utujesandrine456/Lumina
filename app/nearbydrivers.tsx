import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import ErrorBoundary from '@/components/ErrorBoundary';
import FarmerBottomBar from '@/components/FarmerBottomBar';

export default function NearbyDrivers() {
    return (
        <ErrorBoundary>
            <NearbyDriversContent />
        </ErrorBoundary>
    );
}

function NearbyDriversContent() {
    const router = useRouter();
    const { nearbyDrivers, drivers, setNearbyDrivers, updateRequest } = useDriverStore();
    const { requestId } = useLocalSearchParams();


    useEffect(() => {
        const available = drivers.filter(d => d.available);
        setNearbyDrivers(available);
    }, [drivers, setNearbyDrivers]);

    const handleDriverSelect = (driver: any) => {
        if (!requestId) {
            Alert.alert('Error', 'No active request found.');
            return;
        }

        updateRequest(requestId as string, {
            driverId: driver.id,
            status: 'pending'
        });

        Alert.alert(
            'Request Sent',
            `Your request has been sent to ${driver.name}. You will be notified when they accept.`,
            [
                {
                    text: 'Go to Dashboard',
                    onPress: () => router.push('/adminfarmerdashboard')
                }
            ]
        );
    };

    const renderDriver = ({ item }: { item: any }) => {
        const distance = item.distance || (Math.random() * 5);

        return (
            <TouchableOpacity
                style={styles.driverCard}
                onPress={() => handleDriverSelect(item)}
            >
                <View style={styles.driverHeader}>
                    <View style={styles.driverInfo}>
                        <View style={styles.avatarCircle}>
                            <Ionicons name="person" size={24} color="#FFF" />
                        </View>
                        <View style={styles.driverDetails}>
                            <Text style={styles.driverName}>{item.name}</Text>
                            <Text style={styles.plateNumber}>{item.plateNumber} • {item.vehicleType || 'Truck'}</Text>
                        </View>
                    </View>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.rating}>{(item.rating || 5.0).toFixed(1)}</Text>
                    </View>
                </View>

                <View style={styles.driverStats}>
                    <View style={styles.statBadge}>
                        <Ionicons name="cube-outline" size={16} color="#666" />
                        <Text style={styles.statText}>{item.capacity || '1000'} kg</Text>
                    </View>
                    <View style={styles.statBadge}>
                        <Ionicons name="location-outline" size={16} color="#666" />
                        <Text style={styles.statText}>
                            {distance.toFixed(1)} km away
                        </Text>
                    </View>
                </View>

                <View style={styles.availabilityBadge}>
                    <View style={[styles.availabilityDot, { backgroundColor: '#4CAF50' }]} />
                    <Text style={styles.availabilityText}>Available Now</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.title}>Select Driver</Text>
                    <Text style={styles.subtitle}>
                        {nearbyDrivers.length} drivers found nearby
                    </Text>
                </View>
                <View style={{ width: 44 }} />
            </View>

            {nearbyDrivers.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIcon}>
                        <Ionicons name="car-sport-outline" size={48} color="#BDBDBD" />
                    </View>
                    <Text style={styles.emptyText}>No available drivers found nearby.</Text>
                    <Text style={styles.emptySubText}>Please try again later.</Text>
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

            <FarmerBottomBar />
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
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#000',
    },
    subtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#666',
    },
    listContent: {
        padding: 20,
    },
    driverCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    driverHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    driverDetails: {
        marginLeft: 12,
        flex: 1,
    },
    driverName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#000',
        marginBottom: 2,
    },
    plateNumber: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#999',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FFF9C4',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    rating: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 12,
        color: '#F57F17',
    },
    driverStats: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    statText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#444',
    },
    availabilityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
    },
    availabilityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    availabilityText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#4CAF50',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
        marginBottom: 8,
        textAlign: 'center'
    },
    emptySubText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#999',
    },
});

