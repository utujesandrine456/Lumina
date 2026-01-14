import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useDriverStore } from '@/constants/store';
import BottomBar from '@/components/DriverBottomBar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Profile() {
    const router = useRouter();
    const { currentUser, drivers, updateDriver, cooperatives, updateCooperative } = useDriverStore();
    const isDriver = currentUser?.role === 'driver';
    const isCoop = currentUser?.role === 'adminfarmer';
    const driver = useMemo(() => isDriver ? drivers.find(d => d.id === currentUser?.id) : null, [drivers, currentUser, isDriver]);
    const [availability, setAvailability] = useState(driver?.available ?? true);
    const coop = useMemo(() => isCoop ? cooperatives.find(c => c.id === currentUser?.id || c.id === currentUser?.cooperativeId) : null, [cooperatives, currentUser, isCoop]);
    const [send, setSend] = useState(true);

    const toggleAvailability = () => {
        if (!isDriver || !driver) return;
        const next = !availability;
        setAvailability(next);
        updateDriver(driver.id, { available: next });
    };

    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        vehicleType: '',
        plateNumber: '',
        location: '',
    });

    const openEditModal = () => {
        if (!currentUser) return;
        setEditForm({
            name: isCoop ? (coop?.name || currentUser.name) : currentUser.name,
            phone: isCoop ? (coop?.phone || currentUser.phone || '') : (currentUser.phone || ''),
            vehicleType: driver?.vehicleType || '',
            plateNumber: driver?.plateNumber || '',
            location: coop?.location || '',
        });
        setShowEditModal(true);
    };

    const handleSaveProfile = () => {
        if (!currentUser) return;

        if (isDriver && driver) {
            updateDriver(driver.id, {
                fullName: editForm.name,
                phone: editForm.phone,
                vehicleType: editForm.vehicleType,
                plateNumber: editForm.plateNumber,
            });
            useDriverStore.setState(state => ({
                currentUser: state.currentUser ? { ...state.currentUser, name: editForm.name, phone: editForm.phone } : null
            }));
        } else if (isCoop && coop) {
            updateCooperative(coop.id, {
                name: editForm.name,
                phone: editForm.phone,
                location: editForm.location,
            });
            useDriverStore.setState(state => ({
                currentUser: state.currentUser ? { ...state.currentUser, name: editForm.name, phone: editForm.phone } : null
            }));
        }
        setShowEditModal(false);
    };

    if (!currentUser) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
                <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 16, color: '#999' }}>No user logged in</Text>
            </SafeAreaView>
        );
    }

    return (
        <ProtectedRoute>
            <View style={styles.container}>
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    <View style={styles.header}>
                        <View style={styles.headerTop}>
                            <TouchableOpacity
                                onPress={() => router.back()}
                                style={styles.backButton}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings')}>
                                <View style={styles.menuIconInfo}>
                                    <Ionicons name="settings-outline" size={22} color="#1A1A1A" />
                                    <Text style={styles.menuText}>Settings</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Profile</Text>
                            <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
                                <Ionicons name="pencil-outline" size={20} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <Animated.View entering={FadeInUp.duration(500)} style={styles.profileSection}>
                            <View style={styles.avatarContainer}>
                                <View style={styles.avatar}>
                                    <Ionicons
                                        name={isCoop ? "business" : "person"}
                                        size={36}
                                        color="#000"
                                    />
                                </View>
                                {isDriver && availability && (
                                    <View style={styles.onlineIndicator} />
                                )}
                            </View>
                            <Text style={styles.name}>
                                {isCoop ? coop?.name : currentUser.name}
                            </Text>
                            <Text style={styles.role}>
                                {isCoop ? 'Cooperative Officer' : 'Professional Driver'}
                            </Text>
                        </Animated.View>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {isDriver && (
                            <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.statsGrid}>
                                <View style={styles.statCard}>
                                    <Text style={styles.statNumber}>{(driver?.rating || 4.9).toFixed(1)}</Text>
                                    <Text style={styles.statLabel}>Rating</Text>
                                </View>
                                <View style={styles.statCard}>
                                    <Text style={styles.statNumber}>
                                        {driver ? useDriverStore.getState().getDriverRequests(driver.id).filter(r => r.status === 'completed').length : 0}
                                    </Text>
                                    <Text style={styles.statLabel}>Completed Trips</Text>
                                </View>
                                <View style={styles.statCard}>
                                    <Text style={styles.statNumber}>{driver?.capacity ? `${driver.capacity}kg` : 'N/A'}</Text>
                                    <Text style={styles.statLabel}>Capacity</Text>
                                </View>
                            </Animated.View>
                        )}

                        <Animated.View entering={FadeInDown.delay(200).springify()}>
                            <Text style={styles.sectionTitle}>Account Details</Text>
                            <View style={styles.card}>
                                <View style={styles.detailItem}>
                                    <View style={styles.detailIconContainer}>
                                        <Ionicons name="call-outline" size={18} color="#000" />
                                    </View>
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>Phone Number</Text>
                                        <Text style={styles.detailValue}>{currentUser.phone}</Text>
                                    </View>
                                </View>

                                <View style={styles.separator} />

                                <View style={styles.detailItem}>
                                    <View style={styles.detailIconContainer}>
                                        <Ionicons name="card-outline" size={18} color="#000" />
                                    </View>
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>{isCoop ? 'Officer ID' : 'Driver ID'}</Text>
                                        <Text style={styles.detailValue}>{currentUser.id.slice(0, 8).toUpperCase()}</Text>
                                    </View>
                                </View>

                                {isDriver && (
                                    <>
                                        <View style={styles.separator} />
                                        <View style={styles.detailItem}>
                                            <View style={styles.detailIconContainer}>
                                                <Ionicons name="car-sport-outline" size={18} color="#000" />
                                            </View>
                                            <View style={styles.detailTextContainer}>
                                                <Text style={styles.detailLabel}>Vehicle Type</Text>
                                                <Text style={styles.detailValue}>{driver?.vehicleType || 'Not Set'}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.separator} />
                                        <View style={styles.detailItem}>
                                            <View style={styles.detailIconContainer}>
                                                <Ionicons name="text-outline" size={18} color="#000" />
                                            </View>
                                            <View style={styles.detailTextContainer}>
                                                <Text style={styles.detailLabel}>Plate Number</Text>
                                                <Text style={styles.detailValue}>{driver?.plateNumber || 'Not Set'}</Text>
                                            </View>
                                        </View>
                                    </>
                                )}

                                {isCoop && (
                                    <>
                                        <View style={styles.separator} />
                                        <View style={styles.detailItem}>
                                            <View style={styles.detailIconContainer}>
                                                <Ionicons name="location-outline" size={18} color="#000" />
                                            </View>
                                            <View style={styles.detailTextContainer}>
                                                <Text style={styles.detailLabel}>Location</Text>
                                                <Text style={styles.detailValue}>{coop?.location || 'GPS not set'}</Text>
                                            </View>
                                        </View>
                                    </>
                                )}
                            </View>
                        </Animated.View>

                        {isDriver && (
                            <Animated.View entering={FadeInDown.delay(300).springify()}>
                                <Text style={styles.sectionTitle}>Preferences</Text>
                                <View style={styles.card}>
                                    <View style={styles.settingItem}>
                                        <View style={styles.settingLeft}>
                                            <View style={[styles.settingIcon, { backgroundColor: '#f5f5f5' }]}>
                                                <Ionicons name="notifications-outline" size={18} color="#000" />
                                            </View>
                                            <Text style={styles.settingText}>Notifications</Text>
                                        </View>
                                        <Switch
                                            value={true}
                                            trackColor={{ false: '#e0e0e0', true: '#000' }}
                                            thumbColor={'#fff'}
                                            ios_backgroundColor="#e0e0e0"
                                        />
                                    </View>

                                    <View style={styles.separator} />

                                    <View style={styles.settingItem}>
                                        <View style={styles.settingLeft}>
                                            <View style={[styles.settingIcon, { backgroundColor: availability ? '#000' : '#f5f5f5' }]}>
                                                <Ionicons
                                                    name="power-outline"
                                                    size={18}
                                                    color={availability ? '#fff' : '#000'}
                                                />
                                            </View>
                                            <Text style={styles.settingText}>Available for Jobs</Text>
                                        </View>
                                        <Switch
                                            value={availability}
                                            onValueChange={toggleAvailability}
                                            trackColor={{ false: '#e0e0e0', true: '#000' }}
                                            thumbColor={'#fff'}
                                            ios_backgroundColor="#e0e0e0"
                                        />
                                    </View>
                                </View>
                            </Animated.View>
                        )}

                        <Animated.View entering={FadeInDown.delay(400).springify()}>
                            <Text style={styles.sectionTitle}>Actions</Text>
                            <View style={styles.card}>
                                <TouchableOpacity
                                    style={styles.actionItem}
                                    onPress={() => router.push('/help')}
                                >
                                    <View style={styles.actionLeft}>
                                        <View style={[styles.actionIcon, { backgroundColor: '#f5f5f5' }]}>
                                            <Ionicons name="help-circle-outline" size={18} color="#000" />
                                        </View>
                                        <Text style={styles.actionText}>Help & Support</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="#000" />
                                </TouchableOpacity>

                                <View style={styles.separator} />

                                <TouchableOpacity
                                    style={styles.actionItem}
                                    onPress={() => router.replace('/login')}
                                >
                                    <View style={styles.actionLeft}>
                                        <View style={[styles.actionIcon, { backgroundColor: '#f5f5f5' }]}>
                                            <Ionicons name="log-out-outline" size={18} color="#ff0000ff" />
                                        </View>
                                        <Text style={[styles.actionText, { color: '#ff0000ff' }]}>Log Out</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="#ff0000ff" />
                                </TouchableOpacity>
                            </View>
                        </Animated.View>

                        <View style={styles.footerSpace} />
                    </ScrollView>
                </SafeAreaView>

                {showEditModal && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Edit Profile</Text>
                                <TouchableOpacity onPress={() => setShowEditModal(false)}>
                                    <Ionicons name="close" size={24} color="#000" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Full Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editForm.name}
                                    onChangeText={(text) => setEditForm(prev => ({ ...prev, name: text }))}
                                    placeholder="Enter your name"
                                />
                            </View>

                            {isDriver && (
                                <>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Vehicle Type</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={editForm.vehicleType}
                                            onChangeText={(text) => setEditForm(prev => ({ ...prev, vehicleType: text }))}
                                            placeholder="e.g. Truck, Van"
                                        />
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Plate Number</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={editForm.plateNumber}
                                            onChangeText={(text) => setEditForm(prev => ({ ...prev, plateNumber: text }))}
                                            placeholder="e.g. RAA 123 B"
                                        />
                                    </View>
                                </>
                            )}

                            {isCoop && (
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Location</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={editForm.location}
                                        onChangeText={(text) => setEditForm(prev => ({ ...prev, location: text }))}
                                        placeholder="e.g. Kigali, Rwanda"
                                    />
                                </View>
                            )}

                            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
                }

                {isDriver && <BottomBar />}
            </View >
        </ProtectedRoute>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 12,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#000',
        letterSpacing: -0.3,
    },
    profileSection: {
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#000',
        borderWidth: 2,
        borderColor: '#fff',
    },
    name: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        color: '#000',
        textAlign: 'center',
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    role: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 100,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    statNumber: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#000',
        marginBottom: 4,
    },
    statLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#666',
        letterSpacing: 0.5,
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#000',
        marginBottom: 12,
        letterSpacing: -0.2,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    detailTextContainer: {
        flex: 1,
    },
    detailLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
        letterSpacing: 0.3,
    },
    detailValue: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 15,
        color: '#000',
        letterSpacing: -0.2,
    },
    separator: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 16,
        marginLeft: 48,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 15,
        color: '#000',
        letterSpacing: -0.2,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    actionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    actionText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 15,
        color: '#000',
        letterSpacing: -0.2,
    },
    footerSpace: {
        height: 40,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        height: '60%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#000',
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#1A1A1A',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#000',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    saveButton: {
        backgroundColor: '#000',
        borderRadius: 16,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    saveButtonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#fff',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
    },
    menuIconInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    menuText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#1A1A1A',
    },
});