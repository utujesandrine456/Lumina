import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
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

export default function CreateRequestScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ farmerId?: string }>();

  const currentCooperativeId = useAppStore((s) => s.currentCooperativeId);
  const farmers = useAppStore((s) => s.farmers);
  const addRequest = useAppStore((s) => s.addRequest);

  const [farmerId, setFarmerId] = useState(params.farmerId || '');
  const [cropType, setCropType] = useState('');
  const [quantityKg, setQuantityKg] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupDate, setPickupDate] = useState('');

  const farmerOptions = useMemo(
    () => farmers.filter((f) => f.cooperativeId === currentCooperativeId),
    [farmers, currentCooperativeId]
  );

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

  const onSubmit = () => {
    if (
      !currentCooperativeId ||
      !farmerId ||
      !cropType ||
      !quantityKg ||
      !destination ||
      !pickupDate
    ) {
      return;
    }

    addRequest({
      id: Date.now().toString(),
      cooperativeId: currentCooperativeId,
      farmerId,
      cropType: cropType.trim(),
      quantityKg: Number(quantityKg),
      destination: destination.trim(),
      pickupDate: pickupDate.trim(),
      status: 'pending',
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
          Create Transport Request
        </Text>
        <Text style={{ color: '#FFFFFF', marginBottom: 24, opacity: 0.7 }}>
          Submit a new request and notify nearby drivers.
        </Text>

        <Text style={labelStyle}>Select Farmer</Text>
        <View
          style={[
            inputStyle,
            {
              paddingVertical: 0,
              borderRadius: 12,
            },
          ]}
        >
          {farmerOptions.map((farmer) => {
            const selected = farmer.id === farmerId;
            return (
              <TouchableOpacity
                key={farmer.id}
                onPress={() => setFarmerId(farmer.id)}
                style={{
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: '#222222',
                }}
              >
                <Text
                  style={{
                    color: selected ? '#000000' : '#FFFFFF',
                    backgroundColor: selected ? '#FFFFFF' : 'transparent',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 999,
                  }}
                >
                  {farmer.fullName}
                </Text>
              </TouchableOpacity>
            );
          })}
          {farmerOptions.length === 0 && (
            <Text style={{ color: '#777777', paddingVertical: 10 }}>
              No farmers yet. Add a farmer first.
            </Text>
          )}
        </View>

        <Text style={[labelStyle, { marginTop: 16 }]}>Crop Type</Text>
        <TextInput
          style={inputStyle}
          placeholder="e.g. maize"
          placeholderTextColor="#777777"
          value={cropType}
          onChangeText={setCropType}
        />

        <Text style={labelStyle}>Quantity Harvested (kg)</Text>
        <TextInput
          style={inputStyle}
          placeholder="e.g. 500"
          placeholderTextColor="#777777"
          keyboardType="numeric"
          value={quantityKg}
          onChangeText={setQuantityKg}
        />

        <Text style={labelStyle}>Destination Location</Text>
        <TextInput
          style={inputStyle}
          placeholder="Enter destination"
          placeholderTextColor="#777777"
          value={destination}
          onChangeText={setDestination}
        />

        <Text style={labelStyle}>Pickup Date</Text>
        <TextInput
          style={inputStyle}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#777777"
          value={pickupDate}
          onChangeText={setPickupDate}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onSubmit}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 999,
            paddingVertical: 14,
            alignItems: 'center',
            marginTop: 16,
          }}
        >
          <Text style={{ color: '#000000', fontSize: 16 }}>Submit Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


