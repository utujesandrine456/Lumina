import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function DriverVerification() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconCircle}>
                    <Ionicons name="shield-checkmark-outline" size={64} color="#000" />
                </View>

                <Text style={styles.title}>Verification Pending</Text>
                <Text style={styles.subtitle}>
                    Your driver profile has been created successfully and is pending verification by the administrator.
                </Text>

                <View style={styles.infoBox}>
                    <Ionicons name="time-outline" size={24} color="#666" />
                    <Text style={styles.infoText}>This process usually takes 24-48 hours.</Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/')} // Go back to Home/Login
                >
                    <Text style={styles.buttonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    iconCircle: {
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
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#FAFAFA',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        marginBottom: 40,
    },
    infoText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#444',
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'Poppins_600SemiBold',
        color: '#FFF',
        fontSize: 16,
    },
});
