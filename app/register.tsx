import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const isWeb = Platform.OS === 'web';


type RoleOption = 'c-farmer' | 'c-driver';

const roleDetails: Record<RoleOption, { title: string; subtitle: string }> = {
    'c-farmer': {
        title: 'Register Farmer',
        subtitle: 'Enter farmer name, your name, phone, and a secure PIN.',
    },
    'c-driver': {
        title: 'Register Driver',
        subtitle: 'Drivers are registered by a cooperative. Provide coop name, your name, phone, and PIN.',
    },
};

export default function Register() {
    const router = useRouter();
    const [role, setRole] = useState<RoleOption | null>(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [coopName, setCoopName] = useState('');
    const [pin, setPin] = useState('');
    const [location, setLocation] = useState('');
    const [tinNumber, setTinNumber] = useState('');

    const canSubmit = useMemo(() => {
        if (!role) return false;
        if (!name || phone.length < 10 || pin.length < 4) return false;
        if (!tinNumber || tinNumber.length < 9) return false;
        return true;
    }, [role, name, phone, pin, tinNumber]);

    const handleSubmit = () => {
        if (!canSubmit || !role) {
            Alert.alert('Missing info', 'Please fill all required fields.');
            return;
        }

        router.push({
            pathname: '/otp',
            params: {
                role,
                phone,
                name,
                coopName,
                pin,
                location,
                tinNumber,
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

            <Text style={styles.label}>TIN Number *</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter cooperative TIN number"
                value={tinNumber}
                onChangeText={setTinNumber}
                keyboardType="number-pad"
                maxLength={12}
            />
        </Animated.View>
    );

    const RoleChip = ({ value, label, icon }: { value: RoleOption; label: string; icon: keyof typeof Ionicons.glyphMap }) => {
        const active = role === value;
        return (
            <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={() => setRole(value)} activeOpacity={0.9}>
                <Ionicons name={icon} size={20} color={active ? '#fff' : '#000'} />
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Create Account</Text>
                </View>
                <View style={styles.placeholderButton} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(150).springify()} style={styles.card}>
                    <Text style={styles.sectionTitle}>Select Role</Text>
                    <View style={styles.chipsRow}>
                        <RoleChip value="c-farmer" label="Farmer" icon="people" />
                        <RoleChip value="c-driver" label="Driver" icon="car" />
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

                    <Text style={styles.label}>Location *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your location"
                        value={location}
                        onChangeText={setLocation}
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
                        <Text style={[styles.buttonText, canSubmit && { color: '#FFF' }]}>Continue to OTP</Text>
                        <Ionicons name="arrow-forward" size={20} color={canSubmit ? "#FFF" : "#999"} />
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        ...(isWeb && {
            maxWidth: 400,
            alignSelf: 'center',
            width: '100%'
        })
    },
    scrollContent: {
        paddingBottom: 40,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 16,
        borderBottomWidth:1,
        borderBottomColor:'#b8b8b8',
        zIndex: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderButton: {
        width: 44,
    },
    titleContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
        color: '#000',
    },
    title: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 24,
        color: '#000',
        letterSpacing: 0.5,
    },
    card: {
        marginHorizontal: 24,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#000',
        marginBottom: 16,
    },
    chipsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    chip: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 16,
        backgroundColor: '#ffff',
        borderWidth: 1,
        borderColor: '#000',
    },
    chipActive: {
        backgroundColor: '#000',
    },
    chipText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 13,
        color: '#000',
    },
    chipTextActive: {
        color: '#fff',
    },
    roleInfo: {
        marginTop: 8,
        marginBottom: 8,
        padding: 16,
        backgroundColor: '#F9F9F9',
        borderRadius: 16,
        borderLeftWidth: 3,
        borderLeftColor: '#1A1A1A',
    },
    roleTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#1A1A1A',
        marginBottom: 4,
    },
    roleSubtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
    },
    label: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#1A1A1A',
        marginBottom: 8,
        marginTop: 20,
    },
    input: {
        borderWidth: 1.5,
        borderColor: '#EEEEEE',
        borderRadius: 16,
        padding: 16,
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        backgroundColor: '#FAFAFA',
        color: '#1A1A1A',
        outlineWidth: 0,
        outlineColor: 'transparent',
    },
    group: {
        marginTop: 0,
    },
    button: {
        marginTop: 32,
        backgroundColor: '#F0F0F0',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    buttonActive: {
        backgroundColor: '#1A1A1A',
        shadowColor: '#1A1A1A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    buttonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#999',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        gap: 6,
    },
    footerText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
    },
    loginLink: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#1A1A1A',
        textDecorationLine: 'underline',
    },
});

