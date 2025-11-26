import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import BottomBar from '@/components/BottomBar';
import { useDriverStore } from '@/constants/store';

const { width } = Dimensions.get('window');
export default function FarmerDashboard() {
    const router = useRouter();
    const { truckStatus } = useDriverStore();

    const activeShipment = {
        id: "TRK-8821",
        driver: "John Doe",
        truck: "Daihatsu",
        plate: "RAD246F",
        destination: "Kigali, Nyabugogo",
        eta: "2 hrs 30 min",
    };

    const quickActions = [
        { label: "Book Truck", icon: "car-sport-outline", route: "/trucks", color: "#1A1A1A" },
        { label: "My Crops", icon: "leaf-outline", route: "/crops", color: "#4CAF50" },
        { label: "History", icon: "time-outline", route: "/history", color: "#2196F3" },
        { label: "Support", icon: "headset-outline", route: "/support", color: "#FF9800" },
    ];

    const recentActivity = [
        { id: 1, type: "Shipment", detail: "Potatoes to Musanze", date: "Yesterday", status: "Completed", amount: "-15,000 Frw" },
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
                        <Text style={styles.greeting}>Good Morning,</Text>
                        <Text style={styles.userName}>Farmer Joe</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/farmerprofile')}>
                        <Image source={require('@/assets/images/Farmer.jpg')} style={styles.avatar} />
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.shipmentCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Active Shipment</Text>
                        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(truckStatus)}20` }]}>
                            <View style={[styles.statusDot, { backgroundColor: getStatusColor(truckStatus) }]} />
                            <Text style={[styles.statusText, { color: getStatusColor(truckStatus) }]}>{truckStatus}</Text>
                        </View>
                    </View>

                    <View style={styles.shipmentDetails}>
                        <View style={styles.routeContainer}>
                            <View style={styles.routeDot} />
                            <View style={styles.routeLine} />
                            <View style={[styles.routeDot, { backgroundColor: '#1A1A1A' }]} />
                        </View>
                        <View style={styles.routeTextContainer}>
                            <View>
                                <Text style={styles.routeLabel}>Current Location</Text>
                                <Text style={styles.routeValue}>Musanze, Ruhengeri</Text>
                            </View>
                            <View style={{ marginTop: 24 }}>
                                <Text style={styles.routeLabel}>Destination</Text>
                                <Text style={styles.routeValue}>{activeShipment.destination}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.driverInfo}>
                        <View style={styles.driverDetails}>
                            <Ionicons name="person-circle-outline" size={36} color="#757575" />
                            <View>
                                <Text style={styles.driverName}>{activeShipment.driver}</Text>
                                <Text style={styles.truckInfo}>{activeShipment.truck} • {activeShipment.plate}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.callButton}>
                            <Ionicons name="call" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    {quickActions.map((action, index) => (
                        <Animated.View key={index} entering={FadeInDown.delay(300 + (index * 50)).springify()} style={styles.actionWrapper}>
                            <TouchableOpacity style={styles.actionButton} onPress={() => router.push(action.route as any)}>
                                <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                                    <Ionicons name={action.icon as any} size={24} color={action.color} />
                                </View>
                                <Text style={styles.actionLabel}>{action.label}</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.activityList}>
                    {recentActivity.map((item, index) => (
                        <View key={item.id} style={styles.activityItem}>
                            <View style={styles.activityIcon}>
                                <Ionicons
                                    name={item.type === "Shipment" ? "cube-outline" : "cash-outline"}
                                    size={24}
                                    color="#1A1A1A"
                                />
                            </View>
                            <View style={styles.activityContent}>
                                <Text style={styles.activityDetail}>{item.detail}</Text>
                                <Text style={styles.activityDate}>{item.date} • {item.status}</Text>
                            </View>
                            <Text style={[
                                styles.activityAmount,
                                { color: item.amount.startsWith('+') ? '#4CAF50' : '#1A1A1A' }
                            ]}>
                                {item.amount}
                            </Text>
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
        color: '#1A1A1A',
    },
    profileButton: {
        padding: 2,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    shipmentCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#1A1A1A',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
    },
    shipmentDetails: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    routeContainer: {
        alignItems: 'center',
        marginRight: 16,
        paddingVertical: 4,
    },
    routeDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#1A1A1A',
        backgroundColor: '#FFF',
    },
    routeLine: {
        width: 2,
        height: 36,
        backgroundColor: '#E0E0E0',
        marginVertical: 4,
    },
    routeTextContainer: {
        flex: 1,
    },
    routeLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 11,
        color: '#9E9E9E',
        marginBottom: 2,
    },
    routeValue: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#1A1A1A',
    },
    driverInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
    },
    driverDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    driverName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#1A1A1A',
    },
    truckInfo: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
    },
    callButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
        marginBottom: 16,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },
    actionWrapper: {
        width: (width - 52) / 2, // 2 columns with gap
    },
    actionButton: {
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
        color: '#1A1A1A',
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
        color: '#1A1A1A',
        marginBottom: 2,
    },
    activityDate: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#9E9E9E',
    },
    activityAmount: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
    },
});
