import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Switch } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useDriverStore } from '@/constants/store';

export default function AdminProfile() {
    const router = useRouter();
    const { drivers, farmers, trips, logout } = useDriverStore();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
    const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(true);
    
    const totalDrivers = drivers.length;
    const verifiedDrivers = drivers.filter(d => d.verified).length;
    const totalFarmers = farmers.length;
    const activeTrips = trips.filter(t => t.status !== 'delivered').length;
    const completedTrips = trips.filter(t => t.status === 'delivered').length;
    const totalRevenue = trips.reduce((sum, trip) => sum + (trip.totalAmount || 0), 0);
    
    const adminMenuItems = [
        { icon: "people-outline", label: "Manage Users", route: "/manageusers", color: "#0000" },
        { icon: "stats-chart-outline", label: "Analytics", route: "/analytics", color: "#000" },
        { icon: "settings-outline", label: "System Settings", route: "/systemsettings", color: "#0000" },
        { icon: "shield-checkmark-outline", label: "Security", route: "/security", color: "#0000" },
        { icon: "document-text-outline", label: "Reports", route: "/reports", color: "#0000" },
        { icon: "cash-outline", label: "Financials", route: "/financials", color: "#0000" },
    ];

    const quickStats = [
        { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: "cash", color: "#2E7D32" },
        { label: "Active Trips", value: activeTrips.toString(), icon: "navigate", color: "#1565C0" },
        { label: "Drivers Online", value: drivers.filter(d => d.availability).length.toString(), icon: "car", color: "#FF9800" },
        { label: "System Health", value: "98%", icon: "pulse", color: "#4CAF50" },
    ];

    const recentActivities = [
        { id: 1, action: "New driver registered", time: "10 min ago", type: "driver" },
        { id: 2, action: "Trip #TRP-245 completed", time: "25 min ago", type: "trip" },
        { id: 3, action: "Farmer payment processed", time: "1 hour ago", type: "payment" },
        { id: 4, action: "System backup completed", time: "2 hours ago", type: "system" },
    ];

    const handleLogout = () => {
        logout();
        router.replace('/login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Admin Dashboard</Text>
                        <TouchableOpacity style={styles.notificationButton}>
                            <Ionicons name="notifications-outline" size={24} color="#000" />
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationBadgeText}>3</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileSection}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={require('@/assets/images/Admin.jpg')}
                                style={styles.avatar}
                            />
                            <View style={styles.adminBadge}>
                                <Ionicons name="shield-checkmark" size={16} color="#FFF" />
                            </View>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.userName}>System Administrator</Text>
                            <Text style={styles.userEmail}>admin@agroconnect.com</Text>
                            <Text style={styles.userRole}>Super Admin</Text>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.quickStatsGrid}>
                    {quickStats.map((stat, index) => (
                        <View key={index} style={styles.statCard}>
                            <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}>
                                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(250).springify()} style={styles.overviewCard}>
                    <Text style={styles.sectionTitle}>System Overview</Text>
                    
                    <View style={styles.overviewGrid}>
                        <View style={styles.overviewItem}>
                            <View style={styles.overviewItemHeader}>
                                <View style={[styles.overviewIcon, { backgroundColor: '#E3F2FD' }]}>
                                    <Ionicons name="people-outline" size={20} color="#1565C0" />
                                </View>
                                <Text style={styles.overviewLabel}>Drivers</Text>
                            </View>
                            <Text style={styles.overviewValue}>{totalDrivers}</Text>
                            <Text style={styles.overviewSubtext}>{verifiedDrivers} verified</Text>
                        </View>
                        
                        <View style={styles.overviewItem}>
                            <View style={styles.overviewItemHeader}>
                                <View style={[styles.overviewIcon, { backgroundColor: '#E8F5E9' }]}>
                                    <Ionicons name="leaf-outline" size={20} color="#2E7D32" />
                                </View>
                                <Text style={styles.overviewLabel}>Farmers</Text>
                            </View>
                            <Text style={styles.overviewValue}>{totalFarmers}</Text>
                            <Text style={styles.overviewSubtext}>Active users</Text>
                        </View>
                        
                        <View style={styles.overviewItem}>
                            <View style={styles.overviewItemHeader}>
                                <View style={[styles.overviewIcon, { backgroundColor: '#FFF3E0' }]}>
                                    <Ionicons name="cube-outline" size={20} color="#EF6C00" />
                                </View>
                                <Text style={styles.overviewLabel}>Trips</Text>
                            </View>
                            <Text style={styles.overviewValue}>{trips.length}</Text>
                            <Text style={styles.overviewSubtext}>{completedTrips} completed</Text>
                        </View>
                        
                        <View style={styles.overviewItem}>
                            <View style={styles.overviewItemHeader}>
                                <View style={[styles.overviewIcon, { backgroundColor: '#F3E5F5' }]}>
                                    <Ionicons name="trending-up-outline" size={20} color="#7B1FA2" />
                                </View>
                                <Text style={styles.overviewLabel}>Growth</Text>
                            </View>
                            <Text style={styles.overviewValue}>+24%</Text>
                            <Text style={styles.overviewSubtext}>This month</Text>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <Text style={[styles.sectionTitle, { marginHorizontal: 24, marginBottom: 16 }]}>Admin Controls</Text>
                    <View style={styles.adminMenuGrid}>
                        {adminMenuItems.map((item, index) => (
                            <TouchableOpacity 
                                key={index}
                                style={styles.adminMenuItem}
                                onPress={() => router.push(item.route as any)}
                            >
                                <View style={[styles.adminMenuIcon, { backgroundColor: `${item.color}15` }]}>
                                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                                </View>
                                <Text style={styles.adminMenuLabel}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                {/* Recent Activities */}
                <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.activitiesCard}>
                    <View style={styles.activitiesHeader}>
                        <Text style={styles.sectionTitle}>Recent Activities</Text>
                        <TouchableOpacity>
                            <Text style={{ color: '#1565C0', fontFamily: 'Poppins_500Medium' }}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.activitiesList}>
                        {recentActivities.map((activity, index) => (
                            <View key={activity.id} style={styles.activityItem}>
                                <View style={[
                                    styles.activityIcon,
                                    { backgroundColor: 
                                        activity.type === 'driver' ? '#E3F2FD' :
                                        activity.type === 'trip' ? '#E8F5E9' :
                                        activity.type === 'payment' ? '#FFF3E0' : '#F3E5F5'
                                    }
                                ]}>
                                    <Ionicons 
                                        name={
                                            activity.type === 'driver' ? 'person-add' :
                                            activity.type === 'trip' ? 'cube' :
                                            activity.type === 'payment' ? 'cash' : 'server'
                                        } 
                                        size={20} 
                                        color={
                                            activity.type === 'driver' ? '#1565C0' :
                                            activity.type === 'trip' ? '#2E7D32' :
                                            activity.type === 'payment' ? '#EF6C00' : '#7B1FA2'
                                        } 
                                    />
                                </View>
                                <View style={styles.activityContent}>
                                    <Text style={styles.activityText}>{activity.action}</Text>
                                    <Text style={styles.activityTime}>{activity.time}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.preferencesCard}>
                    <Text style={styles.sectionTitle}>Admin Preferences</Text>
                    
                    <View style={styles.preferenceItem}>
                        <View style={styles.preferenceLeft}>
                            <View style={[styles.preferenceIcon, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="notifications-outline" size={22} color="#1565C0" />
                            </View>
                            <View>
                                <Text style={styles.preferenceLabel}>System Notifications</Text>
                                <Text style={styles.preferenceSubtext}>Receive alerts for system events</Text>
                            </View>
                        </View>
                        <Switch
                            value={isNotificationsEnabled}
                            onValueChange={setIsNotificationsEnabled}
                            trackColor={{ false: "#767577", true: "#1565C0" }}
                            thumbColor={isNotificationsEnabled ? "#FFF" : "#f4f3f4"}
                        />
                    </View>

                    <View style={styles.preferenceItem}>
                        <View style={styles.preferenceLeft}>
                            <View style={[styles.preferenceIcon, { backgroundColor: '#E8F5E9' }]}>
                                <Ionicons name="stats-chart-outline" size={22} color="#2E7D32" />
                            </View>
                            <View>
                                <Text style={styles.preferenceLabel}>Analytics Auto-Refresh</Text>
                                <Text style={styles.preferenceSubtext}>Auto-update dashboard metrics</Text>
                            </View>
                        </View>
                        <Switch
                            value={isAnalyticsEnabled}
                            onValueChange={setIsAnalyticsEnabled}
                            trackColor={{ false: "#767577", true: "#2E7D32" }}
                            thumbColor={isAnalyticsEnabled ? "#FFF" : "#f4f3f4"}
                        />
                    </View>

                    <View style={styles.preferenceItem}>
                        <View style={styles.preferenceLeft}>
                            <View style={[styles.preferenceIcon, { backgroundColor: '#FFF3E0' }]}>
                                <Ionicons name="moon-outline" size={22} color="#EF6C00" />
                            </View>
                            <View>
                                <Text style={styles.preferenceLabel}>Dark Mode</Text>
                                <Text style={styles.preferenceSubtext}>Switch to dark theme</Text>
                            </View>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={setIsDarkMode}
                            trackColor={{ false: "#767577", true: "#EF6C00" }}
                            thumbColor={isDarkMode ? "#FFF" : "#f4f3f4"}
                        />
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.actionsContainer}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.backupButton]}
                        onPress={() => console.log('Backup initiated')}
                    >
                        <Ionicons name="cloud-upload-outline" size={20} color="#1565C0" />
                        <Text style={[styles.actionButtonText, { color: '#1565C0' }]}>Backup System</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.logoutButton]}
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                        <Text style={[styles.actionButtonText, { color: '#FF3B30' }]}>Log Out</Text>
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
        marginBottom: 24,
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
        fontSize: 20,
        color: '#1A1A1A',
    },
    notificationButton: {
        position: 'relative',
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
    notificationBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFF',
    },
    notificationBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontFamily: 'Poppins_600SemiBold',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    adminBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#1565C0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 22,
        color: '#1A1A1A',
        marginBottom: 4,
    },
    userEmail: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        marginBottom: 4,
    },
    userRole: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 12,
        color: '#1565C0',
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    quickStatsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginHorizontal: 24,
        marginBottom: 24,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 20,
        color: '#1A1A1A',
        marginBottom: 4,
    },
    statLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
        textAlign: 'center',
    },
    overviewCard: {
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
    overviewGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    overviewItem: {
        width: '47%',
        backgroundColor: '#FAFAFA',
        padding: 16,
        borderRadius: 16,
    },
    overviewItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    overviewIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overviewLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#757575',
    },
    overviewValue: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 24,
        color: '#1A1A1A',
        marginBottom: 4,
    },
    overviewSubtext: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 10,
        color: '#9E9E9E',
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
        marginBottom: 16,
    },
    adminMenuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginHorizontal: 24,
        marginBottom: 24,
    },
    adminMenuItem: {
        width: '31%',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    adminMenuIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    adminMenuLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#1A1A1A',
        textAlign: 'center',
    },
    activitiesCard: {
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
    activitiesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    activitiesList: {
        gap: 12,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#1A1A1A',
        marginBottom: 2,
    },
    activityTime: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 11,
        color: '#9E9E9E',
    },
    preferencesCard: {
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
    preferenceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    preferenceLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    preferenceIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    preferenceLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 15,
        color: '#1A1A1A',
        marginBottom: 2,
    },
    preferenceSubtext: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#9E9E9E',
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginHorizontal: 24,
        marginBottom: 20,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
    },
    backupButton: {
        backgroundColor: '#E3F2FD',
    },
    logoutButton: {
        backgroundColor: '#FFEBEE',
    },
    actionButtonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
    },
});