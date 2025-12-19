import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useDriverStore } from '@/constants/store';

export default function FarmerListScreen() {
  const router = useRouter();
  const currentCooperativeId = useDriverStore((s) => s.currentCooperativeId);
  const farmers = useDriverStore((s) => s.farmers);
  const [query, setQuery] = useState('');

  const filteredFarmers = useMemo(
    () =>
      farmers.filter(
        (f) =>
          f.cooperativeId === currentCooperativeId &&
          (f.fullName.toLowerCase().includes(query.toLowerCase()) ||
            f.phone.includes(query))
      ),
    [farmers, currentCooperativeId, query]
  );

  const cardStyle = {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    padding: 14,
    marginBottom: 12,
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
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
          Farmers
        </Text>
        <Text style={{ color: '#FFFFFF', marginBottom: 16, opacity: 0.7 }}>
          Select a farmer to create a transport request.
        </Text>

        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#FFFFFF',
            borderRadius: 999,
            paddingHorizontal: 16,
            paddingVertical: 10,
            color: '#FFFFFF',
            marginBottom: 20,
          }}
          placeholder="Search by name or phone"
          placeholderTextColor="#777777"
          value={query}
          onChangeText={setQuery}
        />

        {filteredFarmers.map((farmer) => (
          <TouchableOpacity
            key={farmer.id}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: '/CreateRequestScreen',
                params: { farmerId: farmer.id },
              })
            }
            style={cardStyle}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, marginBottom: 2 }}>
              {farmer.fullName}
            </Text>
            <Text style={{ color: '#FFFFFF', opacity: 0.7, marginBottom: 4 }}>
              {farmer.phone}
            </Text>
            <Text style={{ color: '#FFFFFF', opacity: 0.7, fontSize: 12 }}>
              Crops: {farmer.cropTypes || '-'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}


