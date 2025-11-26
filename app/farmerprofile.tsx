import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Switch, Platform } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import BottomBar from '@/components/BottomBar';

export default function Profile() {
    const router = useRouter();
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(true);

    const menuItems = [
        { icon: "person-outline", label: "Edit Profile", route: "/edit-profile" },
        { icon: "card-outline", label: "Payment Methods", route: "/payment" },
        { icon: "time-outline", label: "History", route: "/history" },
        { icon: "settings-outline", label: "Settings", route: "/settings" },
        { icon: "help-circle-outline", label: "Help & Support", route: "/support" },
        { icon: "swap-horizontal-outline", label: "Switch Role", route: "/role" },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Profile</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={require('@/assets/images/Farmer.jpg')}
                                style={styles.avatar}
                            />
                            <TouchableOpacity style={styles.editAvatarButton}>
                                <Ionicons name="camera" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.userName}>John Doe</Text>
                        <Text style={styles.userRole}>Farmer</Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>24</Text>
                        <Text style={styles.statLabel}>Orders</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Reviews</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>4.8</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                </Animated.View>

                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <Animated.View key={index} entering={FadeInDown.delay(300 + (index * 100)).springify()}>
                            <TouchableOpacity style={styles.menuItem}>
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
                    <TouchableOpacity style={styles.logoutButton}>
                        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
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
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#FFF',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
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
        fontSize: 14,
        color: '#757575',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        marginHorizontal: 24,
        paddingVertical: 16,
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
        fontSize: 18,
        color: '#1A1A1A',
    },
    statLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#9E9E9E',
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#EEEEEE',
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
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 15,
        color: '#1A1A1A',
    },
    preferencesContainer: {
        marginHorizontal: 24,
        marginBottom: 24,
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#1A1A1A',
        marginBottom: 16,
        marginLeft: 8,
    },
    preferenceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
    },
    logoutText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#FF3B30',
    },
});