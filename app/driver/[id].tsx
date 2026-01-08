import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert, Switch } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import * as Location from 'expo-location';

export default function DriverDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { drivers, updateDriver, removeDriver, currentUser } = useDriverStore();

    const driver = drivers.find(d => d.id === id);
    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'admindriver';

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [plateNumber, setPlateNumber] = useState('');
    const [capacity, setCapacity] = useState('');
    const [verified, setVerified] = useState(false);
    const [available, setAvailable] = useState(false);

    useEffect(() => {
        if (driver) {
            setName(driver.name);
            setPhone(driver.phone);
            setPlateNumber(driver.plateNumber);
            setCapacity(driver.capacity?.toString() || '');
            setVerified(driver.verified);
            setAvailable(driver.available);
        }
    }, [driver]);

    if (!driver) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
                    <Text style={styles.title}>Driver Not Found</Text>
                    <View style={{ width: 24 }} />
                </View>
            </SafeAreaView>
        )
    }

    const handleSave = () => {
        updateDriver(driver.id, {
            name,
            phone,
            plateNumber,
            capacity: Number(capacity),
            verified,
            available
        });
        setIsEditing(false);
        Alert.alert('Success', 'Driver updated successfully');
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Driver',
            'Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', style: 'destructive', onPress: () => {
                        removeDriver(driver.id);
                        router.back();
                    }
                }
            ]
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>{isEditing ? 'Edit Driver' : 'Driver Profile'}</Text>
                    {isAdmin && !isEditing ? (
                        <TouchableOpacity onPress={() => setIsEditing(true)}>
                            <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                    ) : <View style={{ width: 24 }} />}
                </View>

                <View style={styles.card}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={48} color="#000" />
                    </View>

                    {isEditing ? (
                        <View style={styles.form}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput style={styles.input} value={name} onChangeText={setName} />

                            <Text style={styles.label}>Phone</Text>
                            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

                            <Text style={styles.label}>Plate Number</Text>
                            <TextInput style={styles.input} value={plateNumber} onChangeText={setPlateNumber} />

                            <Text style={styles.label}>Capacity (kg)</Text>
                            <TextInput style={styles.input} value={capacity} onChangeText={setCapacity} keyboardType="numeric" />

                            <View style={styles.switchRow}>
                                <Text style={styles.switchLabel}>Verified</Text>
                                <Switch value={verified} onValueChange={setVerified} />
                            </View>

                            <View style={styles.switchRow}>
                                <Text style={styles.switchLabel}>Available</Text>
                                <Switch value={available} onValueChange={setAvailable} />
                            </View>

                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.details}>
                            <Text style={styles.driverName}>{driver.name}</Text>
                            <Text style={styles.driverPhone}>{driver.phone}</Text>

                            <View style={styles.infoRow}>
                                <Ionicons name="card-outline" size={20} color="#666" />
                                <Text style={styles.infoText}>ID: {driver.nationalId}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="car-outline" size={20} color="#666" />
                                <Text style={styles.infoText}>{driver.plateNumber}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="cube-outline" size={20} color="#666" />
                                <Text style={styles.infoText}>{driver.capacity} kg</Text>
                            </View>

                            <View style={styles.statusRow}>
                                <View style={[styles.badge, { backgroundColor: driver.verified ? '#DCFCE7' : '#FFEDD5' }]}>
                                    <Text style={[styles.badgeText, { color: driver.verified ? '#166534' : '#9A3412' }]}>
                                        {driver.verified ? 'Verified' : 'Pending'}
                                    </Text>
                                </View>
                                <View style={[styles.badge, { backgroundColor: driver.available ? '#DCFCE7' : '#FEE2E2' }]}>
                                    <Text style={[styles.badgeText, { color: driver.available ? '#166534' : '#991B1B' }]}>
                                        {driver.available ? 'Online' : 'Offline'}
                                    </Text>
                                </View>
                            </View>

                            {isAdmin && (
                                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                    <Text style={styles.deleteButtonText}>Delete Driver</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    scrollContent: { paddingBottom: 30 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    details: {},
    title: { fontFamily: 'Poppins_600SemiBold', fontSize: 20, color: '#000' },
    editText: { fontFamily: 'Poppins_500Medium', fontSize: 16, color: '#000' },
    card: { padding: 24 },
    avatarContainer: {
        width: 100, height: 100, borderRadius: 50, backgroundColor: '#F5F5F5',
        alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24
    },
    driverName: { fontFamily: 'Poppins_600SemiBold', fontSize: 24, textAlign: 'center', marginBottom: 4 },
    driverPhone: { fontFamily: 'Poppins_400Regular', fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 24 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16, backgroundColor: '#FAFAFA', padding: 16, borderRadius: 12 },
    infoText: { fontFamily: 'Poppins_500Medium', fontSize: 16 },
    statusRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 8, marginBottom: 32 },
    badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    badgeText: { fontFamily: 'Poppins_600SemiBold', fontSize: 14 },
    deleteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, backgroundColor: '#FEF2F2', borderRadius: 12 },
    deleteButtonText: { color: '#EF4444', fontFamily: 'Poppins_600SemiBold', fontSize: 16 },

    form: { gap: 16 },
    label: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: '#444' },
    input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, fontFamily: 'Poppins_400Regular', fontSize: 16 },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    switchLabel: { fontFamily: 'Poppins_500Medium', fontSize: 16 },
    saveButton: { backgroundColor: '#000', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
    saveButtonText: { color: '#FFF', fontFamily: 'Poppins_600SemiBold', fontSize: 16 },
    cancelButton: { padding: 16, borderRadius: 12, alignItems: 'center' },
    cancelButtonText: { color: '#666', fontFamily: 'Poppins_500Medium', fontSize: 16 },
});
