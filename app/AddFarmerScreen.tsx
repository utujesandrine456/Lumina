import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDriverStore } from '@/constants/store';

export default function AddFarmerScreen() {
  const router = useRouter();
  const addFarmer = useDriverStore((s) => s.addFarmer);
  const currentCooperativeId = useDriverStore((s) => s.currentCooperativeId);

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cropTypes, setCropTypes] = useState('');

  const labelStyle = {
    color: '#FFFFFF',
    marginBottom: 6,
    fontSize: 14,
  };

  const inputStyle = {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    marginBottom: 14,
  };

  const onSave = () => {
    if (!currentCooperativeId) return;
    if (!fullName || !phoneNumber || !cropTypes) return;

    addFarmer({
      id: Date.now().toString(),
      cooperativeId: currentCooperativeId,
      fullName: fullName.trim(),
      phone: phoneNumber.trim(),
      cropTypes: cropTypes.trim(),
    });

    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#000000' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 80,
          paddingBottom: 40,
        }}
      >
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 24,
            marginBottom: 8,
          }}
        >
          Add Farmer
        </Text>
        <Text style={{ color: '#FFFFFF', marginBottom: 24, opacity: 0.7 }}>
          Register a farmer under this cooperative.
        </Text>

        <Text style={labelStyle}>Farmer Full Name</Text>
        <TextInput
          style={inputStyle}
          placeholder="Enter full name"
          placeholderTextColor="#777777"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={labelStyle}>Phone Number</Text>
        <TextInput
          style={inputStyle}
          placeholder="07..."
          placeholderTextColor="#777777"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <Text style={labelStyle}>Crop Types</Text>
        <TextInput
          style={[inputStyle, { height: 80, textAlignVertical: 'top' as const }]}
          placeholder="e.g. maize, beans"
          placeholderTextColor="#777777"
          multiline
          value={cropTypes}
          onChangeText={setCropTypes}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onSave}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 999,
            paddingVertical: 14,
            alignItems: 'center',
            marginTop: 16,
          }}
        >
          <Text style={{ color: '#000000', fontSize: 16 }}>Save Farmer</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


