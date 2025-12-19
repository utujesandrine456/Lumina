import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useDriverStore } from '@/constants/store';
import * as Location from 'expo-location';
import CooperativeBottomBar from '@/components/CooperativeBottomBar';

const { width } = Dimensions.get('window');

export default function CooperativeDashboard() {
    const router = useRouter();
    const { farmers, trips, drivers, setNearbyDrivers } = useDriverStore();

    const totalFarmers = farmers.length;
    const activeTrips = trips.filter(t => t.status !== 'delivered').length;
    const nearbyAvailableDrivers = drivers.filter(d => d.availability && d.verified).length;

    const quickActions = [
        { label: "Register Farmer", icon: "person-add-outline", route: "/registerfarmer", color: "#000" },
        { label: "Register Driver", icon: "car-outline", route: "/registerdriver", color: "#000" },
        { label: "Farmers List", icon: "people-outline", route: "/farmerslist", color: "#000" },
        { label: "Nearby Drivers", icon: "car-outline", route: "/nearbydrivers", color: "#000" },
        { label: "Trips", icon: "map-outline", route: "/trips", color: "#000" },
    ];

    const recentActivity = trips.slice(0, 3).map(trip => ({
        id: trip.id,
        type: "Trip",
        detail: `${trip.farmers.length} farmers to ${trip.destination}`,
        date: new Date(trip.bookingTime).toLocaleDateString(),
        status: trip.status,
    }));

    useEffect(() => {
        // Get current location and find nearby drivers
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                let location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;
                
                // Calculate distances and sort drivers
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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Good Morning,</Text>
                        <Text style={styles.userName}>Cooperative Officer</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton}>
                        <Ionicons name="person-circle-outline" size={40} color="#000" />
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{totalFarmers}</Text>
                        <Text style={styles.statLabel}>Total Farmers</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{activeTrips}</Text>
                        <Text style={styles.statLabel}>Active Trips</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{nearbyAvailableDrivers}</Text>
                        <Text style={styles.statLabel}>Nearby Drivers</Text>
                    </View>
                </Animated.View>

                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    {quickActions.map((action, index) => (
                        <Animated.View key={index} entering={FadeInDown.delay(300 + (index * 50)).springify()} style={styles.actionWrapper}>
                            <TouchableOpacity style={styles.actionButton} onPress={() => router.push(action.route as any)}>
                                <View style={[styles.actionIcon, { backgroundColor: '#F5F5F5' }]}>
                                    <Ionicons name={action.icon as any} size={24} color={action.color} />
                                </View>
                                <Text style={styles.actionLabel}>{action.label}</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.activityList}>
                    {recentActivity.length > 0 ? (
                        recentActivity.map((item) => (
                            <View key={item.id} style={styles.activityItem}>
                                <View style={styles.activityIcon}>
                                    <Ionicons name="cube-outline" size={24} color="#000" />
                                </View>
                                <View style={styles.activityContent}>
                                    <Text style={styles.activityDetail}>{item.detail}</Text>
                                    <Text style={styles.activityDate}>{item.date} • {item.status}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No trips yet. Start by registering farmers!</Text>
                    )}
                </Animated.View>
            </ScrollView>
            <CooperativeBottomBar />
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
        marginBottom: 24,
    },
    greeting: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
    },
    userName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        color: '#000',
    },
    profileButton: {
        padding: 4,
    },
    statsCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 32,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 24,
        color: '#000',
        marginBottom: 4,
    },
    statLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#E0E0E0',
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#000',
        marginBottom: 16,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },
    actionWrapper: {
        width: (width - 52) / 2,
    },
    actionButton: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#000',
    },
    activityList: {
        gap: 12,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    activityContent: {
        flex: 1,
    },
    activityDetail: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#000',
        marginBottom: 2,
    },
    activityDate: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
    },
    emptyText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        textAlign: 'center',
        padding: 20,
    },
});

