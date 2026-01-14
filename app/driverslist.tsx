import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import ProtectedRoute from '@/components/ProtectedRoute';
import FarmerBottomBar from '@/components/FarmerBottomBar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import BottomBar from '@/components/DriverBottomBar';

export default function DriversList() {
    const router = useRouter();
    const { drivers = [], currentUser, removeDriver } = useDriverStore();
    const isAdmin = currentUser?.role === 'admindriver';

    const displayedDrivers = useMemo(() => {
        if (isAdmin) return drivers;
        return drivers.filter(d => d.available && d.verified);
    }, [drivers, isAdmin]);


    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            "Delete Driver",
            `Are you sure you want to remove ${name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => removeDriver(id)
                }
            ]
        );
    };

    const renderDriver = ({ item, index }: { item: any, index: number }) => {
        return (
            <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
                <TouchableOpacity
                    style={styles.driverCard}
                    onPress={() => { }}
                    activeOpacity={0.9}
                >
                    <View style={styles.cardHeader}>
                        <View style={styles.driverAvatar}>
                            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                        </View>
                        <View style={styles.headerInfo}>
                            <Text style={styles.driverName}>{item.name}</Text>
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={14} color="#FFD700" />
                                <Text style={styles.ratingText}>{(item.rating || 5.0).toFixed(1)}</Text>
                            </View>
                        </View>
                        <View style={[
                            styles.statusBadge,
                            item.available ? styles.statusOnline : styles.statusOffline
                        ]}>
                            <View style={[
                                styles.statusDot,
                                item.available ? { backgroundColor: '#22C55E' } : { backgroundColor: '#EF4444' }
                            ]} />
                            <Text style={[
                                styles.statusText,
                                item.available ? { color: '#15803d' } : { color: '#b91c1c' }
                            ]}>
                                {item.available ? 'Online' : 'Offline'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.cardDetails}>
                        <View style={styles.detailItem}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="car-outline" size={18} color="#555" />
                            </View>
                            <View>
                                <Text style={styles.detailLabel}>Vehicle</Text>
                                <Text style={styles.detailValue}>{item.vehicleType || 'Truck'}</Text>
                            </View>
                        </View>
                        <View style={styles.verticalDivider} />
                        <View style={styles.detailItem}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="card-outline" size={18} color="#555" />
                            </View>
                            <View>
                                <Text style={styles.detailLabel}>Plate No.</Text>
                                <Text style={styles.detailValue}>{item.plateNumber}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.cardFooter}>
                        <TouchableOpacity style={styles.callButton}>
                            <Ionicons name="call" size={18} color="#FFF" />
                            <Text style={styles.callButtonText}>Call Driver</Text>
                        </TouchableOpacity>

                        {isAdmin && (
                            <View style={styles.adminActions}>
                                <TouchableOpacity
                                    style={styles.iconButton}
                                    onPress={() => router.push({ pathname: '/driver/[id]', params: { id: item.id } })}
                                >
                                    <Ionicons name="create-outline" size={20} color="#1A1A1A" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.iconButton, { backgroundColor: '#FEE2E2' }]}
                                    onPress={() => handleDelete(item.id, item.name)}
                                >
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const handleBack = () => {
        router.replace('/adminfarmerdashboard');
    };
    return (
        <ProtectedRoute>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
                            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={styles.title}>All Drivers</Text>
                        <Text style={styles.subtitle}>{displayedDrivers.length} drivers available</Text>
                    </View>
                    <View style={styles.placeholder} />
                </View>

                {displayedDrivers.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="search" size={40} color="#000" />
                        </View>
                        <Text style={styles.emptyTitle}>No Drivers Found</Text>
                        <Text style={styles.emptyText}>
                            {isAdmin ? 'No drivers registered yet.' : 'There are currently no drivers marked as available in your area.'}
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={displayedDrivers}
                        renderItem={renderDriver}
                        keyExtractor={(item) => item.id}
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
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#FFF',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    placeholder: {
        width: 44,
    },
    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#1A1A1A',
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        textAlign: 'center',
    },
    listContent: {
        padding: 24,
        paddingBottom: 100,
    },
    driverCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    driverAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        color: '#FFF',
    },
    headerInfo: {
        flex: 1,
    },
    driverName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    ratingText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#B45309',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
    },
    statusOnline: {
        backgroundColor: '#F0FDF4',
        borderColor: '#DCFCE7',
    },
    statusOffline: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FEE2E2',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    statusText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
    },
    cardDetails: {
        flexDirection: 'row',
        backgroundColor: '#FAFAFA',
        borderRadius: 16,
        padding: 16,
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    detailItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    verticalDivider: {
        width: 1,
        backgroundColor: '#E5E5E5',
        marginHorizontal: 16,
    },
    detailIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    detailLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 10,
        color: '#757575',
        marginBottom: 2,
    },
    detailValue: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#1A1A1A',
    },
    cardFooter: {
        flexDirection: 'row',
        gap: 12,
    },
    callButton: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        gap: 8,
    },
    callButtonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#FFF',
    },
    adminActions: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        marginTop: -60,
    },
    emptyIconContainer: {
        width: 88,
        height: 88,
        borderRadius: 44,
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
        maxWidth: 260,
    },
});

