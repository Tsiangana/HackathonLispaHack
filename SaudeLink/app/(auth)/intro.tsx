import { router } from 'expo-router';
import {
  Activity,
  Heart,
  HeartPulse,
  Hospital,
  Pill,
  Stethoscope,
  Thermometer,
} from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 7-Bubble configuration with comfortable spacing matching the reference image:
// 1. Center (Yellow), 2. Top (Blue), 3. Top-Right (Teal), 4. Right (Peach), 5. Bottom (Green), 6. Bottom-Left (Pink), 7. Left (Red)
const BUBBLES = [
  // 1. Center Yellow
  {
    Icon: HeartPulse,
    top: 125,
    left: 130,
    size: 100,
    haloSize: 124,
    bg: '#FEF9C3',
    haloBg: 'rgba(254, 249, 195, 0.45)',
    iconColor: '#D97706',
    iconSize: 44,
  },
  // 2. Top Blue
  {
    Icon: Stethoscope,
    top: 18,
    left: 115,
    size: 80,
    haloSize: 98,
    bg: '#E0F2FE',
    haloBg: 'rgba(224, 242, 254, 0.45)',
    iconColor: '#2196C7',
    iconSize: 34,
  },
  // 3. Top-Right Teal
  {
    Icon: Hospital,
    top: 60,
    left: 245,
    size: 68,
    haloSize: 84,
    bg: '#DCFCE7',
    haloBg: 'rgba(220, 252, 231, 0.45)',
    iconColor: '#16A34A',
    iconSize: 28,
  },
  // 4. Right Peach
  {
    Icon: Thermometer,
    top: 180,
    left: 255,
    size: 72,
    haloSize: 88,
    bg: '#FFEDD5',
    haloBg: 'rgba(255, 237, 213, 0.45)',
    iconColor: '#EA580C',
    iconSize: 30,
  },
  // 5. Bottom Green
  {
    Icon: Activity,
    top: 265,
    left: 150,
    size: 60,
    haloSize: 74,
    bg: '#F0FDF4',
    haloBg: 'rgba(240, 253, 244, 0.45)',
    iconColor: '#15803D',
    iconSize: 24,
  },
  // 6. Bottom-Left Pink
  {
    Icon: Heart,
    top: 230,
    left: 60,
    size: 48,
    haloSize: 60,
    bg: '#FCE7F3',
    haloBg: 'rgba(252, 231, 243, 0.45)',
    iconColor: '#DB2777',
    iconSize: 20,
  },
  // 7. Left Light-Red
  {
    Icon: Pill,
    top: 135,
    left: 35,
    size: 52,
    haloSize: 64,
    bg: '#FEE2E2',
    haloBg: 'rgba(254, 226, 226, 0.45)',
    iconColor: '#D9232E',
    iconSize: 22,
  },
];

function FloatingBubble({
  Icon,
  top,
  left,
  size,
  haloSize,
  bg,
  haloBg,
  iconColor,
  iconSize,
}: (typeof BUBBLES)[0]) {
  const haloOffset = (haloSize - size) / 2;
  return (
    <View style={{ position: 'absolute', top, left }}>
      {/* Outer soft halo glow ring */}
      <View
        style={{
          position: 'absolute',
          top: -haloOffset,
          left: -haloOffset,
          width: haloSize,
          height: haloSize,
          borderRadius: haloSize / 2,
          backgroundColor: haloBg,
        }}
      />
      {/* Main bubble circle */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <Icon size={iconSize} color={iconColor} strokeWidth={1.8} />
      </View>
    </View>
  );
}

export default function IntroScreen() {
  const slideUp = useRef(new Animated.Value(60)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const skipFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 700,
        delay: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 700,
        delay: 600,
        useNativeDriver: true,
      }),
      Animated.timing(skipFade, {
        toValue: 1,
        duration: 500,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeIn, skipFade, slideUp]);

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAF8]">
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF8" />

      {/* Center cluster area matching reference layout */}
      <View className="flex-1 justify-center items-center pt-10">
        <View className="w-[360px] h-[350px] relative">
          {BUBBLES.map((bubble, i) => (
            <FloatingBubble key={i} {...bubble} />
          ))}

          {/* Decorative star sparks in reference positions */}
          <View
            className="absolute w-2 h-2 rounded-full bg-amber-500 opacity-40"
            style={{ top: 20, left: 35 }}
          />
          <View
            className="absolute w-2 h-2 rounded-full bg-emerald-600 opacity-40"
            style={{ top: 45, left: 335 }}
          />
          <View
            className="absolute w-1.5 h-1.5 rounded-full bg-pink-600 opacity-40"
            style={{ top: 170, left: 5 }}
          />
          <View
            className="absolute w-2 h-2 rounded-full bg-orange-600 opacity-40"
            style={{ top: 255, left: 330 }}
          />
          <View
            className="absolute w-1.5 h-1.5 rounded-full bg-blue-600 opacity-40"
            style={{ top: 310, left: 45 }}
          />
        </View>
      </View>

      {/* Bottom content */}
      <Animated.View
        className="px-7 pb-10"
        style={{
          opacity: fadeIn,
          transform: [{ translateY: slideUp }],
        }}
      >
        {/* Text content */}
        <View className="mb-8 items-center">
          <Text className="text-3xl font-nunito-extrabold text-healthcare-900 text-center leading-[38px] mb-3">
            Cuidados de saúde ao alcance de todos
          </Text>
          <Text className="text-base font-nunito text-slate-500 text-center leading-6 px-2">
            Encontra hospitais, clínicas e serviços {'\n'}de saúde perto de si, de forma rápida e clara.
          </Text>
        </View>

        {/* CTA Button */}
        <Pressable
          onPress={() => router.replace('/(app)/(tabs)')}
          className="bg-brand-red rounded-full mb-3 py-4 items-center active:opacity-90"
        >
          <Text className="text-base font-nunito-bold text-white tracking-wide">
            Emergência Médica
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/(auth)/login')}
          className="bg-healthcare-50 rounded-full border-brand-red border-[1px] py-4 items-center active:opacity-90"
        >
          <Text className="text-base font-nunito-bold text-brand-red tracking-wide">
            Criar Conta
          </Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
