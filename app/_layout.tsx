import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text } from 'react-native';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Satisfy_400Regular } from '@expo-google-fonts/satisfy';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Satisfy_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="CooperativeRegistrationScreen" />
        <Stack.Screen name="PhoneVerificationScreen" />
        <Stack.Screen name="CFarmerDashboardScreen" />
        <Stack.Screen name="AddFarmerScreen" />
        <Stack.Screen name="FarmerListScreen" />
        <Stack.Screen name="CreateRequestScreen" />
        <Stack.Screen name="ChatScreen" />
        <Stack.Screen name="CDriverDashboardScreen" />
        <Stack.Screen name="driverdashboard" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="deliveryconfirmation" />
      </Stack>
    </>
  );
}
