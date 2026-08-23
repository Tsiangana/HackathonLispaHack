import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/context/AuthContext';

export default function AppLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return null;
  }



  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="hospital/[id]" />
      <Stack.Screen name="search" />
    </Stack>
  );
}