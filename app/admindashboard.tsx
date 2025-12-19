import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AdminDashboard() {
    const router = useRouter();
    const { drivers, updateDriver } = useDriverStore();
    
    const [activeTab, setActiveTab] = useState<'cooperatives' | 'drivers' | 'reports'>('drivers');

    // Mock cooperatives data - in real app, this would come from store
    const cooperatives = [
        { id: '1', name: 'Musanze Cooperative', farmers: 25, status: 'approved' },
        { id: '2', name: 'Rubavu Cooperative', farmers: 18, status: 'pending' },
    ];

    const pendingDrivers = drivers.filter((d: any) => !d.verified);
    const verifiedDrivers = drivers.filter((d: any) => d.verified);

    const approveDriver = (driverId: string) => {
        updateDriver(driverId, { verified: true });
    };

    const rejectDriver = (driverId: string) => {
        // In real app, remove or mark as rejected
    };

    const approveCooperative = (coopId: string) => {
        // In real app, update cooperative status
    };

    const renderDriver = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Ionicons name="person-circle" size={48} color="#000" />
                <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>{item.plateNumber}</Text>
                    <Text style={styles.cardSubtitle}>Capacity: {item.capacity} kg</Text>
                </View>
            </View>
            {!item.verified && (
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.approveButton]}
                        onPress={() => approveDriver(item.id)}
                    >
                        <Ionicons name="checkmark" size={16} color="#FFF" />
                        <Text style={styles.actionButtonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.rejectButton]}
                        onPress={() => rejectDriver(item.id)}
                    >
                        <Ionicons name="close" size={16} color="#FFF" />
                        <Text style={styles.actionButtonText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            )}
            {item.verified && (
                <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#000" />
                    <Text style={styles.verifiedText}>Verified</Text>
                </View>
            )}
        </View>
    );

    const renderCooperative = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Ionicons name="people" size={48} color="#000" />
                <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>{item.farmers} farmers</Text>
                </View>
            </View>
            {item.status === 'pending' && (
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.approveButton]}
                        onPress={() => approveCooperative(item.id)}
                    >
                        <Ionicons name="checkmark" size={16} color="#FFF" />
                        <Text style={styles.actionButtonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.rejectButton]}
                    >
                        <Ionicons name="close" size={16} color="#FFF" />
                        <Text style={styles.actionButtonText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            )}
            {item.status === 'approved' && (
                <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#000" />
                    <Text style={styles.verifiedText}>Approved</Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Admin Dashboard</Text>
                    <Text style={styles.subtitle}>Monitor system activity</Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push('/registerdriver')}
                    style={styles.headerAction}
                >
                    <Ionicons name="person-add-outline" size={22} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'cooperatives' && styles.tabActive]}
                    onPress={() => setActiveTab('cooperatives')}
                >
                    <Text style={[styles.tabText, activeTab === 'cooperatives' && styles.tabTextActive]}>
                        Cooperatives
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'drivers' && styles.tabActive]}
                    onPress={() => setActiveTab('drivers')}
                >
                    <Text style={[styles.tabText, activeTab === 'drivers' && styles.tabTextActive]}>
                        Drivers
                    </Text>
                    {pendingDrivers.length > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{pendingDrivers.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'reports' && styles.tabActive]}
                    onPress={() => setActiveTab('reports')}
                >
                    <Text style={[styles.tabText, activeTab === 'reports' && styles.tabTextActive]}>
                        Reports
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {activeTab === 'cooperatives' && (
                    <>
                        <Text style={styles.sectionTitle}>Pending Approval</Text>
                        <FlatList
                            data={cooperatives.filter(c => c.status === 'pending')}
                            renderItem={renderCooperative}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                        />
                        <Text style={styles.sectionTitle}>Approved</Text>
                        <FlatList
                            data={cooperatives.filter(c => c.status === 'approved')}
                            renderItem={renderCooperative}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                        />
                    </>
                )}

                {activeTab === 'drivers' && (
                    <>
                        <Text style={styles.sectionTitle}>Pending Verification ({pendingDrivers.length})</Text>
                        {pendingDrivers.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="checkmark-circle-outline" size={48} color="#BDBDBD" />
                                <Text style={styles.emptyText}>All drivers verified</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={pendingDrivers}
                                renderItem={renderDriver}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={false}
                            />
                        )}
                        <Text style={styles.sectionTitle}>Verified Drivers ({verifiedDrivers.length})</Text>
                        <FlatList
                            data={verifiedDrivers}
                            renderItem={renderDriver}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                        />
                    </>
                )}

                {activeTab === 'reports' && (
                    <View style={styles.reportsContainer}>
                        <View style={styles.reportCard}>
                            <Ionicons name="stats-chart-outline" size={32} color="#000" />
                            <Text style={styles.reportTitle}>Total Trips</Text>
                            <Text style={styles.reportValue}>0</Text>
                        </View>
                        <View style={styles.reportCard}>
                            <Ionicons name="people-outline" size={32} color="#000" />
                            <Text style={styles.reportTitle}>Total Farmers</Text>
                            <Text style={styles.reportValue}>0</Text>
                        </View>
                        <View style={styles.reportCard}>
                            <Ionicons name="car-outline" size={32} color="#000" />
                            <Text style={styles.reportTitle}>Active Drivers</Text>
                            <Text style={styles.reportValue}>{verifiedDrivers.length}</Text>
                        </View>
                    </View>
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
    headerAction: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
    },
    greeting: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        color: '#000',
    },
    subtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        marginTop: 4,
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        gap: 8,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        position: 'relative',
    },
    tabActive: {
        backgroundColor: '#F5F5F5',
    },
    tabText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#757575',
    },
    tabTextActive: {
        color: '#000',
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#000',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontFamily: 'Poppins_600SemiBold',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#000',
        marginTop: 16,
        marginBottom: 12,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardInfo: {
        marginLeft: 12,
        flex: 1,
    },
    cardTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#000',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    approveButton: {
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
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        alignSelf: 'flex-start',
    },
    verifiedText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#000',
    },
    emptyState: {
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        marginTop: 12,
    },
    reportsContainer: {
        gap: 12,
    },
    reportCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
    },
    reportTitle: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#757575',
        marginTop: 12,
        marginBottom: 8,
    },
    reportValue: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 32,
        color: '#000',
    },
});

