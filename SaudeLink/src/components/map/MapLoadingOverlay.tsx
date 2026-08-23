import { MapPin, Navigation } from 'lucide-react-native';
import { ActivityIndicator, Animated, Text, View } from 'react-native';
import { useEffect, useRef } from 'react';

interface MapLoadingOverlayProps {
  message?: string;
  submessage?: string;
}

export function MapLoadingOverlay({
  message = 'A carregar pontos do mapa...',
  submessage = 'Calculando rotas, distâncias e unidades mais próximas',
}: MapLoadingOverlayProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <View className="absolute inset-0 bg-slate-900/40 backdrop-blur-md z-50 items-center justify-center p-5">
      <View className="bg-white rounded-3xl p-6 w-full max-w-xs items-center shadow-2xl border border-slate-100/90">
        {/* Pulsing Icon Badge */}
        <Animated.View
          style={{ transform: [{ scale: pulseAnim }] }}
          className="w-16 h-16 rounded-3xl bg-brand-red/10 items-center justify-center mb-4 border border-brand-red/20"
        >
          <Navigation size={26} color="#D9232E" strokeWidth={2.2} />
        </Animated.View>

        {/* Loading Spinner */}
        <View className="flex-row items-center gap-2 mb-2">
          <ActivityIndicator size="small" color="#D9232E" />
          <Text className="text-base font-nunito-extrabold text-slate-900 text-center">
            {message}
          </Text>
        </View>

        {/* Subtitle */}
        <Text className="text-xs font-nunito text-slate-500 text-center mb-4 leading-4 px-2">
          {submessage}
        </Text>

        {/* Status Tag */}
        <View className="flex-row items-center justify-center gap-1.5 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200/60">
          <MapPin size={12} color="#D9232E" strokeWidth={2.5} />
          <Text className="text-[11px] font-nunito-extrabold text-slate-700">
            Processando Geolocalização
          </Text>
        </View>
      </View>
    </View>
  );
}
