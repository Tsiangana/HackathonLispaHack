import { router } from 'expo-router';
import {
  Activity,
  ArrowLeft,
  HeartPulse,
  Hospital,
  Mail,
  Stethoscope,
} from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@/constants/colors';

// Google SVG Icon component from user specification
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="#EA4335">
      <Path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
    </Svg>
  );
}

// Facebook SVG Icon component from user specification
function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="#1877F2">
      <Path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
    </Svg>
  );
}

// Compact bubble cluster matching intro.tsx visual language
const MINI_BUBBLES = [
  {
    Icon: HeartPulse,
    top: 28,
    left: 105,
    size: 72,
    haloSize: 88,
    bg: '#FEF9C3',
    haloBg: 'rgba(254, 249, 195, 0.45)',
    iconColor: '#D97706',
    iconSize: 32,
  },
  {
    Icon: Stethoscope,
    top: 5,
    left: 45,
    size: 52,
    haloSize: 64,
    bg: '#E0F2FE',
    haloBg: 'rgba(224, 242, 254, 0.45)',
    iconColor: '#2196C7',
    iconSize: 24,
  },
  {
    Icon: Hospital,
    top: 10,
    left: 185,
    size: 48,
    haloSize: 60,
    bg: '#DCFCE7',
    haloBg: 'rgba(220, 252, 231, 0.45)',
    iconColor: '#16A34A',
    iconSize: 22,
  },
  {
    Icon: Activity,
    top: 72,
    left: 195,
    size: 44,
    haloSize: 54,
    bg: '#F0FDF4',
    haloBg: 'rgba(240, 253, 244, 0.45)',
    iconColor: '#15803D',
    iconSize: 18,
  },
];

function MiniBubble({
  Icon,
  top,
  left,
  size,
  haloSize,
  bg,
  haloBg,
  iconColor,
  iconSize,
}: (typeof MINI_BUBBLES)[0]) {
  const haloOffset = (haloSize - size) / 2;
  return (
    <View style={{ position: 'absolute', top, left }}>
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
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <Icon size={iconSize} color={iconColor} strokeWidth={1.8} />
      </View>
    </View>
  );
}

export default function LoginScreen() {
  const slideUp = useRef(new Animated.Value(30)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeIn, slideUp]);

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAF8]">
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF8" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View className="flex-1 px-7 pt-4 pb-8 justify-between">
          {/* Top Header with Back Navigation */}
          <View className="flex-row items-center justify-between h-10 mb-2">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-12 h-12 rounded-full bg-white border border-slate-200 items-center justify-center active:bg-slate-100"
            >
              <ArrowLeft size={20} color={colors.textDark} strokeWidth={2} />
            </TouchableOpacity>

            <View className="flex-row items-center gap-1.5">
              <View className="w-2 h-2 rounded-full bg-slate-300" />
              <View className="w-6 h-2 rounded-full bg-brand-red" />
              <View className="w-2 h-2 rounded-full bg-slate-300" />
            </View>
          </View>

          {/* Intro-matching Floating Bubble Visual Cluster */}
          <View className="items-center justify-center my-4">
            <View className="w-[280px] h-[130px] relative">
              {MINI_BUBBLES.map((bubble, i) => (
                <MiniBubble key={i} {...bubble} />
              ))}

              {/* Decorative accent dots */}
              <View
                className="absolute w-2 h-2 rounded-full bg-amber-500 opacity-40"
                style={{ top: 10, left: 25 }}
              />
              <View
                className="absolute w-1.5 h-1.5 rounded-full bg-emerald-600 opacity-40"
                style={{ top: 15, left: 250 }}
              />
              <View
                className="absolute w-1.5 h-1.5 rounded-full bg-blue-600 opacity-40"
                style={{ top: 105, left: 55 }}
              />
            </View>
          </View>

          {/* Main Title + Subtitle section */}
          <Animated.View
            className="items-center mb-6"
            style={{
              opacity: fadeIn,
              transform: [{ translateY: slideUp }],
            }}
          >
            <Text className="text-3xl font-nunito-extrabold text-healthcare-900 text-center leading-[38px] mb-2">
              Bem-vindo ao SaúdeLink
            </Text>
            <Text className="text-base font-nunito text-slate-500 text-center leading-6 px-2">
              Cria uma conta para encontrar serviços de saúde perto de si de forma rápida.
            </Text>
          </Animated.View>

          {/* Action Buttons Section */}
          <Animated.View
            className="gap-3 mb-6"
            style={{
              opacity: fadeIn,
              transform: [{ translateY: slideUp }],
            }}
          >
            {/* Primary — Email Login */}
            <Pressable
              onPress={() => router.push('/(auth)/email-login')}
              className="flex-row items-center justify-center gap-3 bg-brand-red rounded-full py-4 px-5 active:opacity-90"
            >
              <Mail size={20} color="#FFF" strokeWidth={2.2} />
              <Text className="text-base font-nunito-bold text-white tracking-wide">
                Continuar com Email
              </Text>
            </Pressable>

            {/* Secondary — Google Login (using exact Google SVG) */}
            <Pressable
              onPress={() => {}}
              className="flex-row items-center justify-center gap-3 bg-white border border-slate-200 rounded-full py-4 px-5 active:bg-slate-50"
            >
              <GoogleIcon size={20} />
              <Text className="text-base font-nunito-bold text-slate-700 tracking-wide">
                Continuar com Google
              </Text>
            </Pressable>

            {/* Secondary — Facebook Login (using exact Facebook SVG) */}
            <Pressable
              onPress={() => {}}
              className="flex-row items-center justify-center gap-3 bg-white border border-slate-200 rounded-full py-4 px-5 active:bg-slate-50"
            >
              <FacebookIcon size={20} />
              <Text className="text-base font-nunito-bold text-slate-700 tracking-wide">
                Continuar com Facebook
              </Text>
            </Pressable>

            {/* Tertiary — SaúdeID / Quick Entry */}
            <Pressable
              onPress={() => router.push('/(auth)/register')}
              className="flex-row items-center justify-center gap-3 bg-healthcare-50 border border-brand-red/30 rounded-full py-4 px-5 active:opacity-90"
            >
              <HeartPulse size={20} color={colors.primaryRed} strokeWidth={2.2} />
              <Text className="text-base font-nunito-bold text-brand-red tracking-wide">
                Criar Nova Conta
              </Text>
            </Pressable>
          </Animated.View>

          {/* Bottom Footer Section */}
          <View className="flex-row justify-center items-center gap-1.5 py-2">
            <Text className="text-sm font-nunito text-slate-500">
              Já tens uma conta?
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/email-login')}>
              <Text className="text-sm font-nunito-extrabold text-brand-red underline">
                Entrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}