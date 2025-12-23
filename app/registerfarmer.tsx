import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';


export default function RegisterFarmer() {
    const router = useRouter();
    const { addFarmer } = useDriverStore();
    
    const [name, setName] = useState('');
    const [crops, setCrops] = useState('');
    const [phone, setPhone] = useState('');


    const handleSubmit = () => {
        addFarmer({
            id: Date.now().toString(),
            name,
            phone,
            crops,
        });
        
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

                    <Text style={styles.label}>Phone Number *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter farmer name"
                        value={phone}
                        onChangeText={setPhone}
                    />

                    <Text style={styles.label}>Crops Type *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Maize, Potatoes, Rice"
                        value={crops}
                        onChangeText={setCrops}
                    />

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

