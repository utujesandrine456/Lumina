import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#FFFFFF' },
      tabBarActiveTintColor: '#4CAF50',
      tabBarInactiveTintColor: '#757575',
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="role" options={{ title: 'Role' }} />
      <Tabs.Screen name="login" options={{ title: 'Login' }} />
    </Tabs>
  );
}