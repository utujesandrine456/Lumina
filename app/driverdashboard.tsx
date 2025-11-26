import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import BottomBar from '@/components/DriverBottomBar';
import { useDriverStore } from '@/constants/store';

const { width } = Dimensions.get('window');

export default function DriverDashboard() {
    const router = useRouter();
    const { truckStatus, setTruckStatus } = useDriverStore();

    const stats = [
        { label: "Today's Earnings", value: "45,000 Frw", icon: "wallet-outline", color: "#4CAF50" },
        { label: "Total Trips", value: "12", icon: "map-outline", color: "#2196F3" },
        { label: "Rating", value: "4.9", icon: "star-outline", color: "#FFD700" },
    ];

    const recentTrips = [
        { id: 1, from: "Musanze", to: "Kigali", price: "15,000 Frw", status: "Completed", date: "Today, 10:00 AM" },
        { id: 2, from: "Rubavu", to: "Musanze", price: "12,000 Frw", status: "Completed", date: "Yesterday, 2:30 PM" },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Moving': return '#4CAF50';
            case 'Paused': return '#FFC107';
            case 'Stopped': return '#F44336';
            default: return '#757575';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Welcome back,</Text>
                        <Text style={styles.driverName}>John Doe</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/driverprofile')}>
                        <Ionicons name="person-circle-outline" size={40} color="#000" />
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statusCard}>
                    <Text style={styles.cardTitle}>Current Status</Text>
                    <View style={styles.statusIndicator}>
                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(truckStatus) }]} />
                        <Text style={[styles.statusText, { color: getStatusColor(truckStatus) }]}>{truckStatus}</Text>
                    </View>

                    <View style={styles.statusButtons}>
                        <TouchableOpacity
                            style={[styles.statusBtn, truckStatus === 'Moving' && styles.activeStatusBtn, { borderColor: '#4CAF50' }]}
                            onPress={() => setTruckStatus('Moving')}
                        >
                            <Ionicons name="navigate-outline" size={24} color={truckStatus === 'Moving' ? '#FFF' : '#4CAF50'} />
                            <Text style={[styles.statusBtnText, truckStatus === 'Moving' && styles.activeStatusBtnText, { color: truckStatus === 'Moving' ? '#FFF' : '#4CAF50' }]}>Moving</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.statusBtn, truckStatus === 'Paused' && styles.activeStatusBtn, { borderColor: '#FFC107' }]}
                            onPress={() => setTruckStatus('Paused')}
                        >
                            <Ionicons name="pause-outline" size={24} color={truckStatus === 'Paused' ? '#FFF' : '#FFC107'} />
                            <Text style={[styles.statusBtnText, truckStatus === 'Paused' && styles.activeStatusBtnText, { color: truckStatus === 'Paused' ? '#FFF' : '#FFC107' }]}>Paused</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.statusBtn, truckStatus === 'Stopped' && styles.activeStatusBtn, { borderColor: '#F44336' }]}
                            onPress={() => setTruckStatus('Stopped')}
                        >
                            <Ionicons name="stop-circle-outline" size={24} color={truckStatus === 'Stopped' ? '#FFF' : '#F44336'} />
                            <Text style={[styles.statusBtnText, truckStatus === 'Stopped' && styles.activeStatusBtnText, { color: truckStatus === 'Stopped' ? '#FFF' : '#F44336' }]}>Stopped</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>


                <View style={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <Animated.View key={index} entering={FadeInDown.delay(300 + (index * 100)).springify()} style={styles.statCard}>
                            <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
                                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </Animated.View>
                    ))}
                </View>


                <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.availabilityCard}>
                    <View style={styles.availabilityContent}>
                        <Ionicons name="calendar-outline" size={32} color="#FFF" />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.availabilityTitle}>Manage Availability</Text>
                            <Text style={styles.availabilityDesc}>Set your unavailable dates to inform farmers.</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.availabilityButton} onPress={() => router.push('/datetime')}>
                        <Text style={styles.availabilityBtnText}>Update Calendar</Text>
                        <Ionicons name="arrow-forward" size={20} color="#000" />
                    </TouchableOpacity>
                </Animated.View>


                <Animated.View entering={FadeInDown.delay(700).springify()} style={styles.section}>
                    <Text style={styles.sectionHeader}>Recent Trips</Text>
                    {recentTrips.map((trip, index) => (
                        <View key={trip.id} style={styles.tripCard}>
                            <View style={styles.tripIcon}>
                                <Ionicons name="cube-outline" size={24} color="#000" />
                            </View>
                            <View style={styles.tripInfo}>
                                <Text style={styles.tripRoute}>{trip.from} → {trip.to}</Text>
                                <Text style={styles.tripDate}>{trip.date}</Text>
                            </View>
                            <View style={styles.tripRight}>
                                <Text style={styles.tripPrice}>{trip.price}</Text>
                                <Text style={styles.tripStatus}>{trip.status}</Text>
                            </View>
                        </View>
                    ))}
                </Animated.View>

            </ScrollView>
            <BottomBar />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
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
        color: '#1A1A1A',
    },
    profileButton: {
        padding: 4,
    },
    statusCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    cardTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
        marginBottom: 12,
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 12,
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    statusText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
    },
    statusButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    statusBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
        backgroundColor: '#FFF',
    },
    activeStatusBtn: {
        backgroundColor: '#000', // Will be overridden by specific colors logic if needed, but using inline styles for color mapping
        borderWidth: 0,
    },
    statusBtnText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        marginTop: 4,
    },
    activeStatusBtnText: {
        color: '#FFF',
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
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
        color: '#1A1A1A',
        marginBottom: 2,
        textAlign: 'center',
    },
    statLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 11,
        color: '#9E9E9E',
        textAlign: 'center',
    },
    availabilityCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
    },
    availabilityContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    availabilityTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#FFF',
    },
    availabilityDesc: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: '#CCC',
    },
    availabilityButton: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    availabilityBtnText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#000',
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
        marginBottom: 16,
    },
    tripCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    tripIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    tripInfo: {
        flex: 1,
    },
    tripRoute: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
        color: '#1A1A1A',
        marginBottom: 4,
    },
    tripDate: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#9E9E9E',
    },
    tripRight: {
        alignItems: 'flex-end',
    },
    tripPrice: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
        color: '#4CAF50',
        marginBottom: 4,
    },
    tripStatus: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 11,
        color: '#9E9E9E',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
});
