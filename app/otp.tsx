import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';



export default function OTPScreen() {
    const router = useRouter();

    const params = useLocalSearchParams();
    const phone = params.phone as string;
    const role = params.role as string;
    const name = params.name as string;
    const coopName = params.coopName as string;
    const pin = params.pin as string;
    const location = params.location as string;

    const { setCurrentUser, drivers, addDriver, addCooperative } = useDriverStore();
    const [otp, setOtp] = useState(['', '', '', '', '', ' ']);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

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
        if (value.length > 1) {
            const pastedValues = value.slice(0, 6).split('');
            const newOtp = [...otp];
            pastedValues.forEach((val, i) => {
                if (index + i < 11) {
                    newOtp[index + i] = val;
                }
            });
            setOtp(newOtp);
            const nextIndex = Math.min(index + pastedValues.length, 11);
            inputRefs.current[nextIndex]?.focus();

            if (newOtp.every(d => d !== '')) {
                verifyCode(newOtp.join(''));
            }
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 11) {
            inputRefs.current[index + 1]?.focus();
        }

        if (newOtp.every(digit => digit !== '')) {
            verifyCode(newOtp.join(''));
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const verifyCode = (code: string) => {
        if (code !== correctOTP) {
            Alert.alert('Incorrect Code', 'The code you entered is incorrect. Please try again.');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
            return;
        }

        handleSuccess();
    };

    const handleVerify = () => {
        verifyCode(otp.join(''));
    };

    const handleSuccess = () => {
        const safeRole = role as any;

        if (role === 'adminfarmer') {
            const coopId = `coop-${phone}`;
            setCurrentUser({ id: coopId, name: name || 'Cooperative Officer', phone, role: 'adminfarmer', cooperativeId: coopId });
            addCooperative({
                id: coopId,
                name: coopName || 'Cooperative',
                officerName: name || 'Officer',
                location: location || '',
                phone: phone || '',
                pin: pin || '',
                status: 'pending',
                farmers: [],
            });

            router.push('/adminfarmerdashboard');
        } else if (role === 'admindriver') {
            const existing = drivers.find((d) => d.phone === phone);
            const driver = existing ?? {
                id: `drv-${Date.now()}`,
                name: name || 'Driver',
                phone: phone || '',
                pin: pin || '',
                plateNumber: 'UNKNOWN',
                capacity: 0,
                rating: 0,
                availability: true,
                verified: false,
            } as any;

            if (!existing) addDriver(driver);
            setCurrentUser({ id: driver.id, name: driver.name || 'Driver', phone: phone || '', role: 'driver' });
            router.push('/admindriverdashboard');
        } else {
            setCurrentUser({ id: `user-${Date.now()}`, name: name || 'User', phone: phone || '', role: safeRole || 'user' });
            Alert.alert("Success", "Account verified!");
        }
    };

    const handleResend = () => {
        setTimer(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        Alert.alert('Code Sent', 'A new verification code has been sent.');
    };


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                </View>

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.content}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="shield-checkmark" size={48} color="#1A1A1A" />
                    </View>

                    <Text style={styles.title}>Verification Code</Text>
                    <Text style={styles.subtitle}>
                        We have sent the verification code to your phone number
                    </Text>
                    <Text style={styles.phoneDisplay}>{phone}</Text>

                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <Animated.View key={index} entering={SlideInRight.delay(300 + index * 50).springify()} style={[styles.otpInputWrapper, focusedIndex === index && styles.otpInputWrapperFocused, digit !== '' && styles.otpInputWrapperFilled]}>
                                <TextInput ref={(ref) => { inputRefs.current[index] = ref; }} style={[styles.otpInput, digit !== '' && { color: '#FFFFFF' }]}
                                    value={digit}
                                    onChangeText={(value) => handleOtpChange(value, index)}
                                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                                    onFocus={() => setFocusedIndex(index)}
                                    onBlur={() => setFocusedIndex(null)}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    selectTextOnFocus
                                    caretHidden
                                />
                            </Animated.View>
                        ))}
                    </View>

                    <TouchableOpacity style={[styles.verifyButton, otp.every(d => d !== '') && styles.verifyButtonActive]} onPress={handleVerify} disabled={!otp.every(d => d !== '')} activeOpacity={0.9}>
                        <Text style={[styles.verifyButtonText, otp.every(d => d !== '') && { color: '#FFF' }]}>Confirm</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        {canResend ? (
                            <TouchableOpacity onPress={handleResend} style={styles.resendButton}>
                                <Text style={styles.resendText}>Resend Code</Text>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.timerText}>
                                Resend code in <Text style={{ fontFamily: 'Poppins_600SemiBold', color: '#1A1A1A' }}>{timer}s</Text>
                            </Text>
                        )}
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
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F7F7F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        color: '#1A1A1A',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#757575',
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 22,
        paddingHorizontal: 20,
        fontFamily: 'Poppins_400Regular',
    },
    phoneDisplay: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#1A1A1A',
        marginBottom: 40,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
        marginBottom: 32,
    },
    otpInputWrapper: {
        width: 48,
        height: 48,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpInputWrapperFocused: {
        borderColor: '#1A1A1A',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    otpInputWrapperFilled: {
        borderColor: '#1A1A1A',
        backgroundColor: '#1A1A1A',
    },
    otpInput: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Poppins_600SemiBold',
        color: '#1A1A1A',
        outlineColor: 'transparent',
        outlineWidth: 0,
    },
    verifyButton: {
        width: '100%',
        backgroundColor: '#F0F0F0',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 24,
    },
    verifyButtonActive: {
        backgroundColor: '#1A1A1A',
        shadowColor: '#1A1A1A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    verifyButtonText: {
        color: '#999',
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
    footer: {
        alignItems: 'center',
    },
    timerText: {
        fontSize: 14,
        color: '#757575',
        textAlign: 'center',
        fontFamily: 'Poppins_400Regular',
    },
    resendButton: {
        padding: 8,
    },
    resendText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: '#1A1A1A',
    },
});
