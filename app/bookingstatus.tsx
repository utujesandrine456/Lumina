import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { formatDateTime } from '@/utils/DateUtils';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function BookingStatus() {
    const router = useRouter();
    const { tripId } = useLocalSearchParams<{ tripId: string }>();
    const requests = useDriverStore((s) => s.requests);
    const trip = requests.find(r => r.id === tripId);
    const drivers = useDriverStore(s => s.drivers);
    const tripDriver = trip?.driverId ? drivers.find(d => d.id === trip.driverId) : undefined;
    const progress = useSharedValue(0);

    useEffect(() => {
        if (trip) {
            let targetProgress = 0;
            if (trip.status === 'pending') targetProgress = 0.25;
            else if (trip.status === 'accepted') targetProgress = 0.5;
            else if (trip.status === 'in-progress') targetProgress = 0.75;
            else if (trip.status === 'completed') targetProgress = 1;

            progress.value = withTiming(targetProgress, { duration: 1000 });
        }
    }, [trip?.status]);

    const animatedProgressStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value * 100}%`,
        };
    });

    if (!trip) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Trip Not Found</Text>
                    <View style={{ width: 24 }} />
                </View>
            </SafeAreaView>
        );
    }

    const getStatusInfo = () => {
        switch (trip.status) {
            case 'pending':
                return {
                    label: 'Pending Driver',
                    icon: 'time-outline',
                    color: '#757575',
                    description: 'Awaiting a driver to accept the booking',
                };
            case 'accepted':
                return {
                    label: 'Driver Accepted',
                    icon: 'hand-left-outline',
                    color: '#000',
                    description: 'Driver accepted. Price is locked. Coordinate pickup.',
                };
            case 'in-progress':
                return {
                    label: 'In Transit',
                    icon: 'car-outline',
                    color: '#000',
                    description: 'Cargo is being transported to destination',
                };
            case 'completed':
                return {
                    label: 'Delivered',
                    icon: 'checkmark-circle',
                    color: '#000',
                    description: 'Cargo has been delivered successfully',
                };
            default:
                return {
                    label: 'Unknown',
                    icon: 'help-circle-outline',
                    color: '#757575',
                    description: '',
                };
        }
    };

    const statusInfo = getStatusInfo();

    const handleAction = () => {
        if (trip.status === 'accepted') {
            router.push({ pathname: '/pickupconfirmation', params: { tripId: trip.id } });
        } else if (trip.status === 'in-progress') {
            router.push({ pathname: '/delivery', params: { tripId: trip.id } });
        } else if (trip.status === 'completed' && !trip.rating) {
            router.push({ pathname: '/ratedriver', params: { tripId: trip.id } });
        }
    };

    return (
        <ProtectedRoute>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Booking Status</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.content}>
                        <View style={styles.tripCard}>
                            <View style={styles.routeContainer}>
                                <View style={styles.routePoint}>
                                    <View style={styles.routeDot} />
                                    <Text style={styles.routeLabel}>Pickup</Text>
                                    <Text style={styles.routeValue}>{trip.pickupLocation}</Text>
                                </View>
                                <View style={styles.routeLine} />
                                <View style={styles.routePoint}>
                                    <View style={[styles.routeDot, styles.routeDotActive]} />
                                    <Text style={styles.routeLabel}>Destination</Text>
                                    <Text style={styles.routeValue}>{trip.destination}</Text>
                                </View>
                            </View>

                            <View style={styles.tripDetails}>
                                <View style={styles.detailRow}>
                                    <Ionicons name="cube-outline" size={20} color="#000" />
                                    <Text style={styles.detailText}>{trip.cropType}</Text>
                                    <Text style={styles.detailValue}>{trip.totalWeight} kg</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Ionicons name="location-outline" size={20} color="#000" />
                                    <Text style={styles.detailText}>Distance</Text>
                                    <Text style={styles.detailValue}>{trip.distance?.toFixed(2)} km</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Ionicons name="cash-outline" size={20} color="#000" />
                                    <Text style={styles.detailText}>Total Price</Text>
                                    <Text style={styles.detailValue}>{trip.totalPrice?.toFixed(2)} Frw</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.statusContainer}>
                            <View style={styles.statusHeader}>
                                <Ionicons name={statusInfo.icon as any} size={32} color={statusInfo.color} />
                                <Text style={[styles.statusLabel, { color: statusInfo.color }]}>
                                    {statusInfo.label}
                                </Text>
                            </View>
                            <Text style={styles.statusDescription}>{statusInfo.description}</Text>

                            {/* Animated Progress Bar */}
                            <View style={styles.progressBarContainer}>
                                <View style={styles.progressBarBackground}>
                                    <Animated.View style={[styles.progressBarFill, animatedProgressStyle]} />
                                </View>
                                <View style={styles.progressSteps}>
                                    <View style={[styles.progressStep, trip.status !== 'pending' && styles.progressStepCompleted]}>
                                        <View style={[styles.progressStepDot, trip.status !== 'pending' && styles.progressStepDotCompleted]} />
                                        <Text style={styles.progressStepLabel}>Pending</Text>
                                    </View>
                                    <View style={[styles.progressStep, (trip.status === 'accepted' || trip.status === 'in-progress' || trip.status === 'completed') && styles.progressStepCompleted]}>
                                        <View style={[styles.progressStepDot, (trip.status === 'accepted' || trip.status === 'in-progress' || trip.status === 'completed') && styles.progressStepDotCompleted]} />
                                        <Text style={styles.progressStepLabel}>Accepted</Text>
                                    </View>
                                    <View style={[styles.progressStep, (trip.status === 'in-progress' || trip.status === 'completed') && styles.progressStepCompleted]}>
                                        <View style={[styles.progressStepDot, (trip.status === 'in-progress' || trip.status === 'completed') && styles.progressStepDotCompleted]} />
                                        <Text style={styles.progressStepLabel}>In Transit</Text>
                                    </View>
                                    <View style={[styles.progressStep, trip.status === 'completed' && styles.progressStepCompleted]}>
                                        <View style={[styles.progressStepDot, trip.status === 'completed' && styles.progressStepDotCompleted]} />
                                        <Text style={styles.progressStepLabel}>Delivered</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {trip.driver && (
                            <View style={styles.driverCard}>
                                <Ionicons name="person-circle" size={48} color="#000" />
                                <View style={styles.driverInfo}>
                                    <Text style={styles.driverName}>{trip.driver.name}</Text>
                                    <Text style={styles.driverPlate}>{trip.driver.plateNumber}</Text>
                                    <View style={styles.ratingRow}>
                                        <Ionicons name="star" size={16} color="#000" />
                                        <Text style={styles.rating}>{trip.driver.rating?.toFixed(1)}</Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {trip.pickupTimestamp && (
                            <View style={styles.timestampCard}>
                                <Text style={styles.timestampLabel}>Pickup Confirmed</Text>
                                <Text style={styles.timestampValue}>
                                    {formatDateTime(new Date(trip.pickupTimestamp))}
                                </Text>
                                {trip.pickupWeight && (
                                    <Text style={styles.timestampWeight}>
                                        Weight: {trip.pickupWeight} kg
                                    </Text>
                                )}
                            </View>
                        )}

                        {trip.deliveryTimestamp && (
                            <View style={styles.timestampCard}>
                                <Text style={styles.timestampLabel}>Delivery Confirmed</Text>
                                <Text style={styles.timestampValue}>
                                    {formatDateTime(new Date(trip.deliveryTimestamp))}
                                </Text>
                                {trip.deliveryWeight && (
                                    <Text style={styles.timestampWeight}>
                                        Received: {trip.deliveryWeight} kg
                                    </Text>
                                )}
                            </View>
                        )}


                        {(trip.status === 'accepted' || trip.status === 'in-progress') && (
                            <TouchableOpacity style={styles.actionButton} onPress={handleAction}>
                                <Text style={styles.actionButtonText}>
                                    {trip.status === 'accepted' ? 'Confirm Pickup' : 'Confirm Delivery'}
                                </Text>
                                <Ionicons name="arrow-forward" size={20} color="#FFF" />
                            </TouchableOpacity>
                        )}

                        {trip.chatOpen && (
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#000' }]}
                                onPress={() => router.push({ pathname: '/chat', params: { tripId: trip.id } })}
                            >
                                <Text style={[styles.actionButtonText, { color: '#000' }]}>
                                    Open Chat
                                </Text>
                                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#000" />
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                </ScrollView>
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
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#000',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    tripCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    routeContainer: {
        marginBottom: 20,
    },
    routePoint: {
        marginBottom: 8,
    },
    routeDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: '#FFF',
        marginBottom: 8,
    },
    routeDotActive: {
        backgroundColor: '#000',
    },
    routeLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#757575',
        marginBottom: 4,
    },
    routeValue: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#000',
    },
    routeLine: {
        width: 2,
        height: 20,
        backgroundColor: '#E0E0E0',
        marginLeft: 5,
        marginBottom: 8,
    },
    tripDetails: {
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    detailText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        flex: 1,
    },
    detailValue: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#000',
    },
    statusContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    statusLabel: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
    },
    statusDescription: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        marginBottom: 20,
    },
    progressBarContainer: {
        marginTop: 8,
    },
    progressBarBackground: {
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        marginBottom: 16,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#000',
        borderRadius: 2,
    },
    progressSteps: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressStep: {
        alignItems: 'center',
        flex: 1,
    },
    progressStepCompleted: {
        opacity: 1,
    },
    progressStepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
        marginBottom: 4,
    },
    progressStepDotCompleted: {
        backgroundColor: '#000',
    },
    progressStepLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 10,
        color: '#757575',
    },
    driverCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        gap: 12,
    },
    driverInfo: {
        flex: 1,
    },
    driverName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#000',
        marginBottom: 4,
    },
    driverPlate: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rating: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#000',
    },
    timestampCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    timestampLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#757575',
        marginBottom: 4,
    },
    timestampValue: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#000',
        marginBottom: 4,
    },
    timestampWeight: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
    },
    actionButton: {
        backgroundColor: '#000',
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
});

