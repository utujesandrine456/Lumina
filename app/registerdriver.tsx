import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import * as Location from 'expo-location';

export default function RegisterDriver() {
  const router = useRouter();
  const { addDriver, currentUser } = useDriverStore();

  const canVerifyNow = currentUser?.role === 'admin';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [useGps, setUseGps] = useState(true);
  const [verified, setVerified] = useState(canVerifyNow);

  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | undefined>(undefined);

  const pickupRoleLabel = useMemo(() => {
    if (currentUser?.role === 'admin') return 'Admin';
    if (currentUser?.role === 'adminfarmer') return 'Cooperative Officer';
    return 'User';
  }, [currentUser?.role]);

  const setGpsLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to set GPS location.');
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setCoords({ latitude: location.coords.latitude, longitude: location.coords.longitude });
  };

  const handleSubmit = async () => {
    if (!name || !phone || !pin || !plateNumber || !capacity || !idNumber || !licenseNumber) {
      Alert.alert('Missing Info', 'Please fill in all required fields, including PIN.');
      return;
    }

    if (pin.length !== 4) {
      Alert.alert('Invalid PIN', 'PIN must be exactly 4 digits.');
      return;
    }

    let coordinates = coords;
    if (useGps && !coordinates) {
      try {
        await setGpsLocation();
        coordinates = coords;
      } catch {
        // ignore
      }
    }

    const driver = {
      id: `drv-${Date.now()}`,
      name,
      phone,
      pin,
      idNumber,
      licenseNumber,
      plateNumber,
      capacity: Number(capacity) || 0,
      rating: 0,
      availability: true,
      verified: canVerifyNow ? verified : false,
      coordinates: coordinates,
    };

    addDriver(driver as any);
    addDriver(driver as any);

    if (canVerifyNow && verified) {
      Alert.alert('Success', 'Driver registered and verified!', [{ text: 'OK', onPress: () => router.back() }]);
    } else {
      router.push('/driververification');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Register Driver</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.form}>
          <Text style={styles.helperText}>
            Registered by: {pickupRoleLabel}. Drivers become bookable once verified.
          </Text>

          <Text style={styles.label}>Driver Name *</Text>
          <TextInput style={styles.input} placeholder="Enter driver name" value={name} onChangeText={setName} />

          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.label}>Access PIN (4 digits) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Set a 4-digit PIN"
            keyboardType="numeric"
            value={pin}
            onChangeText={setPin}
            maxLength={4}
            secureTextEntry
          />

          <Text style={styles.label}>National ID / Passport *</Text>
          <TextInput style={styles.input} placeholder="Enter National ID or Passport" value={idNumber} onChangeText={setIdNumber} />

          <Text style={styles.label}>Driving License Number *</Text>
          <TextInput style={styles.input} placeholder="Enter License Number" value={licenseNumber} onChangeText={setLicenseNumber} />

          <Text style={styles.label}>Plate Number *</Text>
          <TextInput style={styles.input} placeholder="Enter plate number" value={plateNumber} onChangeText={setPlateNumber} />

          <Text style={styles.label}>Truck Capacity (kg) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 1500"
            keyboardType="numeric"
            value={capacity}
            onChangeText={setCapacity}
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Use GPS location</Text>
            <Switch value={useGps} onValueChange={setUseGps} trackColor={{ false: '#BDBDBD', true: '#000' }} />
          </View>

          {canVerifyNow ? (
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Mark as verified (Admin only)</Text>
              <Switch value={verified} onValueChange={setVerified} trackColor={{ false: '#BDBDBD', true: '#000' }} />
            </View>
          ) : null}

          <TouchableOpacity style={styles.secondaryButton} onPress={setGpsLocation}>
            <Ionicons name="location-outline" size={18} color="#000" />
            <Text style={styles.secondaryButtonText}>{coords ? 'Update GPS Location' : 'Set GPS Location'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Register Driver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 30 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: { fontFamily: 'Poppins_600SemiBold', fontSize: 20, color: '#000' },
  form: { paddingHorizontal: 20, paddingTop: 18 },
  helperText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#757575',
    marginBottom: 12,
  },
  label: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
    marginTop: 14,
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingVertical: 8,
  },
  switchLabel: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: '#000' },
  secondaryButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: { fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: '#000' },
  submitButton: {
    marginTop: 18,
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: { color: '#FFF', fontSize: 16, fontFamily: 'Poppins_600SemiBold' },
});


