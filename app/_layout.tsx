import { useEffect } from 'react';
import { setCustomText } from 'react-native-global-props';
import {Stack} from 'expo-router';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import {Text, View} from 'react-native';
import {Satisfy_400Regular } from '@expo-google-fonts/satisfy';


export default function Layout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Satisfy_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      const customTextProps = {
        style: { fontFamily: 'Poppins_400Regular' },
      };
      setCustomText(customTextProps);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontFamily: 'Poppins_500Medium' }}>Loading ...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" options={{ title: 'Home' }} />
      <Stack.Screen name="Location" options={{ title: 'Location' }} />
      <Stack.Screen name="crops" options={{ title: 'Crops' }} />
      <Stack.Screen name="trucks" options={{ title: 'Trucks' }} />
      <Stack.Screen name="signup" options={{ title: 'Signup' }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="datetime" options={{ title: 'Date & Time' }} />
    </Stack>
  );
}
