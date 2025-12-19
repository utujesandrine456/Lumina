import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RegisterFarmer() {
    const router = useRouter();
    const { addFarmer } = useDriverStore();
    
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [crop, setCrop] = useState('');
    const [quantity, setQuantity] = useState('');
    const [harvestDate, setHarvestDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSubmit = () => {
        if (!name || !location || !crop || !quantity) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const farmer = {
            id: Date.now().toString(),
            name,
            location,
            crop,
            quantity: parseFloat(quantity),
            harvestDate: harvestDate.toISOString(),
        };

        addFarmer(farmer);
        Alert.alert('Success', 'Farmer registered successfully!', [
            { text: 'OK', onPress: () => router.back() }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Register Farmer</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Farmer Name *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter farmer name"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Location *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter location"
                        value={location}
                        onChangeText={setLocation}
                    />

                    <Text style={styles.label}>Crop Type *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Maize, Potatoes, Rice"
                        value={crop}
                        onChangeText={setCrop}
                    />

                    <Text style={styles.label}>Quantity (kg) *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter quantity"
                        keyboardType="numeric"
                        value={quantity}
                        onChangeText={setQuantity}
                    />

                    <Text style={styles.label}>Harvest Date *</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={styles.dateText}>
                            {harvestDate.toLocaleDateString()}
                        </Text>
                        <Ionicons name="calendar-outline" size={20} color="#000" />
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={harvestDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) {
                                    setHarvestDate(selectedDate);
                                }
                            }}
                        />
                    )}

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Register Farmer</Text>
                    </TouchableOpacity>
                </View>
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
    dateButton: {
        borderWidth: 1,
        borderColor: '#B5B5B5',
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        color: '#000',
    },
    submitButton: {
        backgroundColor: '#000',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 32,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
});

