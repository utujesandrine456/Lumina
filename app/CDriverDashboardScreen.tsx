import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useDriverStore } from '@/constants/store';

export default function CDriverDashboardScreen() {
  const router = useRouter();
  const currentCooperativeId = useDriverStore((s) => s.currentCooperativeId);
  const drivers = useDriverStore((s) => s.drivers);

  const counts = useMemo(() => {
    const coopDrivers = drivers.filter((d) => d.cooperativeId === currentCooperativeId);
    const availableDrivers = coopDrivers.filter((d) => d.available);
    return {
      total: coopDrivers.length,
      available: availableDrivers.length,
    };
  }, [drivers, currentCooperativeId]);

  const cardStyle = {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  };

  const labelStyle = {
    color: '#FFFFFF',
    opacity: 0.7,
    fontSize: 12,
    marginBottom: 4,
  };

  const valueStyle = {
    color: '#FFFFFF',
    fontSize: 22,
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
            fontSize: 28,
            marginBottom: 8,
          }}
        >
          C-Driver Dashboard
        </Text>
        <Text style={{ color: '#FFFFFF', marginBottom: 24, opacity: 0.7 }}>
          Manage cooperative drivers.
        </Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <View style={[cardStyle, { flex: 1 }]}>
            <Text style={labelStyle}>Driver count</Text>
            <Text style={valueStyle}>{counts.total}</Text>
          </View>
          <View style={[cardStyle, { flex: 1 }]}>
            <Text style={labelStyle}>Available drivers</Text>
            <Text style={valueStyle}>{counts.available}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/AddDriverScreen')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 999,
            paddingVertical: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#000000', fontSize: 16 }}>Add Driver</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


