import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
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
    const { currentUser, getCoopFarmers, getCoopRequests, updateCooperative, cooperatives } = useDriverStore();

    const coopId = currentUser?.cooperativeId || currentUser?.id;
    const currentCoop = cooperatives.find(c => c.id === coopId);
    const farmers = coopId ? getCoopFarmers(coopId) : [];
    const requests = coopId ? getCoopRequests(coopId) : [];

    const activeRequests = requests.filter(r => r.status !== 'completed' && r.status !== 'rejected').length;

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'cooperative') {
        }
    }, [currentUser]);

    useEffect(() => {
        (async () => {
            if (!coopId) return;
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            let location = await Location.getCurrentPositionAsync({});
            updateCooperative(coopId, { location: `${location.coords.latitude},${location.coords.longitude}` });
        })();
    }, [coopId]);

    const quickActions = [
        { label: "Register Farmer", icon: "person-add-outline", route: "/registerfarmer" },
        { label: "Create Request", icon: "cube-outline", route: "/createtransportrequest" },
        { label: "View Drivers", icon: "car-outline", route: "/driverslist" },
        { label: "All Farmers", icon: "people-outline", route: "/farmerslist" },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Welcome Back,</Text>
                        <Text style={styles.userName}>{currentUser?.name || 'Officer'}</Text>
                        <Text style={styles.coopName}>{currentCoop?.name}</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
                        <View style={styles.profileIcon}>
                            <Ionicons name="person" size={24} color="#FFF" />
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{farmers.length}</Text>
                        <Text style={styles.statLabel}>Farmers</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{activeRequests}</Text>
                        <Text style={styles.statLabel}>Active Jobs</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{currentCoop?.location ? "Set" : "Off"}</Text>
                        <Text style={styles.statLabel}>GPS Status</Text>
                    </View>
                </Animated.View>

                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    {quickActions.map((action, index) => (
                        <Animated.View key={index} entering={FadeInDown.delay(300 + (index * 50)).springify()} style={styles.actionWrapper}>
                            <TouchableOpacity style={styles.actionButton} onPress={() => router.push(action.route as any)}>
                                <View style={styles.actionIcon}>
                                    <Ionicons name={action.icon as any} size={24} color="#1A1A1A" />
                                </View>
                                <Text style={styles.actionLabel}>{action.label}</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Recent Requests</Text>
                <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.listContainer}>
                    {requests.length > 0 ? (
                        requests.slice(0, 5).map((req) => (
                            <View key={req.id} style={styles.listItem}>
                                <View style={styles.listIcon}>
                                    <Ionicons name="cube" size={20} color="#1A1A1A" />
                                </View>
                                <View style={styles.listContent}>
                                    <Text style={styles.listTitle}>{req.cropType} - {req.quantity}</Text>
                                    <Text style={styles.listSub}>{req.destination}</Text>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: req.status === 'completed' ? '#1A1A1A' : '#F5F5F5' }]}>
                                    <Text style={[styles.statusText, { color: req.status === 'completed' ? '#FFF' : '#000' }]}>
                                        {req.status}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="documents-outline" size={48} color="#E0E0E0" />
                            <Text style={styles.emptyText}>No transport requests yet.</Text>
                        </View>
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
        paddingBottom: 100,
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 32,
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
    coopName: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#999',
        marginTop: 2,
    },
    profileButton: {
        padding: 4,
    },
    profileIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#1A1A1A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    statsCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#1A1A1A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 6,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 24,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    statLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#999',
    },
    statDivider: {
        width: 1,
        height: 32,
        backgroundColor: '#333',
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
        width: (width - 60) / 2,
    },
    actionButton: {
        backgroundColor: '#FAFAFA',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    actionLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#1A1A1A',
    },
    listContainer: {
        gap: 12,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    listIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    listContent: {
        flex: 1,
    },
    listTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#1A1A1A',
        marginBottom: 2,
    },
    listSub: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#999',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 10,
        textTransform: 'capitalize',
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 12,
    },
});
