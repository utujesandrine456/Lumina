import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ProtectedRoute from '@/components/ProtectedRoute';



export default function SettingsScreen() {
    const router = useRouter();
    const [notifications, setNotifications] = useState(true);
    const [location, setLocation] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [showEditPin, setShowEditPin] = useState(false);
    const [editPin, setEditPin] = useState({
        currentPin: '',
        pin: '',
        confirmnewPin: ''
    });

    const openEditPinModal = () => {
        setEditPin({
            currentPin: '',
            pin: '',
            confirmnewPin: ''
        });
        setShowEditPin(true);
    };

    const handleSavePin = () => {
        if (editPin.pin !== editPin.confirmnewPin) {
            alert("New PINs do not match");
            return;
        }
        setShowEditPin(false);
    };

    const SettingSection = ({ title, children, delay }: { title: string, children: React.ReactNode, delay: number }) => (
        <Animated.View entering={FadeInDown.delay(delay).springify()} style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.card}>
                {children}
            </View>
        </Animated.View>
    );

    const SettingItem = ({ icon, label, value, onToggle, bg, color, hideBorder }: any) => (
        <View style={[styles.item, hideBorder && { borderBottomWidth: 0 }]}>
            <View style={styles.itemLeft}>
                <View style={[styles.iconBox, { backgroundColor: bg || '#F5F5F5' }]}>
                    <Ionicons name={icon} size={20} color={color || '#1A1A1A'} />
                </View>
                <Text style={styles.itemLabel}>{label}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: '#E0E0E0', true: '#1A1A1A' }}
                thumbColor={'#FFF'}
            />
        </View>
    );

    const ActionItem = ({ icon, label, onPress, bg, color, hideBorder, textStyle }: any) => (
        <TouchableOpacity style={[styles.item, hideBorder && { borderBottomWidth: 0 }]} onPress={onPress}>
            <View style={styles.itemLeft}>
                <View style={[styles.iconBox, { backgroundColor: bg || '#F5F5F5' }]}>
                    <Ionicons name={icon} size={20} color={color || '#1A1A1A'} />
                </View>
                <Text style={[styles.itemLabel, textStyle]}>{label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>
    );

    return (
        <ProtectedRoute>
            <View style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Settings</Text>
                        <View style={{ width: 44 }} />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                        <SettingSection title="Preferences" delay={100}>
                            <SettingItem
                                icon="notifications-outline"
                                label="Push Notifications"
                                value={notifications}
                                onToggle={setNotifications}
                                bg="#E3F2FD"
                                color="#2196F3"
                            />
                            <SettingItem
                                icon="location-outline"
                                label="Location Services"
                                value={location}
                                onToggle={setLocation}
                                bg="#E8F5E9"
                                color="#4CAF50"
                            />
                            <SettingItem
                                icon="moon-outline"
                                label="Dark Mode"
                                value={darkMode}
                                onToggle={setDarkMode}
                                bg="#F3E5F5"
                                color="#9C27B0"
                                hideBorder
                            />
                        </SettingSection>

                        <SettingSection title="Account" delay={200}>
                            <ActionItem
                                icon="person-outline"
                                label="Edit Profile"
                                onPress={() => router.push('/profile')}
                            />
                            <ActionItem
                                icon="lock-closed-outline"
                                label="Change PIN"
                                onPress={openEditPinModal}
                            />
                            <ActionItem
                                icon="shield-checkmark-outline"
                                label="Privacy & Security"
                                onPress={() => { }}
                                hideBorder
                            />
                        </SettingSection>

                        <SettingSection title="Support" delay={300}>
                            <ActionItem
                                icon="help-circle-outline"
                                label="Help Center"
                                onPress={() => router.push('/help')}
                            />
                            <ActionItem
                                icon="document-text-outline"
                                label="Terms of Service"
                                onPress={() => { }}
                                hideBorder
                            />
                        </SettingSection>

                        <Animated.View entering={FadeInDown.delay(400).springify()} style={[styles.section, { marginBottom: 40 }]}>
                            <View style={styles.card}>
                                <ActionItem
                                    icon="log-out-outline"
                                    label="Log Out"
                                    onPress={() => router.replace('/login')}
                                    bg="#FFEBEE"
                                    color="#FF5252"
                                    textStyle={{ color: '#FF5252' }}
                                    hideBorder
                                />
                            </View>
                        </Animated.View>

                        <Text style={styles.versionText}>Version 1.0.0 (Build 124)</Text>

                    </ScrollView>
                </SafeAreaView>

                {showEditPin && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Change PIN</Text>
                                <TouchableOpacity onPress={() => setShowEditPin(false)}>
                                    <Ionicons name="close" size={24} color="#000" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Current PIN</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editPin.currentPin}
                                    onChangeText={(text) => setEditPin(prev => ({ ...prev, currentPin: text }))}
                                    keyboardType="numeric"
                                    secureTextEntry
                                    placeholder="Enter current PIN"
                                    placeholderTextColor="#999"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>New PIN</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editPin.pin}
                                    onChangeText={(text) => setEditPin(prev => ({ ...prev, pin: text }))}
                                    keyboardType="numeric"
                                    secureTextEntry
                                    placeholder="Enter new PIN"
                                    placeholderTextColor="#999"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Confirm New PIN</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editPin.confirmnewPin}
                                    onChangeText={(text) => setEditPin(prev => ({ ...prev, confirmnewPin: text }))}
                                    keyboardType="numeric"
                                    secureTextEntry
                                    placeholder="Confirm new PIN"
                                    placeholderTextColor="#999"
                                />
                            </View>

                            <TouchableOpacity style={styles.saveButton} onPress={handleSavePin}>
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </ProtectedRoute>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
    },
    content: {
        padding: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#757575',
        marginBottom: 12,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 0,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 2,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 15,
        color: '#1A1A1A',
    },
    versionText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#BBB',
        textAlign: 'center',
        marginTop: 0,
        marginBottom: 40,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        height: '70%',
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
});
