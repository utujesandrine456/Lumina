import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useDriverStore } from '@/constants/store';

type RoleOption = 'cooperative' | 'driver';

const roleDetails: Record<RoleOption, { title: string; subtitle: string }> = {
    cooperative: {
        title: 'Register Cooperative Officer',
        subtitle: 'Enter cooperative name, your name, phone, and a secure PIN.',
    },
    driver: {
        title: 'Register Cooperative Driver',
        subtitle: 'Drivers are registered by a cooperative. Provide coop name, your name, phone, and PIN.',
    },
};

export default function Register() {
    const router = useRouter();
    const { setUserRole } = useDriverStore();

    const [role, setRole] = useState<RoleOption | null>(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [coopName, setCoopName] = useState('');
    const [pin, setPin] = useState('');

    const canSubmit = useMemo(() => {
        if (!role) return false;
        if (!name || phone.length < 10 || pin.length < 4) return false;
        if (!coopName) return false;
        return true;
    }, [role, name, phone, pin, coopName]);

    const handleSubmit = () => {
        if (!canSubmit || !role) {
            Alert.alert('Missing info', 'Please fill all required fields.');
            return;
        }
        setUserRole(role);
        router.push({
            pathname: '/otp',
            params: {
                role,
                phone,
                name,
                coopName,
                pin,
            },
        });
    };

    const renderRoleFields = () => (
        <Animated.View entering={SlideInRight.delay(150).springify()} style={styles.group}>
            <Text style={styles.label}>Cooperative Name *</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. Hinga Co-op"
                value={coopName}
                onChangeText={setCoopName}
            />
        </Animated.View>
    );

    const RoleChip = ({ value, label, icon }: { value: RoleOption; label: string; icon: keyof typeof Ionicons.glyphMap }) => {
        const active = role === value;
        return (
            <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={() => setRole(value)} activeOpacity={0.9}>
                <Ionicons name={icon} size={20} color={active ? '#FFF' : '#000'} />
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Create Account</Text>
                    <View style={{ width: 24 }} />
                </View>

                <Animated.View entering={FadeInDown.delay(150).springify()} style={styles.card}>
                    <Text style={styles.sectionTitle}>Select Role</Text>
                    <View style={styles.chipsRow}>
                        <RoleChip value="cooperative" label="Coop Officer" icon="people" />
                        <RoleChip value="driver" label="Coop Driver" icon="car" />
                    </View>

                    {role && (
                        <View style={styles.roleInfo}>
                            <Text style={styles.roleTitle}>{roleDetails[role].title}</Text>
                            <Text style={styles.roleSubtitle}>{roleDetails[role].subtitle}</Text>
                        </View>
                    )}

                    <Text style={styles.label}>Full Name *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Phone Number *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter phone number"
                        keyboardType="phone-pad"
                        maxLength={15}
                        value={phone}
                        onChangeText={setPhone}
                    />

                    <Text style={styles.label}>PIN (4+ digits) *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Create a PIN for quick login"
                        keyboardType="number-pad"
                        maxLength={8}
                        value={pin}
                        secureTextEntry
                        onChangeText={setPin}
                    />

                    {renderRoleFields()}

                    <TouchableOpacity
                        style={[styles.button, canSubmit && styles.buttonActive]}
                        onPress={handleSubmit}
                        disabled={!canSubmit}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.buttonText}>Continue to OTP</Text>
                        <Ionicons name="arrow-forward" size={20} color="#FFF" />
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 40,
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
    card: {
        margin: 20,
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#000',
        marginBottom: 12,
    },
    chipsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#FFF',
    },
    chipActive: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    chipText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#000',
    },
    chipTextActive: {
        color: '#FFF',
    },
    roleInfo: {
        marginTop: 8,
        marginBottom: 4,
        gap: 4,
    },
    roleTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
        color: '#000',
    },
    roleSubtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: '#757575',
        lineHeight: 18,
    },
    label: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#000',
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#B5B5B5',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        backgroundColor: '#FFF',
        color: '#000',
    },
    group: {
        marginTop: 8,
    },
    button: {
        marginTop: 24,
        backgroundColor: '#E0E0E0',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    buttonActive: {
        backgroundColor: '#000',
    },
    buttonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#FFF',
    },
});

