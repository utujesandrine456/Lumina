import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Switch } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useDriverStore } from '@/constants/store';

export default function DriverProfile() {
    const router = useRouter();
    const { currentUser, drivers, trips, logout } = useDriverStore();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

    const driver = drivers.find(d => d.id === currentUser?.id) || drivers[0];
    
    const driverTrips = trips.filter(trip => trip.driverId === driver?.id);
    const completedTrips = driverTrips.filter(trip => trip.status === 'delivered');
    const totalDistance = completedTrips.reduce((sum, trip) => sum + (trip.distance || 0), 0);
    
    const menuItems = [
        { icon: "time-outline", label: "Trip History", route: "/trips" },
        { icon: "document-text-outline", label: "Documents", route: "/documents" },
        { icon: "shield-checkmark-outline", label: "Safety Guide", route: "/safety" },
        { icon: "help-circle-outline", label: "Help & Support", route: "/help" },
    ];

    const handleLogout = () => {
        logout();
        router.replace('/login');
    };

    if (!driver) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'Poppins_500Medium', fontSize: 20}}>No driver found</Text>
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
                        <Text style={styles.headerTitle}>Driver Profile</Text>
                        <TouchableOpacity onPress={() => router.push('/editprofile')}>
                            <Ionicons name="create-outline" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={driver.avatar ? { uri: driver.avatar } : require('@/assets/images/Driver.jpg')}
                                style={styles.avatar}
                            />
                            <TouchableOpacity style={styles.editAvatarButton}>
                                <Ionicons name="camera" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.userName}>{driver.name}</Text>
                        <Text style={styles.userRole}>{driver.verified ? 'Verified Driver' : 'Driver'}</Text>
                        <Text style={styles.userPhone}>{driver.phone}</Text>
                        
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>{driver.rating || '4.9'}</Text>
                            <Text style={styles.ratingCount}>({driver.totalRatings || '120'} reviews)</Text>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{completedTrips.length}</Text>
                        <Text style={styles.statLabel}>Trips</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{totalDistance.toFixed(0)} km</Text>
                        <Text style={styles.statLabel}>Distance</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{driver.earnings ? `$${driver.earnings}` : '$2,450'}</Text>
                        <Text style={styles.statLabel}>Earnings</Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(250).springify()} style={styles.vehicleCard}>
                    <View style={styles.vehicleHeader}>
                        <Text style={styles.sectionTitle}>Vehicle Information</Text>
                        <TouchableOpacity onPress={() => router.push('/editvehicle')}>
                            <Text style={{ color: '#1565C0', fontFamily: 'Poppins_500Medium' }}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.vehicleContent}>
                        <Image 
                            source={driver.vehicleImage ? { uri: driver.vehicleImage } : require('@/assets/images/DaihatsuRB.png')} 
                            style={styles.vehicleImage} 
                            resizeMode="contain" 
                        />
                        <View style={styles.vehicleDetails}>
                            <Text style={styles.vehicleName}>{driver.vehicleModel || 'Daihatsu Hijet'}</Text>
                            <Text style={styles.vehiclePlate}>{driver.vehiclePlate || 'RAD 246 F'}</Text>
                            <View style={[styles.vehicleBadge, { backgroundColor: driver.verified ? '#E8F5E9' : '#FFF3E0' }]}>
                                <Text style={[styles.vehicleBadgeText, { color: driver.verified ? '#2E7D32' : '#EF6C00' }]}>
                                    {driver.verified ? 'Verified' : 'Pending'}
                                </Text>
                            </View>
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

                <Animated.View entering={FadeInDown.delay(800).springify()} style={styles.preferencesContainer}>
                    <Text style={styles.sectionTitle}>Preferences</Text>

                    <View style={styles.preferenceItem}>
                        <View style={styles.preferenceLeft}>
                            <View style={[styles.menuIconContainer, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="notifications-outline" size={22} color="#1565C0" />
                            </View>
                            <Text style={styles.menuLabel}>Push Notifications</Text>
                        </View>
                        <Switch
                            value={isNotificationsEnabled}
                            onValueChange={setIsNotificationsEnabled}
                            trackColor={{ false: "#767577", true: "#1A1A1A" }}
                            thumbColor={isNotificationsEnabled ? "#FFF" : "#f4f3f4"}
                        />
                    </View>

                    <View style={styles.preferenceItem}>
                        <View style={styles.preferenceLeft}>
                            <View style={[styles.menuIconContainer, { backgroundColor: '#FFF3E0' }]}>
                                <Ionicons name="moon-outline" size={22} color="#EF6C00" />
                            </View>
                            <Text style={styles.menuLabel}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={setIsDarkMode}
                            trackColor={{ false: "#767577", true: "#1A1A1A" }}
                            thumbColor={isDarkMode ? "#FFF" : "#f4f3f4"}
                        />
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(900).springify()} style={styles.logoutContainer}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                        <Text style={styles.logoutText}>Log Out</Text>
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
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
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
        color: '#757575',
        marginBottom: 4,
    },
    userPhone: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        marginBottom: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#1A1A1A',
        marginLeft: 4,
    },
    ratingCount: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#9E9E9E',
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
    vehicleCard: {
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
    vehicleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    vehicleContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    vehicleImage: {
        width: 100,
        height: 70,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
    },
    vehicleDetails: {
        flex: 1,
    },
    vehicleName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
        marginBottom: 4,
    },
    vehiclePlate: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#757575',
        marginBottom: 8,
    },
    vehicleBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    vehicleBadgeText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
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
    preferencesContainer: {
        marginHorizontal: 24,
        marginBottom: 24,
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
        marginBottom: 16,
        marginLeft: 8,
    },
    preferenceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 18,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    preferenceLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    logoutContainer: {
        marginHorizontal: 24,
        marginBottom: 20,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFEBEE',
        paddingVertical: 18,
        borderRadius: 16,
        gap: 12,
    },
    logoutText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#FF3B30',
    },
});