import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';

const CROP_TYPES = ['Maize', 'Potatoes', 'Rice', 'Beans', 'Cassava', 'Sweet Potatoes', 'Wheat', 'Sorghum'];

export default function FarmerRegistration() {
    const router = useRouter();
    const { addFarmer, setCurrentUser } = useDriverStore();
    
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [village, setVillage] = useState('');
    const [selectedCrops, setSelectedCrops] = useState<string[]>([]);

    const toggleCrop = (crop: string) => {
        setSelectedCrops(prev => 
            prev.includes(crop) 
                ? prev.filter(c => c !== crop)
                : [...prev, crop]
        );
    };

    const handleSubmit = () => {
        if (!name || !phone || !village) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (selectedCrops.length === 0) {
            Alert.alert('Error', 'Please select at least one crop type');
            return;
        }

        const farmer = {
            id: `farmer-${Date.now()}`,
            name,
            phone,
            village,
            crops: selectedCrops,
            registeredAt: new Date().toISOString(),
        };

        addFarmer(farmer);
        setCurrentUser({ id: farmer.id, name, phone, role: 'farmer' });
        
        Alert.alert('Success', 'Farmer registered successfully!', [
            { text: 'OK', onPress: () => router.push('/farmerprofile') }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Farmer Registration</Text>
                    <View style={{ width: 24 }} />
                </View>

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.form}>
                    <Text style={styles.label}>Name *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your full name"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Phone Number *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter phone number"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />

                    <Text style={styles.label}>Village / Cell *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter village or cell"
                        value={village}
                        onChangeText={setVillage}
                    />

                    <Text style={styles.label}>Crop Types * (Select all that apply)</Text>
                    <View style={styles.cropsContainer}>
                        {CROP_TYPES.map((crop, index) => {
                            const isSelected = selectedCrops.includes(crop);
                            return (
                                <Animated.View
                                    key={crop}
                                    entering={SlideInRight.delay(300 + index * 50).springify()}
                                >
                                    <TouchableOpacity
                                        style={[styles.cropChip, isSelected && styles.cropChipSelected]}
                                        onPress={() => toggleCrop(crop)}
                                    >
                                        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                                            {isSelected && <Ionicons name="checkmark" size={16} color="#FFF" />}
                                        </View>
                                        <Text style={[styles.cropText, isSelected && styles.cropTextSelected]}>
                                            {crop}
                                        </Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            );
                        })}
                    </View>

                    <TouchableOpacity 
                        style={[styles.submitButton, selectedCrops.length > 0 && styles.submitButtonActive]} 
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>Register</Text>
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
    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#000',
    },
    form: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    label: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#000',
        marginBottom: 8,
        marginTop: 16,
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
    cropsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 12,
    },
    cropChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#FFF',
        gap: 8,
    },
    cropChipSelected: {
        borderColor: '#000',
        backgroundColor: '#F5F5F5',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    cropText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
    },
    cropTextSelected: {
        fontFamily: 'Poppins_500Medium',
        color: '#000',
    },
    submitButton: {
        backgroundColor: '#E0E0E0',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    submitButtonActive: {
        backgroundColor: '#000',
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
});

