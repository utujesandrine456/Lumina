import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList, Linking, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import ProtectedRoute from '@/components/ProtectedRoute';
import FarmerBottomBar from '@/components/FarmerBottomBar';

export default function Trips() {
    const router = useRouter();
    const { requests, drivers } = useDriverStore();
    const [filter, setFilter] = useState<'all' | 'pending' | 'ongoing' | 'completed'>('all');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        // Simulate refresh - normally you'd refetch data here
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    const handleCall = (phoneNumber: string) => {
        Linking.openURL(`tel:${phoneNumber}`).catch(() => {
            Alert.alert('Error', 'Unable to open dialer');
        });
    };

    const handleMessage = (tripId: string) => {
        router.push({ pathname: '/chat', params: { tripId } });
    };

    const filteredTrips = (requests || []).filter(trip => {
        if (filter === 'all') return true;
        if (filter === 'pending') return trip.status === 'pending';
        if (filter === 'ongoing') return trip.status === 'accepted' || trip.status === 'in-progress';
        if (filter === 'completed') return trip.status === 'completed';
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#FF9800';
            case 'accepted': return '#2196F3';
            case 'in-progress': return '#2196F3';
            case 'completed': return '#4CAF50';
            case 'rejected': return '#F44336';
            default: return '#757575';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Pending';
            case 'accepted': return 'Accepted';
            case 'in-progress': return 'In Transit';
            case 'completed': return 'Delivered';
            case 'rejected': return 'Cancelled';
            default: return status;
        }
    };

    const renderTrip = ({ item }: { item: any }) => {
        const tripDriver = drivers.find(d => d.id === item.driverId);
        const farmerCount = item.farmers?.length || 0;
        const statusColor = getStatusColor(item.status);

        return (
            <TouchableOpacity
                style={styles.tripCard}
                activeOpacity={0.9}
                onPress={() => {
                    if (item.status === 'completed' && !item.rating) {
                        router.push({ pathname: '/ratedriver', params: { tripId: item.id } });
                    } else {
                        router.push({ pathname: '/bookingstatus', params: { tripId: item.id } });
                    }
                }}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.dateContainer}>
                        <Ionicons name="calendar-outline" size={14} color="#757575" />
                        <Text style={styles.tripDate}>
                            {new Date(item.bookingTime || item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
                        <Text style={[styles.statusText, { color: statusColor }]}>
                            {getStatusText(item.status)}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.routeContainer}>
                    <View style={styles.routeItem}>
                        <View style={[styles.routeDot, { borderColor: '#757575' }]} />
                        <View style={styles.routeContent}>
                            <Text style={styles.routeLabel}>Pickup</Text>
                            <Text style={styles.routeAddress} numberOfLines={1}>{item.pickupLocation}</Text>
                        </View>
                    </View>
                    <View style={styles.routeConnector} />
                    <View style={styles.routeItem}>
                        <View style={[styles.routeDot, { borderColor: '#000', backgroundColor: '#000' }]} />
                        <View style={styles.routeContent}>
                            <Text style={styles.routeLabel}>Destination</Text>
                            <Text style={styles.routeAddress} numberOfLines={1}>{item.destination}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statBadge}>
                        <Ionicons name="people-outline" size={14} color="#000" />
                        <Text style={styles.statValue}>{farmerCount} Farmers</Text>
                    </View>
                    <View style={styles.statBadge}>
                        <Ionicons name="scale-outline" size={14} color="#000" />
                        <Text style={styles.statValue}>{item.totalWeight} kg</Text>
                    </View>
                </View>

                {tripDriver && (
                    <View style={styles.driverRow}>
                        <View style={styles.driverInfo}>
                            <View style={styles.driverAvatar}>
                                <Text style={styles.driverInitials}>{tripDriver.fullName.charAt(0)}</Text>
                            </View>
                            <View>
                                <Text style={styles.driverLabel}>Assigned Driver</Text>
                                <Text style={styles.driverName}>{tripDriver.fullName}</Text>
                            </View>
                        </View>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleMessage(item.id)}
                            >
                                <Ionicons name="chatbubble-outline" size={18} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.callButton]}
                                onPress={() => handleCall(tripDriver.phone)}
                            >
                                <Ionicons name="call" size={18} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <ProtectedRoute>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.title}>Trips</Text>
                    </View>
                </View>

                <View style={styles.filterContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                        {['all', 'pending', 'ongoing', 'completed'].map((f) => (
                            <TouchableOpacity
                                key={f}
                                style={[styles.filterChip, filter === f && styles.filterChipActive]}
                                onPress={() => setFilter(f as any)}
                            >
                                <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {filteredTrips.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="map" size={40} color="#000" />
                        </View>
                        <Text style={styles.emptyTitle}>No trips found</Text>
                        <Text style={styles.emptyText}>You haven't made any transport requests in this category yet.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredTrips}
                        renderItem={renderTrip}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                )}

                <FarmerBottomBar />
            </SafeAreaView>
        </ProtectedRoute>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 20,
        backgroundColor: '#FFF',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerTitleContainer: {
        flex: 1,
    },
    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        color: '#1A1A1A',
        lineHeight: 30,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: '#9E9E9E',
    },
    filterContainer: {
        backgroundColor: '#FFF',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    filterScroll: {
        paddingHorizontal: 10,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    filterChipActive: {
        backgroundColor: '#1A1A1A',
        borderColor: '#1A1A1A',
    },
    filterText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 13,
        color: '#757575',
    },
    filterTextActive: {
        color: '#FFF',
    },
    listContent: {
        padding: 24,
        gap: 16,
    },
    tripCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    tripDate: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 13,
        color: '#757575',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    divider: {
        height: 1,
        backgroundColor: '#F5F5F5',
        marginBottom: 16,
    },
    routeContainer: {
        marginBottom: 16,
    },
    routeItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    routeConnector: {
        height: 16,
        width: 2,
        backgroundColor: '#E0E0E0',
        marginLeft: 6,
        marginVertical: 4,
    },
    routeDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        backgroundColor: '#FFF',
        marginRight: 12,
    },
    routeContent: {
        flex: 1,
    },
    routeLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 11,
        color: '#9E9E9E',
        marginBottom: 2,
    },
    routeAddress: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#1A1A1A',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 4,
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 6,
    },
    statValue: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 13,
        color: '#1A1A1A',
    },
    driverRow: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    driverAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    driverInitials: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#FFF',
    },
    driverLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 11,
        color: '#9E9E9E',
    },
    driverName: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#1A1A1A',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    callButton: {
        backgroundColor: '#000',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginTop: 40,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#1A1A1A',
        marginBottom: 8,
    },
    emptyText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        textAlign: 'center',
        lineHeight: 22,
    },
});

