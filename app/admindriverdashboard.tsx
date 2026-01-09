import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useDriverStore } from '@/constants/store';
import BottomBar from '@/components/DriverBottomBar';

const { width } = Dimensions.get('window');

export default function AdminDriverDashboard() {
  const router = useRouter();
  const { currentUser, drivers } = useDriverStore();
  const currentCooperativeId = currentUser?.cooperativeId;

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admindriver') {
      router.replace('/login');
    }
  }, [currentUser]);

  const counts = useMemo(() => {
    if (!currentCooperativeId) { return { total: 0, available: 0, offline: 0 } }
    const coopDrivers = drivers.filter((d) => d.cooperativeId === currentCooperativeId);
    const availableDrivers = coopDrivers.filter((d) => d.available);

    return {
      total: coopDrivers.length,
      available: availableDrivers.length,
      offline: coopDrivers.length - availableDrivers.length,
    };
  }, [drivers, currentCooperativeId]);

  const quickActions = [
    { label: "Register Driver", icon: "person-add-outline", route: "/registerdriver" },
    { label: "All Drivers", icon: "people-outline", route: "/driverslist" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome Back,</Text>
            <Text style={styles.userName}>{currentUser?.name || 'Admin Driver'}</Text>
            <Text style={styles.subtitle}>Driver Management</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
            <View style={styles.profileIcon}>
              <Ionicons name="person" size={24} color="#FFF" />
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{counts.total}</Text>
            <Text style={styles.statLabel}>Total Drivers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{counts.available}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{counts.offline}</Text>
            <Text style={styles.statLabel}>Offline</Text>
          </View>
        </Animated.View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <Animated.View key={index} entering={FadeInDown.delay(300 + (index * 50)).springify()} style={styles.actionWrapper}>
              <TouchableOpacity style={styles.actionButton} onPress={() => router.push(action.route as any)}>
                <View style={styles.actionIcon}>
                  <Ionicons name={action.icon as any} size={24} color="#1A1A1A" />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Driver Overview</Text>
        <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.overviewCard}>
          <View style={styles.overviewItem}>
            <View style={styles.overviewIcon}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
            <View style={styles.overviewContent}>
              <Text style={styles.overviewLabel}>Active Drivers</Text>
              <Text style={styles.overviewValue}>{counts.available} online now</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.overviewItem}>
            <View style={styles.overviewIcon}>
              <Ionicons name="time-outline" size={24} color="#FF9800" />
            </View>
            <View style={styles.overviewContent}>
              <Text style={styles.overviewLabel}>Offline Drivers</Text>
              <Text style={styles.overviewValue}>{counts.offline} not available</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
      <BottomBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 100,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  greeting: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#757575',
  },
  userName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    color: '#1A1A1A',
  },
  subtitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  profileButton: {
    padding: 4,
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statsCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#999',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#333',
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#1A1A1A',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  actionWrapper: {
    width: (width - 60) / 2,
  },
  actionButton: {
    backgroundColor: '#FAFAFA',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  actionLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#1A1A1A',
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  overviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  overviewContent: {
    flex: 1,
  },
  overviewLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 2,
  },
  overviewValue: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#757575',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
});
