import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import DriverBottomBar from '@/components/DriverBottomBar';
import CooperativeBottomBar from '@/components/CooperativeBottomBar';
import { useDriverStore } from '@/constants/store';

export default function Profile() {
    const router = useRouter();
    const { currentUser, drivers, updateDriver, cooperatives } = useDriverStore();
    const isDriver = currentUser?.role === 'driver';
    const isCoop = currentUser?.role === 'cooperative';
    const driver = useMemo(() => isDriver ? drivers.find(d => d.id === currentUser?.id) : null, [drivers, currentUser, isDriver]);
    const [availability, setAvailability] = useState(driver?.available ?? true);
    const coop = useMemo(() => isCoop ? cooperatives.find(c => c.id === currentUser?.id || c.id === currentUser?.cooperativeId) : null, [cooperatives, currentUser, isCoop]);

    const toggleAvailability = () => {
        if (!isDriver || !driver) return;
        const next = !availability;
        setAvailability(next);
        updateDriver(driver.id, { available: next });
    };

    if (!currentUser) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
                <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 16, color: '#999' }}>No user logged in</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>My Profile</Text>
                </View>
                <View style={styles.placeholderButton} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.card}>
                    <View style={styles.avatarRow}>
                        <View style={styles.avatarContainer}>
                            <Ionicons name={isCoop ? "business" : "person"} size={40} color="#1A1A1A" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.name}>{isCoop ? coop?.name : currentUser.name}</Text>
                            <Text style={styles.sub}>{isCoop ? 'Cooperative Account' : driver?.plateNumber || 'ID: ' + currentUser.id.slice(0, 6)}</Text>
                            <Text style={styles.sub}>{currentUser.phone}</Text>
                        </View>
                        {isDriver && (
                            <View style={styles.availabilityPill}>
                                <View style={[styles.dot, { backgroundColor: availability ? '#4CAF50' : '#F44336' }]} />
                                <Text style={styles.pillText}>{availability ? 'Online' : 'Offline'}</Text>
                            </View>
                        )}
                    </View>

                    {isDriver && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.statsGrid}>
                                <View style={styles.statItem}>
                                    <Ionicons name="car-outline" size={20} color="#757575" />
                                    <Text style={styles.statText}>{driver?.vehicleType || 'Truck'}</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Ionicons name="cube-outline" size={20} color="#757575" />
                                    <Text style={styles.statText}>{driver?.capacity || 'N/A'} kg</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Ionicons name="star-outline" size={20} color="#757575" />
                                    <Text style={styles.statText}>{(driver?.rating || 4.9).toFixed(1)}</Text>
                                </View>
                            </View>
                        </>
                    )}

                    {isCoop && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Officer Name:</Text>
                                <Text style={styles.infoValue}>{coop?.officerName || currentUser.name}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Location:</Text>
                                <Text style={styles.infoValue}>{coop?.location || 'GPS not set'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Farmers:</Text>
                                <Text style={styles.infoValue}>{coop?.farmers.length || 0}</Text>
                            </View>
                        </>
                    )}
                </Animated.View>

                {isDriver && (
                    <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.actionCard}>
                        <View style={styles.rowBetween}>
                            <View>
                                <Text style={styles.actionTitle}>Job Availability</Text>
                                <Text style={styles.actionSub}>Receive new requests</Text>
                            </View>
                            <Switch
                                value={availability}
                                onValueChange={toggleAvailability}
                                trackColor={{ false: '#E0E0E0', true: '#1A1A1A' }}
                                thumbColor={'#FFF'}
                            />
                        </View>
                    </Animated.View>
                )}

                <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => { /* Edit Profile */ }}>
                        <View style={styles.menuIconInfo}>
                            <Ionicons name="create-outline" size={22} color="#1A1A1A" />
                            <Text style={styles.menuText}>Edit Profile</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconInfo}>
                            <Ionicons name="settings-outline" size={22} color="#1A1A1A" />
                            <Text style={styles.menuText}>Settings</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => router.replace('/login')}>
                        <View style={styles.menuIconInfo}>
                            <Ionicons name="log-out-outline" size={22} color="#FF5252" />
                            <Text style={[styles.menuText, { color: '#FF5252' }]}>Log Out</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>

            </ScrollView>
            {isDriver ? <DriverBottomBar /> : <CooperativeBottomBar />}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 100,
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
        zIndex: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    placeholderButton: {
        width: 44,
    },
    titleContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
    },
    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
        letterSpacing: 0.5,
    },
    card: {
        marginTop: 24,
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 3,
    },
    avatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatarContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    name: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
    },
    sub: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: '#757575',
    },
    availabilityPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    pillText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 11,
        color: '#1A1A1A',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 13,
        color: '#444',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
    },
    infoValue: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#1A1A1A',
    },
    actionCard: {
        marginTop: 16,
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
        color: '#1A1A1A',
    },
    actionSub: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#999',
    },
    menuContainer: {
        marginTop: 32,
        gap: 0,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F9F9F9',
    },
    menuIconInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    menuText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 15,
        color: '#1A1A1A',
    },
});