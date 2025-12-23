import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import BottomBar from '@/components/DriverBottomBar';

export default function DriversList() {
    const router = useRouter();
    const { drivers = [] } = useDriverStore();

    // Filter only available and verified drivers
    const availableDrivers = drivers.filter(d => d.available && d.verified);

    const renderDriver = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity
                style={styles.driverCard}
                onPress={() => { }} // Could go to detailed driver profile
                activeOpacity={0.9}
            >
                <View style={styles.driverHeader}>
                    <View style={styles.driverAvatar}>
                        <Ionicons name="person" size={24} color="#555" />
                    </View>
                    <View style={styles.driverInfo}>
                        <Text style={styles.driverName}>{item.name}</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={14} color="#000" />
                            <Text style={styles.ratingText}>{(item.rating || 5.0).toFixed(1)}</Text>
                            <Text style={styles.dotSeparator}>•</Text>
                            <Text style={styles.vehicleText}>{item.vehicleType || 'Truck'}</Text>
                        </View>
                    </View>
                    <View style={styles.statusBadge}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Available</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                    <View style={styles.footerItem}>
                        <Ionicons name="call-outline" size={16} color="#555" />
                        <Text style={styles.footerText}>{item.phone}</Text>
                    </View>
                    <View style={styles.footerItem}>
                        <Ionicons name="cube-outline" size={16} color="#555" />
                        <Text style={styles.footerText}>{item.capacity || '1000'} kg</Text>
                    </View>
                    <View style={styles.footerItem}>
                        <Text style={styles.plateNumber}>{item.plateNumber}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Available Drivers</Text>
                <View style={{ width: 44 }} />
            </View>

            {availableDrivers.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="car-sport-outline" size={48} color="#BDBDBD" />
                    </View>
                    <Text style={styles.emptyTitle}>No Drivers Available</Text>
                    <Text style={styles.emptyText}>
                        There are currently no drivers marked as available in your area.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={availableDrivers}
                    renderItem={renderDriver}
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
        paddingHorizontal: 24,
        paddingBottom: 20,
        paddingTop: 10,
        backgroundColor: '#FFF',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#000',
    },
    listContent: {
        padding: 24,
        paddingBottom: 100,
    },
    driverCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
    },
    driverHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    driverAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    driverInfo: {
        flex: 1,
    },
    driverName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#000',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    ratingText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#000',
        marginLeft: 4,
    },
    dotSeparator: {
        marginHorizontal: 8,
        color: '#BDBDBD',
    },
    vehicleText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#DCFCE7',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#000',
        marginRight: 6,
    },
    statusText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 10,
        color: '#000',
    },
    divider: {
        height: 1,
        backgroundColor: '#F5F5F5',
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    footerText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#555',
    },
    plateNumber: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 12,
        color: '#000',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: -60,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F9F9F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#000',
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

