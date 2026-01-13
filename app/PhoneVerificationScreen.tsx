import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

export default function PhoneVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phoneNumber?: string }>();
  const setCurrentRole = useDriverStore((s) => s.setCurrentRole);

  const [otp, setOtp] = useState('');
  const [fade] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [fade]);

  const verifyAndGo = (role: 'c-farmer' | 'c-driver') => {
    if (!otp) return;
    setCurrentRole(role);
    if (role === 'c-farmer') {
      router.replace('/CFarmerDashboardScreen');
    } else {
      router.replace('/CDriverDashboardScreen');
    }
  };

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
    marginBottom: 20,
    letterSpacing: 4,
    textAlign: 'center' as const,
    fontSize: 18,
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
          Phone Verification
        </Text>
        <Text style={{ color: '#FFFFFF', marginBottom: 24, opacity: 0.7 }}>
          Enter the OTP sent to {params.phoneNumber || 'your phone'}.
        </Text>

        <Text style={labelStyle}>OTP Code</Text>
        <TextInput
          style={inputStyle}
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
          placeholder="••••••"
          placeholderTextColor="#777777"
        />

        <Text style={[labelStyle, { marginTop: 8, marginBottom: 16 }]}>
          I manage:
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => verifyAndGo('c-farmer')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 999,
            paddingVertical: 14,
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ color: '#000000', fontSize: 16 }}>I manage Farmers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => verifyAndGo('c-driver')}
          style={{
            borderRadius: 999,
            paddingVertical: 14,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#FFFFFF',
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16 }}>I manage Drivers</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}


