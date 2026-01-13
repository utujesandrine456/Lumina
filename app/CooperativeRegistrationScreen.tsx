import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useDriverStore } from '@/constants/store';

export default function CooperativeRegistrationScreen() {
  const router = useRouter();
  const registerCooperative = useDriverStore((s) => s.registerCooperative);
  const setCurrentRole = useDriverStore((s) => s.setCurrentRole);

  const [cooperativeName, setCooperativeName] = useState('');
  const [officerFullName, setOfficerFullName] = useState('');
  const [pin, setPin] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [fade] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [fade]);

  const onSubmit = () => {
    if (!cooperativeName || !officerFullName || !pin || !phoneNumber || !location) {
      return;
    }

    const coopId = Date.now().toString();
    registerCooperative({
      id: coopId,
      name: cooperativeName.trim(),
      officerName: officerFullName.trim(),
      pin: pin.trim(),
      phone: phoneNumber.trim(),
      location: location.trim(),
    });
    setCurrentRole('c-farmer');
    router.push({
      pathname: '/PhoneVerificationScreen',
      params: { phoneNumber: phoneNumber.trim() },
    });
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

  const labelStyle = {
    color: '#FFFFFF',
    marginBottom: 6,
    fontSize: 14,
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#000000' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Animated.View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 80,
          opacity: fade,
        }}
      >
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 28,
            marginBottom: 8,
          }}
        >
          Cooperative Registration
        </Text>
        <Text style={{ color: '#FFFFFF', marginBottom: 24, opacity: 0.7 }}>
          Register your cooperative to manage farmers and drivers.
        </Text>

        <View style={{ marginBottom: 16 }}>
          <Text style={labelStyle}>Cooperative Name</Text>
          <TextInput
            style={inputStyle}
            placeholder="Enter cooperative name"
            placeholderTextColor="#777777"
            value={cooperativeName}
            onChangeText={setCooperativeName}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={labelStyle}>Officer Full Name</Text>
          <TextInput
            style={inputStyle}
            placeholder="Enter officer name"
            placeholderTextColor="#777777"
            value={officerFullName}
            onChangeText={setOfficerFullName}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={labelStyle}>PIN (numeric)</Text>
          <TextInput
            style={inputStyle}
            placeholder="****"
            placeholderTextColor="#777777"
            keyboardType="number-pad"
            secureTextEntry
            value={pin}
            onChangeText={setPin}
            maxLength={6}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={labelStyle}>Phone Number</Text>
          <TextInput
            style={inputStyle}
            placeholder="07..."
            placeholderTextColor="#777777"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={labelStyle}>Cooperative Location (District/Sector)</Text>
          <TextInput
            style={inputStyle}
            placeholder="District / Sector"
            placeholderTextColor="#777777"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <TouchableOpacity
          onPress={onSubmit}
          activeOpacity={0.8}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 999,
            paddingVertical: 14,
            alignItems: 'center',
            transform: [{ scale: 1 }],
          }}
        >
          <Text
            style={{
              color: '#000000',
              fontSize: 16,
            }}
          >
            Submit &amp; Send OTP
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}


