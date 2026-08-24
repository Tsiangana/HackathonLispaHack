import { Redirect, Stack } from 'expo-router';

import { AppLoadingScreen } from '@/components/common/AppLoadingScreen';
import { useAuth } from '@/context/AuthContext';

export default function AppLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return <AppLoadingScreen message="A carregar a tua conta..." />;
  }



  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="hospital/[id]" />
      <Stack.Screen name="search" />
      <Stack.Screen name="upgrade" />
    </Stack>
  );
}