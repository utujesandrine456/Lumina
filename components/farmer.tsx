import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Switch } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useDriverStore } from '@/constants/store';

export default function FarmerProfile() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { farmers, trips } = useDriverStore();
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
    
    // Get farmer from params or use first farmer
    const farmerId = params.id as string;
    const farmer = farmers.find(f => f.id === farmerId) || farmers[0];
    
    const farmerTrips = trips.filter(trip => 
        trip.farmers.some(f => f.id === farmer?.id)
    );
    const completedTrips = farmerTrips.filter(trip => trip.status === 'delivered');
    
    const menuItems = [
        { icon: "calendar-outline", label: "Harvest Schedule", route: "/harvestschedule" },
        { icon: "document-text-outline", label: "Crop Records", route: "/croprecords" },
        { icon: "cash-outline", label: "Payment History", route: "/payments" },
        { icon: "chatbubble-outline", label: "Messages", route: "/messages" },
        { icon: "help-circle-outline", label: "Support", route: "/support" },
    ];

    if (!farmer) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'Poppins_500Medium', fontSize: 20}}>No farmer found</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Farmer Profile</Text>
                        <TouchableOpacity onPress={() => router.push({ 
                            pathname: '/editfarmer', 
                            params: { id: farmer.id }
                        })}>
                            <Ionicons name="create-outline" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={require('@/assets/images/Farmer.jpg')}
                                style={styles.avatar}
                            />
                        </View>
                        <Text style={styles.userName}>{farmer.name}</Text>
                        <Text style={styles.userRole}>Registered Farmer</Text>
                        <Text style={styles.userPhone}>{farmer.phone}</Text>
                        
                        <View style={styles.locationContainer}>
                            <Ionicons name="location-outline" size={16} color="#757575" />
                            <Text style={styles.locationText}>{farmer.location}</Text>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{farmerTrips.length}</Text>
                        <Text style={styles.statLabel}>Total Trips</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{completedTrips.length}</Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>5</Text>
                        <Text style={styles.statLabel}>Years</Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(250).springify()} style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Farm Information</Text>
                    
                    <View style={styles.infoGrid}>
                        <View style={styles.infoItem}>
                            <View style={[styles.infoIcon, { backgroundColor: '#E8F5E9' }]}>
                                <Ionicons name="leaf-outline" size={20} color="#2E7D32" />
                            </View>
                            <Text style={styles.infoLabel}>Crop Type</Text>
                            <Text style={styles.infoValue}>{farmer.crop || 'Maize'}</Text>
                        </View>
                        
                        <View style={styles.infoItem}>
                            <View style={[styles.infoIcon, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="cube-outline" size={20} color="#1565C0" />
                            </View>
                            <Text style={styles.infoLabel}>Avg. Yield</Text>
                            <Text style={styles.infoValue}>2.5 tons</Text>
                        </View>
                        
                        <View style={styles.infoItem}>
                            <View style={[styles.infoIcon, { backgroundColor: '#FFF3E0' }]}>
                                <Ionicons name="calendar-outline" size={20} color="#EF6C00" />
                            </View>
                            <Text style={styles.infoLabel}>Next Harvest</Text>
                            <Text style={styles.infoValue}>Dec 15</Text>
                        </View>
                        
                        <View style={styles.infoItem}>
                            <View style={[styles.infoIcon, { backgroundColor: '#F3E5F5' }]}>
                                <Ionicons name="pricetag-outline" size={20} color="#7B1FA2" />
                            </View>
                            <Text style={styles.infoLabel}>Market Price</Text>
                            <Text style={styles.infoValue}>$120/ton</Text>
                        </View>
                    </View>
                </Animated.View>

                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <Animated.View key={index} entering={FadeInDown.delay(300 + (index * 100)).springify()}>
                            <TouchableOpacity 
                                style={styles.menuItem}
                                onPress={() => router.push(item.route as any)}
                            >
                                <View style={styles.menuItemLeft}>
                                    <View style={styles.menuIconContainer}>
                                        <Ionicons name={item.icon as any} size={22} color="#1A1A1A" />
                                    </View>
                                    <Text style={styles.menuLabel}>{item.label}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#CCC" />
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                <Animated.View entering={FadeInDown.delay(800).springify()} style={styles.recentTripsContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Trips</Text>
                        <TouchableOpacity onPress={() => router.push('/farmertrips')}>
                            <Text style={{ color: '#1565C0', fontFamily: 'Poppins_500Medium' }}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {farmerTrips.slice(0, 3).map((trip, index) => (
                        <Animated.View 
                            key={trip.id} 
                            entering={FadeInDown.delay(400 + (index * 100)).springify()}
                            style={styles.tripItem}
                        >
                            <View style={styles.tripIcon}>
                                <Ionicons name="cube-outline" size={24} color="#1565C0" />
                            </View>
                            <View style={styles.tripDetails}>
                                <Text style={styles.tripDestination}>{trip.destination}</Text>
                                <Text style={styles.tripInfo}>
                                    {new Date(trip.bookingTime).toLocaleDateString()} • {trip.status}
                                </Text>
                            </View>
                            <Text style={styles.tripQuantity}>{trip.cargoWeight} tons</Text>
                        </Animated.View>
                    ))}
                    
                    {farmerTrips.length === 0 && (
                        <View style={styles.emptyTrips}>
                            <Ionicons name="cube-outline" size={40} color="#E0E0E0" />
                            <Text style={styles.emptyText}>No trips yet</Text>
                            <Text style={styles.emptySubtext}>Start by scheduling a delivery</Text>
                        </View>
                    )}
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(900).springify()} style={styles.contactContainer}>
                    <TouchableOpacity style={styles.callButton}>
                        <Ionicons name="call-outline" size={20} color="#FFF" />
                        <Text style={styles.callButtonText}>Call Farmer</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.messageButton}>
                        <Ionicons name="chatbubble-outline" size={20} color="#1565C0" />
                        <Text style={styles.messageButtonText}>Message</Text>
                    </TouchableOpacity>
                </Animated.View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 10,
        marginBottom: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    headerTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
    },
    profileCard: {
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#FFF',
    },
    userName: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 24,
        color: '#1A1A1A',
        marginBottom: 4,
    },
    userRole: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#2E7D32',
        marginBottom: 4,
    },
    userPhone: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        marginBottom: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        marginHorizontal: 24,
        paddingVertical: 20,
        borderRadius: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 20,
        color: '#1A1A1A',
    },
    statLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#9E9E9E',
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#EEEEEE',
    },
    infoCard: {
        backgroundColor: '#FFF',
        marginHorizontal: 24,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    infoItem: {
        width: '47%',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
        marginBottom: 4,
    },
    infoValue: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#1A1A1A',
    },
    menuContainer: {
        backgroundColor: '#FFF',
        marginHorizontal: 24,
        borderRadius: 24,
        padding: 8,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 16,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    menuIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#1A1A1A',
    },
    recentTripsContainer: {
        marginHorizontal: 24,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
    },
    tripItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
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
        borderRadius: 12,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    tripDetails: {
        flex: 1,
    },
    tripDestination: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 15,
        color: '#1A1A1A',
        marginBottom: 4,
    },
    tripInfo: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
    },
    tripQuantity: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#2E7D32',
    },
    emptyTrips: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#FFF',
        borderRadius: 20,
    },
    emptyText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#757575',
        marginTop: 12,
    },
    emptySubtext: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#BDBDBD',
        marginTop: 4,
    },
    contactContainer: {
        flexDirection: 'row',
        gap: 12,
        marginHorizontal: 24,
        marginBottom: 20,
    },
    callButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2E7D32',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
    },
    callButtonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#FFF',
    },
    messageButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E3F2FD',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
    },
    messageButtonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#1565C0',
    },
});