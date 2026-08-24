import { Redirect, Stack } from 'expo-router';

import { AppLoadingScreen } from '@/components/common/AppLoadingScreen';
import { useAuth } from '@/context/AuthContext';

export default function AuthLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return <AppLoadingScreen message="A verificar sessão..." />;
  }

  if (session) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}