import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useDriverStore } from '@/constants/store';
import { Ionicons } from '@expo/vector-icons';



export default function AdminDriverDashboard() {
  const router = useRouter();
  const currentUser = useDriverStore((s) => s.currentUser);
  const drivers = useDriverStore((s) => s.drivers);
  const currentCooperativeId = currentUser?.cooperativeId;

  const counts = useMemo(() => {
    if (!currentCooperativeId) { return { total: 0, available: 0 } }
    const coopDrivers = drivers.filter((d) => d.cooperativeId === currentCooperativeId);
    const availableDrivers = coopDrivers.filter((d) => d.available);

    return {
      total: coopDrivers.length,
      available: availableDrivers.length,
    };
  }, [drivers, currentCooperativeId]);



  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 80, paddingBottom: 40 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 28, marginBottom: 8, fontFamily: 'Poppins_600SemiBold' }}>C-Driver Dashboard</Text>
        <Text style={{ color: '#FFFFFF', marginBottom: 24, opacity: 0.7, fontFamily: 'Poppins_400Regular' }}>Manage cooperative drivers.</Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <View style={[styles.card, { flex: 1 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={styles.label}>Total Drivers</Text>
              <Ionicons name="car-sport-outline" size={20} color="#666" />
            </View>
            <Text style={styles.value}>{counts.total}</Text>
          </View>
          <View style={[styles.card, { flex: 1 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={styles.label}>Available</Text>
              <Ionicons name="checkmark-circle-outline" size={20} color="#666" />
            </View>
            <Text style={styles.value}>{counts.available}</Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/registerdriver')} style={styles.actionButton}>
            <View style={styles.iconCircle}>
              <Ionicons name="add" size={24} color="#000" />
            </View>
            <View>
              <Text style={styles.actionTitle}>Register Driver</Text>
              <Text style={styles.actionSubtitle}>Onboard a new driver</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFF" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/driverslist')} style={[styles.actionButton, styles.actionButtonSecondary]}>
            <View style={[styles.iconCircle, { backgroundColor: '#333' }]}>
              <Ionicons name="list" size={24} color="#FFF" />
            </View>
            <View>
              <Text style={styles.actionTitle}>Manage Drivers</Text>
              <Text style={styles.actionSubtitle}>View and edit drivers</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFF" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    backgroundColor: '#1A1A1A',
    padding: 20,
    marginBottom: 16,
  },
  label: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    marginBottom: 8,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
  },
  actionContainer: {
    marginTop: 10,
    gap: 16,
  },
  actionButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButtonSecondary: {
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: 'transparent',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
  actionSubtitle: {
    color: '#999',
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
  },
});


