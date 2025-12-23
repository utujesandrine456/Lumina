import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Image, 
    ScrollView, 
    Switch, 
    Alert,
    Dimensions
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useDriverStore } from '@/constants/store';

const { width } = Dimensions.get('window');

export default function DriverProfile() {
    const router = useRouter();
    const { currentUser, drivers = [], trips = [], logout } = useDriverStore();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

    const driver = drivers?.find(d => d?.id === currentUser?.id) || drivers?.[0];

    const driverTrips = trips?.filter(trip => trip?.driverId === driver?.id) || [];
    const completedTrips = driverTrips.filter(trip => trip?.status === 'delivered') || [];
    const totalDistance = completedTrips.reduce((sum, trip) => sum + (trip?.distance || 0), 0);
    
    useEffect(() => {
        console.log('Driver data:', driver);
        console.log('Driver trips:', driverTrips);
        console.log('Current user:', currentUser);
    }, [driver, driverTrips, currentUser]);
    
    const menuItems = [
        { 
            icon: "time-outline" as const, 
            label: "Trip History", 
            route: "/trips" as const 
        },
        { 
            icon: "person-outline" as const, 
            label: "My Profile", 
            route: "/profile" as const 
        },
        { 
            icon: "notifications-outline" as const, 
            label: "Notifications", 
            route: "/notifications" as const 
        },
        { 
            icon: "help-circle-outline" as const, 
            label: "Help & Support", 
            route: "/help" as const 
        },
    ];

    const handleLogout = () => {
        logout();
        router.replace('/login');
    };

    if (!driver) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>
                    {currentUser ? 'Loading driver profile...' : 'Please log in to view your profile'}
                </Text>
                {!currentUser && (
                    <TouchableOpacity 
                        style={styles.loginButton}
                        onPress={() => router.push('/login')}
                    >
                        <Text style={styles.buttonText}>Go to Login</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
            >
                <Animated.View 
                    entering={FadeInDown.delay(100).springify()} 
                    style={styles.header}
                >
                    <View style={styles.headerTop}>
                        <TouchableOpacity 
                            onPress={() => router.back()} 
                            style={styles.backButton}
                        >
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
                                resizeMode="cover"
                            />
                            <TouchableOpacity style={styles.editAvatarButton}>
                                <Ionicons name="camera" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.userName}>
                            {driver.name || 'Driver Name'}
                        </Text>
                        <Text style={styles.userRole}>
                            {driver.verified ? 'Verified Driver' : 'Driver'}
                        </Text>
                        <Text style={styles.userPhone}>
                            {driver.phone || 'No phone number'}
                        </Text>
                        
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>
                                {driver.rating || '4.9'}
                            </Text>
                            <Text style={styles.ratingCount}>
                                ({driver.totalRatings || '120'} reviews)
                            </Text>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View 
                    entering={FadeInDown.delay(200).springify()} 
                    style={styles.statsRow}
                >
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{completedTrips.length}</Text>
                        <Text style={styles.statLabel}>Trips</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {totalDistance.toFixed(1)} km
                        </Text>
                        <Text style={styles.statLabel}>Distance</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {driver.rating || '4.9'}
                        </Text>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                </Animated.View>

                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.label}
                            style={styles.menuItem}
                            onPress={() => router.push(item.route)}
                        >
                            <View style={styles.menuIconContainer}>
                                <Ionicons 
                                    name={item.icon as any} 
                                    size={22} 
                                    color="#4A90E2" 
                                />
                            </View>
                            <Text style={styles.menuText}>{item.label}</Text>
                            <Ionicons 
                                name="chevron-forward" 
                                size={20} 
                                color="#999" 
                            />
                        </TouchableOpacity>
                    ))}

                    <View style={styles.settingsSection}>
                        <Text style={styles.sectionTitle}>Settings</Text>
                        
                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Ionicons 
                                    name="moon-outline" 
                                    size={22} 
                                    color="#4A90E2" 
                                />
                                <Text style={styles.settingText}>Dark Mode</Text>
                            </View>
                            <Switch
                                value={isDarkMode}
                                onValueChange={setIsDarkMode}
                                trackColor={{ false: "#ddd", true: "#4A90E2" }}
                            />
                        </View>

                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Ionicons 
                                    name="notifications-outline" 
                                    size={22} 
                                    color="#4A90E2" 
                                />
                                <Text style={styles.settingText}>Notifications</Text>
                            </View>
                            <Switch
                                value={isNotificationsEnabled}
                                onValueChange={setIsNotificationsEnabled}
                                trackColor={{ false: "#ddd", true: "#4A90E2" }}
                            />
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Ionicons 
                            name="log-out-outline" 
                            size={22} 
                            color="#FF3B30" 
                        />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
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
        paddingBottom: 30,
    },
    loadingContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20,
        backgroundColor: '#F8F9FA',
    },
    loadingText: {
        fontFamily: 'Poppins_500Medium', 
        fontSize: 16, 
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    header: {
        backgroundColor: '#4A90E2',
        paddingBottom: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#FFF',
    },
    profileCard: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#4A90E2',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#4A90E2',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    userName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 22,
        color: '#333',
        marginBottom: 4,
    },
    userRole: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#4A90E2',
        backgroundColor: '#E8F0FE',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    userPhone: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9E6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    ratingText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#333',
        marginLeft: 4,
    },
    ratingCount: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#999',
        marginLeft: 4,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginTop: -20,
        marginBottom: 20,
    },
    statItem: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 15,
        width: (width - 60) / 3,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statValue: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#333',
        marginBottom: 4,
    },
    statLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#666',
    },
    menuContainer: {
        marginTop: 10,
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#E8F0FE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuText: {
        flex: 1,
        fontFamily: 'Poppins_500Medium',
        fontSize: 15,
        color: '#333',
    },
    settingsSection: {
        marginTop: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
        paddingHorizontal: 5,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 15,
        color: '#333',
        marginLeft: 15,
    },
    loginButton: {
        backgroundColor: '#4A90E2',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 15,
    },
    buttonText: {
        color: '#FFF',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#FFE5E5',
    },
    logoutText: {
        color: '#FF3B30',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
        marginLeft: 10,
    },
});