import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter, Link, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore, CurrentUser } from '@/constants/store';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [selectedRole, setSelectedRole] = useState<string | null>(
        (params.role as string) || null
    );

    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('');
    const [showPin, setShowPin] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { setCurrentUser, drivers, cooperatives, addCooperative, addDriver } = useDriverStore();


    const handleLogin = () => {
        setErrorMsg('');

        if (!selectedRole) {
            setErrorMsg('Please select a role first');
            return;
        }

        if (!phone || phone.length < 10) {
            setErrorMsg('Please enter a valid phone number');
            return;
        }

        let loggedInUser: CurrentUser | null = null;

        if (selectedRole === 'driver') {
            console.log("Searching for driver with phone:", phone, "and pin:", pin);
            let driver = drivers.find(d => d.phone === phone && d.pin === pin);

            if (!driver && (phone === '0785805869' || phone.endsWith('123'))) {
                const newDriver = {
                    id: 'demo-driver-' + Date.now(),
                    name: 'John Doe',
                    phone: phone,
                    pin: pin || '1234',
                    nationalId: '1199080000000000',
                    licenseNumber: 'R1234567',
                    plateNumber: 'RAA 123 B',
                    vehicleType: 'Truck',
                    available: true,
                    verified: true,
                    role: 'driver' as const,
                };
                addDriver(newDriver);
                driver = newDriver;
            }

            if (driver) {
                loggedInUser = {
                    id: driver.id,
                    name: driver.name,
                    phone: driver.phone,
                    role: 'driver',
                    cooperativeId: driver.cooperativeId
                };
            } else {
                console.log("Driver not found in store. Available drivers:", drivers.map(d => d.phone));
            }
            
        } else if (selectedRole === 'adminfarmer' || selectedRole === 'admindriver') {
            if (selectedRole === 'adminfarmer') {
                const coop = cooperatives.find(c => c.phone === phone && c.pin === pin);
                if (coop) {
                    loggedInUser = {
                        id: coop.id,
                        name: coop.officerName,
                        phone: coop.phone,
                        role: 'adminfarmer',
                        cooperativeId: coop.id
                    };
                } else {
                    const fallbackCoopId = 'temp-coop-id';
                    const hasFallbackCoop = cooperatives.some(c => c.id === fallbackCoopId);

                    if (!hasFallbackCoop) {
                        addCooperative({
                            id: fallbackCoopId,
                            name: 'Demo Cooperative',
                            officerName: 'Admin User',
                            phone: phone,
                            pin: pin,
                            status: 'verified',
                            farmers: []
                        });
                    }

                    loggedInUser = {
                        id: Date.now().toString(),
                        name: 'Admin User',
                        phone,
                        role: 'adminfarmer',
                        cooperativeId: fallbackCoopId,
                    };
                }
            } else {
                loggedInUser = {
                    id: Date.now().toString(),
                    name: 'Admin Driver',
                    phone,
                    role: 'admindriver',
                    cooperativeId: cooperatives[0]?.id ?? undefined,
                };
            }
        } else {
            console.warn("Login logic for this role not fully implemented in mock", selectedRole);
        }

        if (!loggedInUser) {
            console.log("Login failed: User not found or invalid credentials");
            setErrorMsg('Invalid Credentials. Please check your inputs.');
            return;
        }

        console.log("Login successful, setting user:", loggedInUser.role);
        setCurrentUser(loggedInUser);
        setErrorMsg(''); // Clear error on success

        console.log("Navigating to...");
        switch (loggedInUser.role) {
            case 'driver':
                console.log("Pushing to /profile");
                router.push('/profile');
                break;
            case 'adminfarmer':
                console.log("Pushing to /adminfarmerdashboard");
                router.push('/adminfarmerdashboard');
                break;
            case 'admindriver':
                console.log("Pushing to /admindriverdashboard");
                router.push('/admindriverdashboard');
                break;
            default:
                console.log("Pushing to /");
                router.push('/');
                break;
        }
    };

    const RoleChip = ({ value, label, icon }: { value: string; label: string; icon: keyof typeof Ionicons.glyphMap }) => {
        const active = selectedRole === value;
        return (
            <TouchableOpacity
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedRole(value)}
                activeOpacity={0.9}
            >
                <Ionicons name={icon} size={20} color={active ? '#FFF' : '#000'} />
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.mainContent}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue to Lumina</Text>
                    </View>

                    <View style={styles.roleContainer}>
                        <Text style={styles.roleLabel}>Choose Your Role</Text>
                        <View style={styles.chipsRow}>
                            <RoleChip value="adminfarmer" label="Admin Farmer" icon="people" />
                            <RoleChip value="driver" label="Driver" icon="car" />
                        </View>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="call-outline" size={20} color="#000" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your phone number"
                                    placeholderTextColor="#999"
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={setPhone}
                                    maxLength={10}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Access PIN</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#000" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your PIN"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                    value={pin}
                                    onChangeText={setPin}
                                    maxLength={10}
                                    secureTextEntry={!showPin}
                                />
                                <TouchableOpacity onPress={() => setShowPin(!showPin)}>
                                    <Ionicons name={showPin ? "eye-off-outline" : "eye-outline"} size={20} color="#757575" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {errorMsg ? (
                            <Text style={{ fontFamily: 'Poppins_500Medium', color: '#FF5252', fontSize: 13, textAlign: 'center' }}>
                                {errorMsg}
                            </Text>
                        ) : null}

                        <TouchableOpacity
                            style={[styles.loginButton, (phone.length >= 10 && selectedRole) ? styles.loginButtonActive : styles.loginButtonDisabled]}
                            onPress={handleLogin}
                            disabled={phone.length < 10 || !selectedRole}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.loginButtonText}>Login</Text>
                            <Ionicons name="arrow-forward" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.divider} />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account?</Text>
                        <Link href='/register' asChild>
                            <TouchableOpacity>
                                <Text style={styles.registerLink}>Register</Text>
                            </TouchableOpacity>
                        </Link>
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
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        flexGrow: 1,
    },
    mainContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
    titleContainer: {
        marginBottom: 30,
    },
    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 32,
        color: '#000',
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#757575',
    },
    roleContainer: {
        marginBottom: 24,
    },
    roleLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#1A1A1A',
        marginBottom: 12,
    },
    chipsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    chip: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        backgroundColor: '#FAFAFA',
    },
    chipActive: {
        backgroundColor: '#1A1A1A',
        borderColor: '#1A1A1A',
    },
    chipText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 13,
        color: '#757575',
    },
    chipTextActive: {
        color: '#FFF',
    },
    formContainer: {
        gap: 24,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#1A1A1A',
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#000',
        height: '100%',
        outlineColor: 'transparent',
        outlineWidth: 0,
    },
    loginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        gap: 8,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    loginButtonActive: {
        backgroundColor: '#000',
    },
    loginButtonDisabled: {
        backgroundColor: '#E0E0E0',
        shadowOpacity: 0,
        elevation: 0,
    },
    loginButtonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#FFF',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 32,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#EEEEEE',
    },
    dividerText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#999',
        marginHorizontal: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    footerText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
    },
    registerLink: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#000',
        textDecorationLine: 'underline',
    },
});
