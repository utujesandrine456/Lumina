import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useDriverStore } from '@/constants/store';

export default function CFarmerDashboardScreen() {
  const router = useRouter();
  const currentCooperativeId = useDriverStore((s) => s.currentCooperativeId);
  const farmers = useDriverStore((s) => s.farmers);
  const requests = useDriverStore((s) => s.requests);

  const totals = useMemo(() => {
    const coopFarmers = farmers.filter((f) => f.cooperativeId === currentCooperativeId);
    const activeRequests = requests.filter(
      (r) =>
        r.cooperativeId === currentCooperativeId &&
        r.status !== 'completed' &&
        r.status !== 'rejected'
    );
    return {
      farmers: coopFarmers.length,
      activeRequests: activeRequests.length,
    };
  }, [farmers, requests, currentCooperativeId]);

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
          C-Farmer Dashboard
        </Text>
        <Text style={{ color: '#FFFFFF', marginBottom: 24, opacity: 0.7 }}>
          Overview of farmers and active requests.
        </Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <View style={[cardStyle, { flex: 1 }]}>
            <Text style={labelStyle}>Total farmers</Text>
            <Text style={valueStyle}>{totals.farmers}</Text>
          </View>
          <View style={[cardStyle, { flex: 1 }]}>
            <Text style={labelStyle}>Active requests</Text>
            <Text style={valueStyle}>{totals.activeRequests}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/AddFarmerScreen')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 999,
            paddingVertical: 14,
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ color: '#000000', fontSize: 16 }}>Add Farmer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/CreateRequestScreen')}
          style={{
            borderRadius: 999,
            paddingVertical: 14,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#FFFFFF',
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Create Transport Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


