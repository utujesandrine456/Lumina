import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import { formatDateTime } from '@/utils/DateUtils';
import { updateTrip } from '@/constants/store';


export default function DisputeResolution() {
    const router = useRouter();
    const { tripId } = useLocalSearchParams<{ tripId?: string }>();
    const { trips, updateTrip } = useDriverStore();
    
    const disputedTrips = tripId 
        ? trips.filter(t => t.id === tripId && t.disputed)
        : trips.filter(t => t.disputed);

    const resolveDispute = (tripId: string, resolution: 'resolved' | 'rejected') => {
        if (resolution === 'resolved') {
            updateTrip(tripId, {
                disputed: false,
                disputeReason: undefined,
            });
            Alert.alert('Success', 'Dispute resolved. Payment will be released.');
        } else {
            updateTrip(tripId, {
                disputed: false,
                disputeReason: 'Dispute rejected by admin',
            });
            Alert.alert('Dispute Rejected', 'The dispute has been rejected.');
        }
        router.back();
    };

    const flagDispute = (tripId: string) => {
        Alert.prompt(
            'Flag Dispute',
            'Enter reason for dispute:',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Flag',
                    onPress: (reason) => {
                        if (reason) {
                            updateTrip(tripId, {
                                disputed: true,
                                disputeReason: reason,
                            });
                            Alert.alert('Dispute Flagged', 'This trip has been flagged for admin review.');
                        }
                    },
                },
            ],
            'plain-text'
        );
    };

    const renderTrip = (trip: any) => {
        const weightDifference = trip.pickupWeight && trip.deliveryWeight
            ? Math.abs(trip.pickupWeight - trip.deliveryWeight)
            : null;
        const weightVariance = weightDifference && trip.pickupWeight
            ? (weightDifference / trip.pickupWeight) * 100
            : null;

        return (
            <Animated.View 
                key={trip.id} 
                entering={SlideInRight.springify()} 
                style={styles.disputeCard}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.tripId}>Trip #{trip.id.slice(-6)}</Text>
                    <View style={styles.disputedBadge}>
                        <Text style={styles.disputedText}>DISPUTED</Text>
                    </View>
                </View>

                <View style={styles.routeInfo}>
                    <Text style={styles.routeText}>
                        {trip.pickupLocation} → {trip.destination}
                    </Text>
                    <Text style={styles.tripDate}>
                        {formatDateTime(trip.bookingTime)}
                    </Text>
                </View>

                {trip.disputeReason && (
                    <View style={styles.reasonBox}>
                        <Text style={styles.reasonLabel}>Dispute Reason:</Text>
                        <Text style={styles.reasonText}>{trip.disputeReason}</Text>
                    </View>
                )}

                <View style={styles.comparisonSection}>
                    <Text style={styles.sectionTitle}>Weight Comparison</Text>
                    <View style={styles.comparisonRow}>
                        <View style={styles.comparisonItem}>
                            <Text style={styles.comparisonLabel}>Expected</Text>
                            <Text style={styles.comparisonValue}>{trip.totalWeight} kg</Text>
                        </View>
                        <View style={styles.comparisonItem}>
                            <Text style={styles.comparisonLabel}>Picked Up</Text>
                            <Text style={styles.comparisonValue}>
                                {trip.pickupWeight || 'N/A'} kg
                            </Text>
                            {trip.pickupTimestamp && (
                                <Text style={styles.timestamp}>
                                    {formatDateTime(trip.pickupTimestamp)}
                                </Text>
                            )}
                        </View>
                        <View style={styles.comparisonItem}>
                            <Text style={styles.comparisonLabel}>Delivered</Text>
                            <Text style={[styles.comparisonValue, weightVariance && weightVariance > 5 && styles.warningValue]}>
                                {trip.deliveryWeight || 'N/A'} kg
                            </Text>
                            {trip.deliveryTimestamp && (
                                <Text style={styles.timestamp}>
                                    {formatDateTime(trip.deliveryTimestamp)}
                                </Text>
                            )}
                        </View>
                    </View>
                    {weightDifference && weightVariance && (
                        <View style={styles.varianceBox}>
                            <Text style={styles.varianceText}>
                                Difference: {weightDifference.toFixed(2)} kg ({weightVariance.toFixed(1)}%)
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.photosSection}>
                    <Text style={styles.sectionTitle}>Evidence Photos</Text>
                    <View style={styles.photosRow}>
                        {trip.pickupPhoto && (
                            <View style={styles.photoContainer}>
                                <Image source={{ uri: trip.pickupPhoto }} style={styles.photo} />
                                <Text style={styles.photoLabel}>Pickup</Text>
                            </View>
                        )}
                        {trip.deliveryPhoto && (
                            <View style={styles.photoContainer}>
                                <Image source={{ uri: trip.deliveryPhoto }} style={styles.photo} />
                                <Text style={styles.photoLabel}>Delivery</Text>
                            </View>
                        )}
                    </View>
                </View>

                {trip.driver && (
                    <View style={styles.driverInfo}>
                        <Ionicons name="person-circle" size={32} color="#000" />
                        <View style={styles.driverDetails}>
                            <Text style={styles.driverName}>{trip.driver.name}</Text>
                            <Text style={styles.driverPlate}>{trip.driver.plateNumber}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.resolveButton]}
                        onPress={() => resolveDispute(trip.id, 'resolved')}
                    >
                        <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                        <Text style={styles.actionButtonText}>Resolve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.rejectButton]}
                        onPress={() => resolveDispute(trip.id, 'rejected')}
                    >
                        <Ionicons name="close-circle" size={20} color="#FFF" />
                        <Text style={styles.actionButtonText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Dispute Resolution</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {disputedTrips.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="checkmark-circle-outline" size={64} color="#BDBDBD" />
                        <Text style={styles.emptyText}>No disputes to resolve</Text>
                    </View>
                ) : (
                    disputedTrips.map(trip => renderTrip(trip))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
    scrollContent: {
        padding: 20,
    },
    disputeCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#000',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    tripId: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#000',
    },
    disputedBadge: {
        backgroundColor: '#000',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    disputedText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 10,
        color: '#FFF',
        letterSpacing: 1,
    },
    routeInfo: {
        marginBottom: 16,
    },
    routeText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#000',
        marginBottom: 4,
    },
    tripDate: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
    },
    reasonBox: {
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    reasonLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#757575',
        marginBottom: 4,
    },
    reasonText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#000',
    },
    comparisonSection: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#000',
        marginBottom: 12,
    },
    comparisonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    comparisonItem: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    comparisonLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 11,
        color: '#757575',
        marginBottom: 4,
    },
    comparisonValue: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#000',
        marginBottom: 4,
    },
    warningValue: {
        color: '#000',
    },
    timestamp: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 9,
        color: '#757575',
    },
    varianceBox: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#F5F5F5',
        borderRadius: 6,
    },
    varianceText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#000',
        textAlign: 'center',
    },
    photosSection: {
        marginBottom: 16,
    },
    photosRow: {
        flexDirection: 'row',
        gap: 12,
    },
    photoContainer: {
        flex: 1,
    },
    photo: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        marginBottom: 4,
    },
    photoLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 11,
        color: '#757575',
        textAlign: 'center',
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        marginBottom: 16,
    },
    driverDetails: {
        flex: 1,
    },
    driverName: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#000',
        marginBottom: 2,
    },
    driverPlate: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    resolveButton: {
        backgroundColor: '#000',
    },
    rejectButton: {
        backgroundColor: '#757575',
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#757575',
        marginTop: 16,
    },
});



