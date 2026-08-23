import { router } from 'expo-router';
import { MapPin, Navigation, X } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MapLoadingOverlayProps {
  message?: string;
  submessage?: string;
  onCancel?: () => void;
}

export function MapLoadingOverlay({
  message = 'A procurar unidades próximas',
  submessage = 'Localizando hospitais e clínicas na sua área e calculando o tempo de rota...',
  onCancel,
}: MapLoadingOverlayProps) {
  const pulseAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.85,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(app)/(tabs)');
    }
  };

  return (
    <View className="absolute inset-0 z-[9999] bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView className="flex-1">
        {/* ── Top bar with cancel ── */}
        <View className="flex-row items-center justify-between px-5 pt-3 pb-2">
          <View />
          <TouchableOpacity
            onPress={handleCancel}
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center active:bg-slate-200"
          >
            <X size={18} color="#1E293B" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* ── Content ── */}
        <View className="flex-1 items-center justify-center px-8 pb-20">
          {/* Pulsing icon */}
          <View className="items-center justify-center mb-10">
            <Animated.View
              style={{ transform: [{ scale: pulseAnim }] }}
              className="w-24 h-24 items-center justify-center"
            >
              <View className="w-16 h-16 rounded-full items-center justify-center">
                <Navigation size={30} color="#D9232E" strokeWidth={2.2} />
              </View>
            </Animated.View>
          </View>

          {/* Title */}
          <Text className="text-2xl font-nunito-extrabold text-slate-900 text-center mb-3 leading-8">
            {message}
          </Text>

          {/* Subtitle */}
          <Text className="text-sm font-nunito text-slate-500 text-center leading-6 mb-10 px-4">
            {submessage}
          </Text>

          {/* Status indicator */}
          <View className="flex-row items-center gap-2 px-5 py-3 rounded-2xl">
            <ActivityIndicator size="small" color="#D9232E" />
            <View className="flex-row items-center gap-1.5">
              <MapPin size={12} color="#94A3B8" strokeWidth={2} />
              <Text className="text-xs font-nunito-bold text-slate-500">
                GPS Ativo • Luanda, Angola
              </Text>
            </View>
          </View>
        </View>

        {/* ── Cancel button at bottom ── */}
        <View className="px-5 pb-8">
          <Pressable
            onPress={handleCancel}
            className="h-14 rounded-2xl bg-slate-100 items-center justify-center border border-slate-200 active:bg-slate-200"
          >
            <Text className="text-base font-nunito-extrabold text-slate-700">
              Cancelar
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
