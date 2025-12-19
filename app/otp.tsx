import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MonoText } from '@/components/StyledText';
import { useDriverStore } from '@/constants/store';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';

export default function OTPScreen() {
    const router = useRouter();
    
    const { phone, role, name, coopName, pin } = useLocalSearchParams<{
        phone: string;
        role: string;
        name?: string;
        coopName?: string;
        pin?: string;
    }>();

    const { setCurrentUser, setUserRole, drivers, addDriver, addCooperative } = useDriverStore();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const correctOTP = '123456';

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleOtpChange = (value: string, index: number) => {
        if (value.length > 1) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        if (newOtp.every(digit => digit !== '') && newOtp.join('') === correctOTP) {
            handleVerify();
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        const enteredOtp = otp.join('');
        
        if (enteredOtp !== correctOTP) {
            Alert.alert('Invalid OTP', 'Please enter the correct OTP code');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
            return;
        }

        if (role === 'admin') {
            setCurrentUser({ id: `admin-${phone}`, name: 'Admin', phone, role: 'admin' });
            router.push('/admindashboard');
        } else if (role === 'cooperative') {
            const coopId = `coop-${phone}`;
            setCurrentUser({ id: coopId, name: name || 'Cooperative Officer', phone, role: 'cooperative' });
            addCooperative({
                id: coopId,
                name: coopName || 'Cooperative',
                officerName: name || 'Officer',
                location: '',
                phone,
                pin,
                status: 'pending',
                farmers: [],
            });
            router.push('/cooperativedashboard');
        } else if (role === 'driver') {
            const existing = drivers.find((d) => d.phone === phone);
            const driver = existing ?? {
                id: `drv-${Date.now()}`,
                name: name || 'Driver',
                phone,
                pin,
                plateNumber: 'UNKNOWN',
                capacity: 0,
                rating: 0,
                availability: true,
                verified: false,
            } as any;

            if (!existing) addDriver(driver);
            setCurrentUser({ id: driver.id, name: driver.name, phone, role: 'driver' });
            router.push('/driverdashboard');
        }
    };

    const handleResend = () => {
        setTimer(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        Alert.alert('OTP Sent', 'A new OTP has been sent to your phone');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Verify OTP</Text>
                    <View style={{ width: 24 }} />
                </View>

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.content}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="lock-closed" size={64} color="#000" />
                    </View>
                    
                    <Text style={styles.title}>Enter Verification Code</Text>
                    <MonoText style={styles.subtitle}>
                        We've sent a 6-digit code to{'\n'}
                        <Text style={styles.phoneNumber}>{phone}</Text>
                    </MonoText>

                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <Animated.View
                                key={index}
                                entering={SlideInRight.delay(300 + index * 50).springify()}
                            >
                                <TextInput      
                                    ref={(ref) => { inputRefs.current[index] = ref; }}
                                    style={[styles.otpInput, digit && styles.otpInputFilled]}
                                    value={digit}
                                    onChangeText={(value) => handleOtpChange(value, index)}
                                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    selectTextOnFocus
                                />
                            </Animated.View>
                        ))}
                    </View>

                    <View style={styles.timerContainer}>
                        {timer > 0 ? (
                            <MonoText style={styles.timerText}>
                                Resend code in {timer}s
                            </MonoText>
                        ) : (
                            <TouchableOpacity onPress={handleResend}>
                                <Text style={styles.resendText}>Resend OTP</Text>
                            </TouchableOpacity>
                        )}
                        </View>
                        
                    <TouchableOpacity
                        style={[styles.verifyButton, otp.every(d => d !== '') && styles.verifyButtonActive]}
                        onPress={handleVerify}
                        disabled={!otp.every(d => d !== '')}
                    >
                        <Text style={styles.verifyButtonText}>Verify</Text>
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
        flexGrow: 1,
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
    headerTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#000',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        alignItems: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        color: '#000',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
        marginBottom: 40,
    },
    phoneNumber: {
        fontFamily: 'Poppins_600SemiBold',
        color: '#000',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 32,
        gap: 12,
    },
    otpInput: {
        flex: 1,
        height: 60,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 24,
        fontFamily: 'Poppins_600SemiBold',
        color: '#000',
        backgroundColor: '#FFF',
    },
    otpInputFilled: {
        borderColor: '#000',
        backgroundColor: '#F5F5F5',
    },
    timerContainer: {
        marginBottom: 32,
    },
    timerText: {
        fontSize: 14,
        color: '#757575',
        textAlign: 'center',
    },
    resendText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: '#000',
        textAlign: 'center',
    },
    verifyButton: {
        width: '100%',
        backgroundColor: '#E0E0E0',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    verifyButtonActive: {
        backgroundColor: '#000',
    },
    verifyButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
});

