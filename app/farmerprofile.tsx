import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import ProtectedRoute from '@/components/ProtectedRoute';
import Animated, { FadeInDown, FlipInEasyX } from 'react-native-reanimated';



export default function FarmerProfile() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { currentUser, cooperatives, requests } = useDriverStore();
    const targetFarmerId = id || currentUser?.id;
    const farmer = cooperatives.flatMap(c => c.farmers).find(f => f.id === targetFarmerId);
    const farmerTrips = (requests || []).filter(t => t.farmers && t.farmers.some(f => f.id === targetFarmerId));

    if (!farmer) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Farmer Profile</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Farmer not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <ProtectedRoute>
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Farmer Profile</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <Animated.View entering={FlipInEasyX.delay(200).springify()} style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <Ionicons name="person-circle" size={80} color="#000" />
                        </View>
                        <Text style={styles.farmerName}>{farmer.name}</Text>
                        <Text style={styles.farmerPhone}>{farmer.phone}</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
                        <Text style={styles.sectionTitle}>Personal Information</Text>
                        <View style={styles.infoRow}>
                            <Ionicons name="location-outline" size={20} color="#000" />
                            <Text style={styles.infoLabel}>Village / Cell:</Text>
                            <Text style={styles.infoValue}>{farmer.location || 'Not specified'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="call-outline" size={20} color="#000" />
                            <Text style={styles.infoLabel}>Phone:</Text>
                            <Text style={styles.infoValue}>{farmer.phone}</Text>
                        </View>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.section}>
                        <Text style={styles.sectionTitle}>Crop Types</Text>
                        <View style={styles.cropsContainer}>
                            {farmer.crops.map((crop: any, index: number) => (
                                <Animated.View
                                    key={typeof crop === 'string' ? crop : crop.name || index}
                                    entering={FadeInDown.delay(500 + index * 50).springify()}
                                    style={styles.cropTag}
                                >
                                    <Ionicons name="leaf" size={16} color="#000" />
                                    <Text style={styles.cropTagText}>{typeof crop === 'string' ? crop : crop.name}</Text>
                                </Animated.View>
                            ))}
                        </View>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.section}>
                        <Text style={styles.sectionTitle}>Transport History</Text>
                        {farmerTrips.length === 0 ? (
                            <View style={styles.emptyTrips}>
                                <Ionicons name="cube-outline" size={48} color="#BDBDBD" />
                                <Text style={styles.emptyTripsText}>No transport history</Text>
                            </View>
                        ) : (
                            farmerTrips.map((trip) => (
                                <View key={trip.id} style={styles.tripCard}>
                                    <View style={styles.tripHeader}>
                                        <Text style={styles.tripId}>Trip #{trip.id.slice(-6)}</Text>
                                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
                                            <Text style={styles.statusText}>{getStatusText(trip.status)}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.tripRoute}>
                                        {trip.pickupLocation} → {trip.destination}
                                    </Text>
                                    <Text style={styles.tripDate}>
                                        {trip.bookingTime ? new Date(trip.bookingTime).toLocaleDateString() : 'Date N/A'}
                                    </Text>
                                </View>
                            ))
                        )}
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </ProtectedRoute>
    );
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending': return '#F5F5F5';
        case 'accepted': return '#E0E0E0';
        case 'in-progress': return '#D6D6D6';
        case 'delivered': return '#000';
        default: return '#F5F5F5';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'pending': return 'Pending';
        case 'accepted': return 'Accepted';
        case 'in-progress': return 'In Progress';
        case 'delivered': return 'Delivered';
        default: return status;
    }
};

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
    profileCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        padding: 24,
        margin: 20,
        alignItems: 'center',
    },
    avatarContainer: {
        marginBottom: 16,
    },
    farmerName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        color: '#000',
        marginBottom: 4,
    },
    farmerPhone: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#000',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    infoLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#757575',
    },
    infoValue: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#000',
        flex: 1,
    },
    cropsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    cropTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        gap: 6,
    },
    cropTagText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#000',
    },
    emptyTrips: {
        alignItems: 'center',
        padding: 32,
    },
    emptyTripsText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        marginTop: 12,
    },
    tripCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    tripHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    tripId: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#000',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#000',
    },
    tripRoute: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#000',
        marginBottom: 4,
    },
    tripDate: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
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
        marginBottom: 24,
        textAlign: 'center',
    },
    registerButton: {
        backgroundColor: '#000',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    registerButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
});

