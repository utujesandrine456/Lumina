import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import ErrorBoundary from '@/components/ErrorBoundary';
import FarmerBottomBar from '@/components/FarmerBottomBar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function NearbyDrivers() {
    return (
        <ProtectedRoute>
            <ErrorBoundary>
                <NearbyDriversContent />
            </ErrorBoundary>
        </ProtectedRoute>
    );
}

function NearbyDriversContent() {
    const router = useRouter();
    const { nearbyDrivers, drivers, setNearbyDrivers, updateRequest } = useDriverStore();
    const { requestId } = useLocalSearchParams();


    const [refreshing, setRefreshing] = useState(false);
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

    const loadDrivers = () => {
        const available = drivers.filter(d => d.available);
        setNearbyDrivers(available as any);
    };

    useEffect(() => {
        loadDrivers();
    }, [drivers, setNearbyDrivers]);

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => {
            loadDrivers();
            setRefreshing(false);
        }, 1500);
    };

    const handleDriverSelect = (driverId: string) => {
        setSelectedDriverId(driverId === selectedDriverId ? null : driverId);
    };

    const confirmSelection = () => {
        if (!selectedDriverId) return;

        if (!requestId) {
            Alert.alert('Error', 'No active request found.');
            return;
        }

        const driver = nearbyDrivers.find(d => d.id === selectedDriverId);
        if (!driver) return;

        updateRequest(requestId as string, {
            driverId: driver.id,
            status: 'pending'
        });

        Alert.alert(
            'Request Sent',
            `Your request has been sent to ${driver.fullName}. You can track the status in Trips.`,
            [
                {
                    text: 'Go to Trips',
                    onPress: () => router.push('/trips')
                }
            ]
        );
    };

    const renderDriver = ({ item }: { item: any }) => {
        const distance = item.distance || (Math.random() * 5);
        const isSelected = selectedDriverId === item.id;

        return (
            <TouchableOpacity
                style={[
                    styles.driverCard,
                    isSelected && { backgroundColor: '#000', borderColor: '#000' }
                ]}
                onPress={() => handleDriverSelect(item.id)}
                activeOpacity={0.9}
            >
                <View style={styles.driverHeader}>
                    <View style={styles.driverInfo}>
                        <View style={[styles.avatarCircle, isSelected && { backgroundColor: '#FFF' }]}>
                            <Ionicons name="person" size={24} color={isSelected ? "#000" : "#FFF"} />
                        </View>
                        <View style={styles.driverDetails}>
                            <Text style={[styles.driverName, isSelected && { color: '#FFF' }]}>{item.fullName}</Text>
                            <Text style={[styles.plateNumber, isSelected && { color: '#CCC' }]}>{item.plateNumber} • {item.vehicleType || 'Truck'}</Text>
                        </View>
                    </View>
                    <View style={[styles.ratingContainer, isSelected && { backgroundColor: '#333' }]}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={[styles.rating, isSelected && { color: '#FFF' }]}>{(item.rating || 5.0).toFixed(1)}</Text>
                    </View>
                </View>

                <View style={styles.driverStats}>
                    <View style={[styles.statBadge, isSelected && { backgroundColor: '#333' }]}>
                        <Ionicons name="cube-outline" size={16} color={isSelected ? "#FFF" : "#666"} />
                        <Text style={[styles.statText, isSelected && { color: '#FFF' }]}>{item.capacity || '1000'} kg</Text>
                    </View>
                    <View style={[styles.statBadge, isSelected && { backgroundColor: '#333' }]}>
                        <Ionicons name="location-outline" size={16} color={isSelected ? "#FFF" : "#666"} />
                        <Text style={[styles.statText, isSelected && { color: '#FFF' }]}>
                            {distance.toFixed(1)} km away
                        </Text>
                    </View>
                </View>

                <View style={[styles.availabilityBadge, isSelected && { borderTopColor: '#333' }]}>
                    <View style={[styles.availabilityDot, { backgroundColor: '#4CAF50' }]} />
                    <Text style={[styles.availabilityText, isSelected && { color: '#4CAF50' }]}>Available Now</Text>
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
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}

            {selectedDriverId && (
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.confirmButton} onPress={confirmSelection}>
                        <Text style={styles.confirmButtonText}>Confirm Selection</Text>
                        <Ionicons name="arrow-forward" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
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
    footer: {
        padding: 24,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    confirmButton: {
        backgroundColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
    },
    confirmButtonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#FFF',
    },
});

