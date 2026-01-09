import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useDriverStore } from '@/constants/store';
import { useRouter } from 'expo-router';
import BottomBar from '@/components/DriverBottomBar';

export default function DriverRequests() {
    const router = useRouter();
    const { requests, currentUser, updateRequest, drivers } = useDriverStore();
    const [refreshing, setRefreshing] = useState(false);

    const currentDriver = drivers.find(d => d.id === currentUser?.id);

    const driverRequests = useMemo(
        () => (requests || []).filter((r) => r.driverId === currentUser?.id),
        [requests, currentUser?.id]
    );

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    const handleAccept = (requestId: string) => {
        Alert.alert(
            'Accept Request',
            'Do you want to accept this transport request?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Accept',
                    onPress: () => {
                        updateRequest(requestId, {
                            status: 'accepted',
                        });
                        Alert.alert('Success', 'Request accepted successfully!');
                    }
                }
            ]
        );
    };

    const handleReject = (requestId: string) => {
        Alert.alert(
            'Reject Request',
            'Are you sure you want to reject this request?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reject',
                    style: 'destructive',
                    onPress: () => {
                        updateRequest(requestId, {
                            status: 'rejected',
                            driverId: undefined,
                        });
                        Alert.alert('Rejected', 'Request has been rejected.');
                    }
                }
            ]
        );
    };

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
            case 'completed': return 'Completed';
            case 'rejected': return 'Rejected';
            default: return status;
        }
    };

    const renderRequest = ({ item, index }: { item: any; index: number }) => {
        const statusColor = getStatusColor(item.status);
        const isPending = item.status === 'pending';

        return (
            <Animated.View entering={FadeInDown.delay(index * 50).springify()} style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.dateContainer}>
                        <Ionicons name="calendar-outline" size={14} color="#757575" />
                        <Text style={styles.dateText}>
                            {new Date(item.bookingTime || item.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
                        <Text style={[styles.statusText, { color: statusColor }]}>
                            {getStatusText(item.status)}
                        </Text>
                    </View>
                </View>

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

                <View style={styles.detailsRow}>
                    <View style={styles.detailBadge}>
                        <Ionicons name="cube-outline" size={14} color="#000" />
                        <Text style={styles.detailText}>{item.cropType}</Text>
                    </View>
                    <View style={styles.detailBadge}>
                        <Ionicons name="scale-outline" size={14} color="#000" />
                        <Text style={styles.detailText}>{item.totalWeight || item.quantity} kg</Text>
                    </View>
                </View>

                {isPending && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.rejectButton}
                            onPress={() => handleReject(item.id)}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="close-circle-outline" size={20} color="#F44336" />
                            <Text style={styles.rejectText}>Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.acceptButton}
                            onPress={() => handleAccept(item.id)}
                            activeOpacity={0.9}
                        >
                            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                            <Text style={styles.acceptText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.title}>My Requests</Text>
                    <Text style={styles.subtitle}>{driverRequests.length} requests</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {driverRequests.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="document-text-outline" size={40} color="#BDBDBD" />
                    </View>
                    <Text style={styles.emptyTitle}>No Requests Yet</Text>
                    <Text style={styles.emptyText}>You haven't received any transport requests yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={driverRequests}
                    renderItem={renderRequest}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}

            <BottomBar />
        </SafeAreaView>
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
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#1A1A1A',
    },
    subtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#9E9E9E',
    },
    listContent: {
        padding: 24,
        gap: 16,
    },
    card: {
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
    dateText: {
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
    detailsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    detailBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 6,
    },
    detailText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 13,
        color: '#1A1A1A',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 4,
    },
    rejectButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#F44336',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    rejectText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#F44336',
    },
    acceptButton: {
        flex: 1,
        backgroundColor: '#000',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    acceptText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#FFF',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
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
