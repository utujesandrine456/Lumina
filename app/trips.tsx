import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';

export default function Trips() {
    const router = useRouter();
    const { trips } = useDriverStore();
    const [filter, setFilter] = useState<'all' | 'pending' | 'ongoing' | 'completed'>('all');

    const filteredTrips = trips.filter(trip => {
        if (filter === 'all') return true;
        if (filter === 'pending') return trip.status === 'pending';
        if (filter === 'ongoing') return trip.status === 'accepted' || trip.status === 'in-transit';
        if (filter === 'completed') return trip.status === 'delivered';
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#757575';
        case 'accepted': return '#000';
        case 'in-transit': return '#000';
        case 'delivered': return '#000';
            default: return '#757575';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Pending';
        case 'accepted': return 'Accepted';
        case 'in-transit': return 'In Transit';
            case 'delivered': return 'Delivered';
            default: return status;
        }
    };

    const renderTrip = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity
                style={styles.tripCard}
                onPress={() => {
                    if (item.status === 'delivered' && !item.rating) {
                        router.push({ pathname: '/ratedriver', params: { tripId: item.id } });
                    } else {
                        router.push({ pathname: '/bookingstatus', params: { tripId: item.id } });
                    }
                }}
            >
                <View style={styles.tripHeader}>
                    <View style={styles.tripInfo}>
                        <Ionicons name="cube-outline" size={24} color="#000" />
                        <View style={styles.tripDetails}>
                            <Text style={styles.tripId}>Trip #{item.id.slice(-6)}</Text>
                            <Text style={styles.tripDate}>
                                {new Date(item.bookingTime).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                            {getStatusText(item.status)}
                        </Text>
                    </View>
                </View>

                <View style={styles.route}>
                    <View style={styles.routePoint}>
                        <View style={styles.routeDot} />
                        <Text style={styles.routeText}>{item.pickupLocation}</Text>
                    </View>
                    <View style={styles.routeLine} />
                    <View style={styles.routePoint}>
                        <View style={[styles.routeDot, { backgroundColor: '#000' }]} />
                        <Text style={styles.routeText}>{item.destination}</Text>
                    </View>
                </View>

                <View style={styles.tripStats}>
                    <Text style={styles.statText}>{item.farmers.length} farmer{item.farmers.length > 1 ? 's' : ''}</Text>
                    <Text style={styles.statText}>•</Text>
                    <Text style={styles.statText}>{item.totalWeight} kg</Text>
                    {item.driver && (
                        <>
                            <Text style={styles.statText}>•</Text>
                            <Text style={styles.statText}>{item.driver.name}</Text>
                        </>
                    )}
                </View>

                {item.status === 'delivered' && !item.rating && (
                    <TouchableOpacity
                        style={styles.rateButton}
                        onPress={() => router.push({ pathname: '/ratedriver', params: { tripId: item.id } })}
                    >
                        <Text style={styles.rateButtonText}>Rate Driver</Text>
                        <Ionicons name="star-outline" size={16} color="#000" />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Trips</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.filters}>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
                    onPress={() => setFilter('all')}
                >
                    <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'pending' && styles.filterButtonActive]}
                    onPress={() => setFilter('pending')}
                >
                    <Text style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}>Pending</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'ongoing' && styles.filterButtonActive]}
                    onPress={() => setFilter('ongoing')}
                >
                    <Text style={[styles.filterText, filter === 'ongoing' && styles.filterTextActive]}>Ongoing</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
                    onPress={() => setFilter('completed')}
                >
                    <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>Completed</Text>
                </TouchableOpacity>
            </View>

            {filteredTrips.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="map-outline" size={64} color="#BDBDBD" />
                    <Text style={styles.emptyText}>No trips found</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredTrips}
                    renderItem={renderTrip}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#000',
    },
    filters: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    filterButtonActive: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    filterText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#757575',
    },
    filterTextActive: {
        color: '#FFF',
    },
    listContent: {
        padding: 20,
    },
    tripCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    tripHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    tripInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    tripDetails: {
        marginLeft: 12,
    },
    tripId: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#000',
        marginBottom: 4,
    },
    tripDate: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
    },
    route: {
        marginBottom: 16,
    },
    routePoint: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    routeDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: '#FFF',
        marginRight: 12,
    },
    routeLine: {
        width: 2,
        height: 20,
        backgroundColor: '#E0E0E0',
        marginLeft: 5,
        marginBottom: 8,
    },
    routeText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#000',
        flex: 1,
    },
    tripStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    statText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
    },
    rateButton: {
        marginTop: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    rateButtonText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#000',
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

