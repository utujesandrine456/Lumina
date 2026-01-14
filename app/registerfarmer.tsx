import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import ProtectedRoute from '@/components/ProtectedRoute';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function RegisterFarmer() {
    const router = useRouter();
    const { currentUser, addFarmerToCoop } = useDriverStore();

    const [name, setName] = useState('');
    const [crops, setCrops] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = () => {
        console.log("Submit pressed");
        if (!name || !phone || !crops || !location) {
            console.log("Missing fields");
            Alert.alert('Missing Fields', 'Please fill in all required fields.');
            return;
        }

        const coopId = currentUser?.cooperativeId || currentUser?.id;
        console.log("CoopID:", coopId);

        if (!coopId) {
            Alert.alert('Error', 'You must be logged in as a cooperative officer.');
            return;
        }

        try {
            console.log("Adding farmer...");
            addFarmerToCoop(coopId, {
                id: Date.now().toString(),
                cooperativeId: coopId,
                name,
                phone,
                crops: crops.split(',').map(c => ({ id: Math.random().toString(), name: c.trim() })),
                location: location
            });
            console.log("Farmer added, showing success");
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Error adding farmer:", error);
            Alert.alert('Error', 'Failed to register farmer');
        }
    };


    return (
        <ProtectedRoute>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Register Farmer</Text>
                    </View>
                    <View style={styles.placeholderButton} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.form}>
                        <Text style={styles.label}>Farmer Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter farmer name"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Phone Number *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter phone number"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Location *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Musanze, District"
                            value={location}
                            onChangeText={setLocation}
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Crops Type *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Maize, Potatoes, Rice"
                            value={crops}
                            onChangeText={setCrops}
                            placeholderTextColor="#999"
                        />
                        <Text style={styles.helperText}>Separate multiple crops with commas</Text>

                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.9}>
                            <Text style={styles.submitButtonText}>Register Farmer</Text>
                            <Ionicons name="person-add" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>

                {showSuccessModal && (
                    <View style={[StyleSheet.absoluteFill, styles.modalOverlay]}>
                        <Animated.View entering={FadeInDown.springify()} style={styles.modalContent}>
                            <View style={styles.successIcon}>
                                <Ionicons name="checkmark-sharp" size={40} color="#FFF" />
                            </View>
                            <Text style={styles.modalTitle}>Registration Successful!</Text>
                            <Text style={styles.modalMessage}>Farmer {name} has been added to your cooperative list.</Text>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setShowSuccessModal(false);
                                    router.back();
                                }}
                            >
                                <Text style={styles.modalButtonText}>Done</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                )}
            </SafeAreaView>
        </ProtectedRoute>
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
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
        zIndex: 10,
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
    },
    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
        letterSpacing: 0.5,
    },
    form: {
        paddingHorizontal: 24,
        paddingTop: 32,
    },
    label: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#1A1A1A',
        marginBottom: 8,
        marginTop: 16,
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
    },
    helperText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#999',
        marginTop: 6,
        marginLeft: 4,
    },
    submitButton: {
        backgroundColor: '#1A1A1A',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#1A1A1A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
    modalOverlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 32,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#1A1A1A',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalMessage: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    modalButton: {
        backgroundColor: '#1A1A1A',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
});
