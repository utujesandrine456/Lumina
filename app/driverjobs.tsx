import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import { useDriverStore } from '@/constants/store';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'expo-router';
import BottomBar from '@/components/DriverBottomBar';

export default function DriverJobs() {
    const router = useRouter();
    const { requests, drivers, currentUser, updateRequest, addMessage } = useDriverStore();

    const pendingTrips = useMemo(
        () => (requests || []).filter((t: any) => t.status === 'pending' && !t.driverId),
        [requests]
    );

    const currentDriver = drivers.find(d => d.id === currentUser?.id);

    const handleAccept = (tripId: string) => {
        if (!currentDriver) {
            Alert.alert('Driver profile missing', 'Complete your profile before accepting trips.');
            return;
        }

        updateRequest(tripId, {
            driverId: currentDriver.id,
            status: 'accepted',
            priceLocked: true,
            chatOpen: true,
        });

        addMessage({
            id: Date.now().toString(),
            requestId: tripId,
            senderId: currentDriver.id,
            receiverId: 'coop',
            text: 'Driver accepted the job. Let us coordinate pickup.',
            timestamp: Date.now(),
        });
        Alert.alert('Accepted', 'You accepted this transport request.', [
            { text: 'Open Chat', onPress: () => router.push({ pathname: '/chat', params: { tripId } }) },
            { text: 'OK' },
        ]);
    };

    const handleDecline = () => {
        Alert.alert('Declined', 'This job remains available to others.');
    };

    const renderItem = ({ item, index }: { item: any; index: number }) => (
        <Animated.View entering={SlideInRight.delay(150 + index * 50).springify()} style={styles.card}>
            <View style={styles.header}>
                <View style={styles.route}>
                    <Text style={styles.routeText}>{item.pickupLocation}</Text>
                    <Ionicons name="arrow-forward" size={16} color="#000" />
                    <Text style={styles.routeText}>{item.destination}</Text>
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.totalWeight} kg</Text>
                </View>
            </View>

            <View style={styles.metaRow}>
                <Ionicons name="cube-outline" size={18} color="#000" />
                <Text style={styles.metaText}>{item.cropType}</Text>
                <View style={styles.dot} />
                <Ionicons name="cash-outline" size={18} color="#000" />
                <Text style={styles.metaText}>{item.totalPrice?.toFixed(0)} Frw</Text>
            </View>

            <View style={styles.metaRow}>
                <Ionicons name="navigate-outline" size={18} color="#000" />
                <Text style={styles.metaText}>{item.distance?.toFixed(1)} km</Text>
                <View style={styles.dot} />
                <Ionicons name="time-outline" size={18} color="#000" />
                <Text style={styles.metaText}>{new Date(item.pickupDate).toLocaleDateString()}</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.decline} onPress={handleDecline} activeOpacity={0.8}>
                    <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.accept}
                    onPress={() => handleAccept(item.id)}
                    activeOpacity={0.9}
                >
                    <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                    <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );

    return (
        <ProtectedRoute>
            <SafeAreaView style={styles.container}>
                <View style={styles.headerBar}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Available Jobs</Text>
                    <View style={{ width: 24 }} />
                </View>

                {pendingTrips.length === 0 ? (
                    <View style={styles.empty}>
                        <Ionicons name="briefcase-outline" size={64} color="#BDBDBD" />
                        <Text style={styles.emptyText}>No jobs available</Text>
                        <Text style={styles.emptySub}>Check back soon for new requests.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={pendingTrips}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}

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
    headerBar: {
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
    listContent: {
        padding: 20,
        gap: 12,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    route: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1,
    },
    routeText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
        color: '#000',
    },
    badge: {
        backgroundColor: '#000',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 12,
        color: '#FFF',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    metaText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: '#000',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#B5B5B5',
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 12,
    },
    decline: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    declineText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#000',
    },
    accept: {
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
    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        gap: 8,
    },
    emptyText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#000',
    },
    emptySub: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: '#757575',
    },
});

