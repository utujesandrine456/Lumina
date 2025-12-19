import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert } from "react-native";
import { MonoText } from '@/components/StyledText';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Login() {
    const { userRole, setUserRole } = useDriverStore();
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('');



    const router = useRouter();

    const handleSendOTP = () => {
        if (!userRole) {
            router.push('/role');
            return;
        }

        if (!phone || phone.length < 10) {
            Alert.alert('Invalid Phone', 'Please enter a valid phone number');
            return;
        }

        router.push({ pathname: '/otp', params: { phone, role: userRole } });
    };

    return (
        <ScrollView contentContainerStyle={{}}>
            <View style={{ backgroundColor: 'white' }}>
                <View style={{ backgroundColor: '#E8F5E8', padding: 15, margin: 10, borderRadius: 40, alignSelf: 'flex-start', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                    <TouchableOpacity onPress={() => router.push('/role')} style={{ alignSelf: 'flex-start' }}>
                        <Ionicons name="arrow-back" size={24} color="#2E7D32" />
                    </TouchableOpacity>
                </View>

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.content}>
                    <Text style={styles.titlecontainer}>Login to your account</Text>
                    <View style={{ marginHorizontal: 10, marginBlock: 10 }}>
                        <Text style={styles.label}>Phone Number:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your phone number"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                            maxLength={15}
                        />
                    </View>

                    <View style={{ marginHorizontal: 10, marginBlock: 10 }}>
                        <Text style={styles.label}>PIN:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your PIN"
                            keyboardType="numeric"
                            value={pin}
                            onChangeText={setPin}
                            maxLength={4}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, phone.length >= 10 && styles.buttonActive]}
                        onPress={handleSendOTP}
                        disabled={phone.length < 10}
                    >
                        <Text style={styles.buttonTextcontainer}>Login</Text>
                        <Ionicons name="arrow-forward" size={20} color="#FFF" />
                    </TouchableOpacity>
                </Animated.View>

                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBlock: 20 }}>
                    <View style={{ width: 150, height: 1, backgroundColor: '#C1C1C1' }}></View>
                    <MonoText style={{ color: '#767676ff' }}>or</MonoText>
                    <View style={{ width: 150, height: 1, backgroundColor: '#C1C1C1' }}></View>
                </View>

                <Text style={{ color: '#4CAF50', textAlign: 'center', marginBlock: 20, fontSize: 17, fontFamily: 'Poppins_500Medium' }}>
                    Don&apos;t have an account? <Link href='/register'><MonoText style={{ textDecorationLine: 'underline', marginLeft: 10, fontWeight: 'bold' }}>Register</MonoText></Link>
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 18,
        fontFamily: 'Poppins_500Medium',
        marginBlock: 12,
    },
    titlecontainer: {
        fontSize: 30,
        fontFamily: "Poppins_600SemiBold",
        marginBlock: 15,
        textAlign: "center",
        paddingBottom: 8,
    },
    content: {
        flex: 1,
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
    input: {
        borderWidth: 1,
        borderColor: "#b5b5b5ff",
        borderRadius: 12,
        padding: 14,
        paddingLeft: 15,
        fontSize: 14,
        paddingRight: 30,
        fontFamily: "Poppins_400Regular",
        backgroundColor: "#fff",
        color: '#000'
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E0E0E0",
        paddingVertical: 14,
        borderRadius: 12,
        paddingHorizontal: 45,
        alignSelf: 'center',
        gap: 8,
        minWidth: 200,
    },
    buttonActive: {
        backgroundColor: "#4CAF50",
    },
    buttonTextcontainer: {
        color: "#fff",
        fontSize: 17,
        fontFamily: "Poppins_600SemiBold",
    },
});

