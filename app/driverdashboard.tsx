import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useDriverStore } from '@/constants/store';
import DriverBottomBar from '@/components/DriverBottomBar';

const { width } = Dimensions.get('window');

export default function DriverDashboard() {
    const router = useRouter();
    const { trips, updateDriver, currentUser } = useDriverStore();

    const assignedTrips = trips.filter((t: any) => t.driverId === currentUser?.id && t.status !== 'delivered');
    const completedTrips = trips.filter((t: any) => t.driverId === currentUser?.id && t.status === 'delivered');

    const stats = [
        { label: "Active Trips", value: assignedTrips.length.toString(), icon: "map-outline", color: "#000" },
        { label: "Completed", value: completedTrips.length.toString(), icon: "checkmark-circle-outline", color: "#000" },
        { label: "Rating", value: "4.9", icon: "star-outline", color: "#000" },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted': return '#000';
            case 'in-transit': return '#000';
            case 'delivered': return '#000';
            case 'pending': return '#757575';
            default: return '#757575';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'accepted': return 'Accepted';
            case 'in-transit': return 'In Transit';
            case 'delivered': return 'Delivered';
            case 'pending': return 'Pending';
            default: return status;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Welcome back,</Text>
                        <Text style={styles.driverName}>{currentUser?.name || 'Driver'}</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
                        <Ionicons name="person-circle-outline" size={40} color="#000" />
                    </TouchableOpacity>
                </Animated.View>

                <View style={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <Animated.View key={index} entering={FadeInDown.delay(200 + (index * 100)).springify()} style={styles.statCard}>
                            <View style={[styles.iconContainer, { backgroundColor: '#F5F5F5' }]}>
                                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </Animated.View>
                    ))}
                </View>

                <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.section}>
                    <Text style={styles.sectionHeader}>Assigned Trips</Text>
                    {assignedTrips.length === 0 ? (
                        <View style={styles.emptyCard}>
                            <Ionicons name="map-outline" size={48} color="#BDBDBD" />
                            <Text style={styles.emptyText}>No assigned trips</Text>
                        </View>
                    ) : (
                        assignedTrips.map((trip: any) => (
                            <View key={trip.id} style={styles.tripCard}>
                                <View style={styles.tripHeader}>
                                    <View style={styles.tripInfo}>
                                        <Ionicons name="cube-outline" size={24} color="#000" />
                                        <View style={styles.tripDetails}>
                                            <Text style={styles.tripRoute}>
                                                {trip.pickupLocation} → {trip.destination}
                                            </Text>
                                            <Text style={styles.tripDate}>
                                                {new Date(trip.bookingTime).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(trip.status)}20` }]}>
                                        <Text style={[styles.statusText, { color: getStatusColor(trip.status) }]}>
                                            {getStatusText(trip.status)}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.tripStats}>
                                    <Text style={styles.statText}>{trip.farmers.length} farmer{trip.farmers.length > 1 ? 's' : ''}</Text>
                                    <Text style={styles.statText}>•</Text>
                                    <Text style={styles.statText}>{trip.totalWeight} kg</Text>
                                </View>

                                <View style={styles.statusButtons}>
                                    {trip.status === 'accepted' && (
                                        <TouchableOpacity
                                            style={styles.statusButton}
                                            onPress={() => router.push({ pathname: '/pickupconfirmation', params: { tripId: trip.id } })}
                                        >
                                            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                                            <Text style={styles.statusButtonText}>Confirm Pickup</Text>
                                        </TouchableOpacity>
                                    )}
                                    {trip.status === 'in-transit' && (
                                        <TouchableOpacity
                                            style={styles.statusButton}
                                            onPress={() => router.push({ pathname: '/deliveryconfirmation', params: { tripId: trip.id } })}
                                        >
                                            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                                            <Text style={styles.statusButtonText}>Confirm Delivery</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        ))
                    )}
                </Animated.View>
            </ScrollView>
            <DriverBottomBar />
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
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    greeting: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#757575',
    },
    driverName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        color: '#000',
    },
    profileButton: {
        padding: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        minWidth: (width - 52) / 3,
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
        color: '#000',
        marginBottom: 2,
        textAlign: 'center',
    },
    statLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 11,
        color: '#757575',
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#000',
        marginBottom: 16,
    },
    tripCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    tripHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    tripInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    tripDetails: {
        marginLeft: 12,
        flex: 1,
    },
    tripRoute: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
        color: '#000',
        marginBottom: 4,
    },
    tripDate: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
    },
    tripStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    statText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
    },
    statusButtons: {
        marginTop: 8,
    },
    statusButton: {
        backgroundColor: '#000',
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    statusButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
    },
    emptyCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    emptyText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        marginTop: 12,
    },
});
