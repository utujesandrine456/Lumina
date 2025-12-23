import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Satisfy_400Regular } from '@expo-google-fonts/satisfy';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Satisfy_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);


  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'Poppins_500Medium' }}>Loading app...</Text>
      </View>
    );
  }


  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
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
        <Stack.Screen name="help" />
      </Stack>
    </>
  );
}
