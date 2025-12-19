import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import { getCurrentCoordinates } from '@/utils/getLocation';
import * as ImagePicker from 'expo-image-picker';
import { TextInput } from 'react-native';
import Animated, { FadeInDown, BounceIn } from 'react-native-reanimated';

export default function PickupConfirmation() {
    const router = useRouter();
    const { tripId } = useLocalSearchParams<{ tripId: string }>();
    const { trips, updateTrip } = useDriverStore();
    
    const trip = trips.find(t => t.id === tripId);
    const [photo, setPhoto] = useState<string | null>(null);
    const [weight, setWeight] = useState('');

    if (!trip) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Trip Not Found</Text>
                    <View style={{ width: 24 }} />
                </View>
            </SafeAreaView>
        );
    }

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need camera roll permissions to upload photos');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setPhoto(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need camera permissions to take photos');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setPhoto(result.assets[0].uri);
        }
    };

    const handleConfirm = async () => {
        if (!photo) {
            Alert.alert('Error', 'Please upload a pickup photo');
            return;
        }

        if (!weight) {
            Alert.alert('Error', 'Please confirm the weight');
            return;
        }

        const coords = await getCurrentCoordinates();
        if (!coords) {
            return;
        }

        updateTrip(tripId, {
            pickupPhoto: photo,
            pickupWeight: parseFloat(weight),
            pickupTimestamp: new Date().toISOString(),
            pickupGPS: coords,
            status: 'in-transit',
        });

        Alert.alert('Success', 'Pickup confirmed!', [
            { text: 'OK', onPress: () => router.push('/trips') }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Confirm Pickup</Text>
                    <View style={{ width: 24 }} />
                </View>

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.content}>
                    <View style={styles.tripInfo}>
                        <Text style={styles.tripRoute}>
                            {trip.pickupLocation} → {trip.destination}
                        </Text>
                        <Text style={styles.tripDetails}>
                            {trip.cropType} • {trip.totalWeight} kg
                        </Text>
                    </View>

                    <Text style={styles.sectionTitle}>Upload Pickup Photo *</Text>
                    {photo ? (
                        <Animated.View entering={BounceIn.springify()} style={styles.photoContainer}>
                            <Image source={{ uri: photo }} style={styles.photo} />
                            <TouchableOpacity
                                style={styles.removePhotoButton}
                                onPress={() => setPhoto(null)}
                            >
                                <Ionicons name="close-circle" size={24} color="#000" />
                            </TouchableOpacity>
                        </Animated.View>
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <Ionicons name="camera-outline" size={48} color="#BDBDBD" />
                            <Text style={styles.photoPlaceholderText}>No photo selected</Text>
                            <View style={styles.photoButtons}>
                                <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                                    <Ionicons name="camera" size={20} color="#000" />
                                    <Text style={styles.photoButtonText}>Take Photo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                                    <Ionicons name="image-outline" size={20} color="#000" />
                                    <Text style={styles.photoButtonText}>Choose from Gallery</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <Text style={styles.sectionTitle}>Confirm Weight (kg) *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter confirmed weight"
                        keyboardType="numeric"
                        value={weight}
                        onChangeText={setWeight}
                    />
                    {trip.totalWeight && (
                        <Text style={styles.expectedWeight}>
                            Expected: {trip.totalWeight} kg
                        </Text>
                    )}

                    <TouchableOpacity
                        style={[styles.confirmButton, photo && weight && styles.confirmButtonActive]}
                        onPress={handleConfirm}
                        disabled={!photo || !weight}
                    >
                        <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                        <Text style={styles.confirmButtonText}>Confirm Pickup</Text>
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
        paddingBottom: 30,
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
        fontSize: 20,
        color: '#000',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    tripInfo: {
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    tripRoute: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#000',
        marginBottom: 4,
    },
    tripDetails: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#000',
        marginBottom: 12,
        marginTop: 16,
    },
    photoContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    photo: {
        width: '100%',
        height: 300,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
    },
    removePhotoButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#FFF',
        borderRadius: 20,
    },
    photoPlaceholder: {
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 40,
        alignItems: 'center',
        marginBottom: 16,
    },
    photoPlaceholderText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        marginTop: 12,
        marginBottom: 20,
    },
    photoButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    photoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#000',
    },
    photoButtonText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#000',
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
        marginBottom: 8,
    },
    expectedWeight: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
        marginBottom: 16,
    },
    confirmButton: {
        backgroundColor: '#E0E0E0',
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 24,
    },
    confirmButtonActive: {
        backgroundColor: '#000',
    },
    confirmButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
});

