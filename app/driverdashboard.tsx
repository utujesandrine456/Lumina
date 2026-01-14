import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Switch, Alert } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useDriverStore } from '@/constants/store';
import * as Location from 'expo-location';
import BottomBar from '@/components/DriverBottomBar';
import ProtectedRoute from '@/components/ProtectedRoute';

const { width } = Dimensions.get('window');

export default function DriverDashboard() {
    const router = useRouter();
    const { currentUser, setDriverAvailability, updateDriverLocation, getDriverRequests, updateRequestStatus, drivers } = useDriverStore();
    const driverData = drivers.find(d => d.id === currentUser?.id);
    const isAvailable = driverData?.available ?? false;
    const relevantRequests = currentUser ? getDriverRequests(currentUser.id) : [];

    useEffect(() => {
        let subscription: Location.LocationSubscription | null = null;
        let isMounted = true;

        const startTracking = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (!isMounted) return;
                if (status !== 'granted') return;

                const sub = await Location.watchPositionAsync(
                    { accuracy: Location.Accuracy.High, distanceInterval: 50 },
                    (loc) => {
                        if (currentUser?.id) {
                            updateDriverLocation(currentUser.id, {
                                latitude: loc.coords.latitude,
                                longitude: loc.coords.longitude
                            });
                        }
                    }
                );

                if (!isMounted) {
                    // Component unmounted while we were waiting for the promise
                    if (sub) {
                        try {
                            sub.remove();
                        } catch (e) {
                            console.warn("Error removing subscription:", e);
                        }
                    }
                    return;
                }

                subscription = sub;
            } catch (error) {
                console.warn("Error starting location tracking:", error);
            }
        };

        if (isAvailable) {
            startTracking();
        }

        return () => {
            isMounted = false;
            if (subscription) {
                try {
                    subscription.remove();
                } catch (e) {
                    console.warn("Error removing subscription:", e);
                }
            }
        };
    }, [isAvailable, currentUser]);

    const handleAcceptRequest = (requestId: string) => {
        Alert.alert(
            "Confirm Job",
            "Do you want to accept this transport request?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Accept",
                    onPress: () => {
                        updateRequestStatus(requestId, 'accepted', currentUser?.id);
                    }
                }
            ]
        );
    };

    const handleToggleAvailability = (val: boolean) => {
        if (currentUser?.id) {
            setDriverAvailability(currentUser.id, val);
        }
    };

    return (
        <ProtectedRoute>
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={styles.avatarContainer}>
                                <Ionicons name="person" size={24} color="#FFF" />
                            </View>
                            <View>
                                <Text style={styles.greeting}>Welcome back,</Text>
                                <Text style={styles.userName}>{currentUser?.name || "Driver"}</Text>
                            </View>
                        </View>
                        <View style={styles.statusPill}>
                            <View style={[styles.statusDot, { backgroundColor: isAvailable ? '#4CAF50' : '#FF5252' }]} />
                            <Text style={styles.statusText}>{isAvailable ? "Online" : "Offline"}</Text>
                        </View>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.iconBox}>
                                <Ionicons name="power" size={24} color="#1A1A1A" />
                            </View>
                            <View style={{ flex: 1, marginLeft: 16 }}>
                                <Text style={styles.cardTitle}>Availability Status</Text>
                                <Text style={styles.cardSubtitle}>Go online to receive jobs</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#767577', true: '#1A1A1A' }}
                                thumbColor={isAvailable ? '#FFFFFF' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={handleToggleAvailability}
                                value={isAvailable}
                            />
                        </View>
                    </Animated.View>

                    <Text style={styles.sectionTitle}>New Requests</Text>
                    <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.listContainer}>
                        {relevantRequests.length > 0 ? (
                            relevantRequests.map((req) => (
                                <View key={req.id} style={styles.jobCard}>
                                    <View style={styles.jobHeader}>
                                        <Text style={styles.cropType}>{req.cropType}</Text>
                                        <Text style={styles.quantity}>{req.quantityKg}kg</Text>
                                    </View>

                                    <View style={styles.routeContainer}>
                                        <View style={styles.routeRow}>
                                            <View style={[styles.dot, { backgroundColor: '#999' }]} />
                                            <Text style={styles.routeText}>{req.pickupLocation}</Text>
                                        </View>
                                        <View style={styles.line} />
                                        <View style={styles.routeRow}>
                                            <View style={[styles.dot, { backgroundColor: '#1A1A1A' }]} />
                                            <Text style={styles.routeText}>{req.destination}</Text>
                                        </View>
                                    </View>

                                    {req.status === 'pending' ? (
                                        <View style={styles.actions}>
                                            <TouchableOpacity
                                                style={styles.acceptButton}
                                                onPress={() => handleAcceptRequest(req.id)}
                                            >
                                                <Text style={styles.buttonText}>Accept Job</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View style={styles.statusBadge}>
                                            <Text style={styles.statusBadgeText}>
                                                {req.status === 'accepted' ? 'In Progress' : req.status}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="car-sport-outline" size={48} color="#E0E0E0" />
                                <Text style={styles.emptyText}>No requests available right now.</Text>
                            </View>
                        )}
                    </Animated.View>

                </ScrollView>

                <BottomBar />
            </SafeAreaView>
        </ProtectedRoute>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 40,
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 32,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F0F0F0',
    },
    greeting: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
    },
    userName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#FAFAFA',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#1A1A1A',
    },
    card: {
        backgroundColor: '#FAFAFA',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        marginBottom: 32,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    cardTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#1A1A1A',
    },
    cardSubtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
        marginBottom: 16,
    },
    listContainer: {
        gap: 16,
    },
    jobCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    cropType: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#1A1A1A',
    },
    quantity: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#1A1A1A',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    routeContainer: {
        marginBottom: 20,
    },
    routeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    line: {
        width: 2,
        height: 16,
        backgroundColor: '#E0E0E0',
        marginLeft: 4,
        marginVertical: 2,
    },
    routeText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#444',
    },
    actions: {
        flexDirection: 'row',
    },
    acceptButton: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#FFF',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    statusBadgeText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#1A1A1A',
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
