import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore, TransportRequest, Driver } from '@/constants/store';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function BookDriver() {
  const router = useRouter();
  const { driverId } = useLocalSearchParams<{ driverId: string }>();
  const { drivers, requests, updateRequest, updateDriver } = useDriverStore();

  const driver: Driver | undefined = drivers.find(d => d.id === driverId);
  const [pickupTime, setPickupTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  if (!driver) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Driver Not Found</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>
    );
  }

  const handleBook = () => {
    const pendingRequest = requests
      .filter((r: TransportRequest) => r.status === 'pending')
      .sort(
        (a: TransportRequest, b: TransportRequest) =>
          new Date(b.bookingTime ?? 0).getTime() - new Date(a.bookingTime ?? 0).getTime()
      )[0];

    if (!pendingRequest) {
      Alert.alert('Error', 'No pending request found');
      return;
    }

updateRequest(pendingRequest.id, {
  driverId: driver.id,
  status: 'accepted',
  acceptedAt: new Date().toISOString(),
  priceLocked: true,
  chatOpen: true,
  chat: [
    ...((pendingRequest.chat ?? []) as {
      id: string;
      sender: string;
      text: string;
      timestamp: string;
    }[]),
    {
      id: `${Date.now()}`,
      sender: 'adminfarmer',
      text: 'Driver accepted. Chat is now open for coordination.',
      timestamp: new Date().toISOString(),
    },
  ],
});




    updateDriver(driver.id, { available: false });

    Alert.alert('Success', 'Driver booked successfully!', [
      { text: 'OK', onPress: () => router.push('/trips') },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Book Driver</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.driverCard}>
          <View style={styles.driverHeader}>
            <Ionicons name="person-circle" size={64} color="#000" />
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <Text style={styles.plateNumber}>{driver.plateNumber}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={20} color="#000" />
                <Text style={styles.rating}>{driver.rating?.toFixed(1) ?? '0.0'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Ionicons name="cube-outline" size={20} color="#000" />
              <Text style={styles.detailText}>Capacity: {driver.capacity ?? 0} kg</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#000" />
              <Text style={styles.detailText}>
                {driver.verified ? 'Verified Driver' : 'Unverified'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Pickup Time</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.timeText}>
              {pickupTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Ionicons name="time-outline" size={20} color="#000" />
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={pickupTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) setPickupTime(selectedTime);
              }}
            />
          )}

          <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
            <Text style={styles.bookButtonText}>Confirm Booking</Text>
            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
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
    driverCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        margin: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    driverHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    driverInfo: {
        marginLeft: 16,
        flex: 1,
    },
    driverName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#000',
        marginBottom: 4,
    },
    plateNumber: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rating: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 18,
        color: '#000',
    },
    details: {
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#000',
    },
    form: {
        paddingHorizontal: 20,
    },
    label: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#000',
        marginBottom: 8,
    },
    timeButton: {
        borderWidth: 1,
        borderColor: '#B5B5B5',
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    timeText: {
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        color: '#000',
    },
    bookButton: {
        backgroundColor: '#000',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    bookButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
});

