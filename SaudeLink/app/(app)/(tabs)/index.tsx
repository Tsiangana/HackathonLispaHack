import { router } from 'expo-router';
import {
  Activity,
  Ambulance,
  ArrowRight,
  Baby,
  Bone,
  Brain,
  Building2,
  ChevronRight,
  Crown,
  FlaskConical,
  Heart,
  HeartPulse,
  Lock,
  MapPin,
  Stethoscope,
  Syringe,
} from 'lucide-react-native';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeHeader } from '@/features/home/components/HomeHeader';
import { useHospitals } from '@/features/hospitals/hooks/useHospitals';
import { HospitalNeed } from '@/types/hospital';

// Priority emergency categories with icons
const EMERGENCY_PRIORITIES = [
  {
    id: 'urgency',
    label: 'Urgência',
    sublabel: 'Atendimento 24/7',
    icon: Ambulance,
    color: '#D9232E',
    bg: '#FEF2F2',
    need: 'emergency' as HospitalNeed,
  },
  {
    id: 'pain',
    label: 'Dores',
    sublabel: 'Tratamento & Alívio',
    icon: HeartPulse,
    color: '#EA580C',
    bg: '#FFF7ED',
    need: 'emergency' as HospitalNeed,
  },
  {
    id: 'bone',
    label: 'Fractura',
    sublabel: 'Ortopedia & Trauma',
    icon: Bone,
    color: '#F97316',
    bg: '#FFF7ED',
    need: 'emergency' as HospitalNeed,
  },
  {
    id: 'maternity',
    label: 'Grávidas',
    sublabel: 'Maternidade 24h',
    icon: Baby,
    color: '#E879A0',
    bg: '#FDF2F8',
    need: 'maternity' as HospitalNeed,
  },
  {
    id: 'cardio',
    label: 'Cardíaco',
    sublabel: 'Cardiologia Urgência',
    icon: Heart,
    color: '#DC2626',
    bg: '#FEF2F2',
    need: 'emergency' as HospitalNeed,
  },
  {
    id: 'pediatrics',
    label: 'Pediatria',
    sublabel: 'Emergência Infantil',
    icon: Activity,
    color: '#059669',
    bg: '#F0FDF4',
    need: 'pediatrics' as HospitalNeed,
  },
  {
    id: 'consultation',
    label: 'Consulta Médica',
    sublabel: 'Clínica Geral & Esp.',
    icon: Stethoscope,
    color: '#0284C7',
    bg: '#F0F9FF',
    need: 'emergency' as HospitalNeed,
  },
  {
    id: 'surgery',
    label: 'Operação',
    sublabel: 'Cirurgia Geral',
    icon: Syringe,
    color: '#7C3AED',
    bg: '#F5F3FF',
    need: 'imaging' as HospitalNeed,
  },
  {
    id: 'laboratory',
    label: 'Laboratório',
    sublabel: 'Análises & Exames',
    icon: FlaskConical,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    need: 'laboratory' as HospitalNeed,
  },
  {
    id: 'vaccination',
    label: 'Vacinação',
    sublabel: 'Imunização',
    icon: Syringe,
    color: '#10B981',
    bg: '#ECFDF5',
    need: 'laboratory' as HospitalNeed,
  },
  {
    id: 'tumor',
    label: 'Tumores',
    sublabel: 'Oncologia',
    icon: Brain,
    color: '#0EA5E9',
    bg: '#F0F9FF',
    need: 'laboratory' as HospitalNeed,
  },
] as const;

export default function HomeScreen() {
  const hospitals = useHospitals();

  /**
   * Smart Recommendation Handler:
   * Finds the best hospital for the specific emergency need and jumps
   * directly to the active map route navigation state.
   */
  const handleQuickAccessPress = (needType: HospitalNeed, label: string) => {
    const matches = hospitals.filter((h) => {
      if (needType === 'emergency') return h.resources.emergency || h.emergencyAvailable;
      if (needType === 'maternity') return h.resources.maternity;
      if (needType === 'pediatrics') return h.resources.pediatrics;
      if (needType === 'laboratory') return h.resources.laboratory;
      if (needType === 'imaging') return h.resources.imaging;
      return true;
    });

    const bestHospital = matches.length > 0 ? matches[0] : (hospitals.length > 0 ? hospitals[0] : undefined);

    router.push({
      pathname: '/(app)/(tabs)/map',
      params: {
        hospitalId: bestHospital?.id,
        autoRoute: 'true',
        symptom: label,
      },
    });
  };

  const countDisplay = hospitals.length > 0 ? hospitals.length : 12;
  const firstHospitalId = hospitals[0]?.id;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ── Header ── */}
        <View className="px-5 pt-2">
          <HomeHeader />
        </View>

        {/* ── PRO Upgrade Teaser Card ── */}
        <View className="px-5 mt-4">
          <Pressable
            onPress={() => router.push('/(app)/upgrade')}
            className="active:opacity-90"
          >
            <View
              className="rounded-3xl p-4 border border-amber-200/80 overflow-hidden"
              style={{ backgroundColor: '#FFFBEB' }}
            >
              {/* Top row */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="w-9 h-9 rounded-xl bg-amber-100 items-center justify-center">
                    <Crown size={18} color="#D97706" strokeWidth={2} />
                  </View>
                  <View>
                    <Text className="text-sm font-nunito-extrabold text-slate-900">
                      SaúdeLink PRO
                    </Text>
                    <Text className="text-xs font-nunito text-slate-500">
                      Acesso completo a todas as funcionalidades
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-1 bg-amber-500 rounded-full px-2.5 py-1">
                  <Text className="text-xs font-nunito-extrabold text-white">Ver mais</Text>
                  <ChevronRight size={11} color="#FFFFFF" strokeWidth={3} />
                </View>
              </View>

            </View>
          </Pressable>
        </View>

        {/* ── Hero Hospital Card with image background ── */}
        <View className="px-5 mt-4">
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/(app)/(tabs)/map',
                params: { hospitalId: firstHospitalId, autoRoute: 'true' },
              })
            }
            className="rounded-3xl overflow-hidden h-48 active:opacity-90"
          >
            <ImageBackground
              source={{ uri: 'https://jornaloguardiao.com/wp-content/uploads/2024/01/hospital-do-Prenda.jpg' }}
              style={{ flex: 1, justifyContent: 'flex-end' }}
              imageStyle={{ borderRadius: 24 }}
            >
              {/* Gradient overlay */}
              <View
                className="absolute inset-0 rounded-3xl"
                style={{ backgroundColor: 'rgba(15, 30, 50, 0.25)' }}
              />

              {/* Content */}
              <View className="p-5">
                <Text className="text-xl font-nunito-extrabold text-white leading-6 mb-1">
                  Todos Hospitais próximos de você
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <MapPin size={13} color="rgba(255,255,255,0.85)" strokeWidth={2.5} />
                  <Text className="text-xs font-nunito text-white/80">
                    {`${countDisplay} unidades encontradas • Luanda, Angola`}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </Pressable>
          <Text className="text-xs font-nunito-bold text-slate-400 uppercase tracking-widest mt-2 ml-3">
            ver todos os hospitais no mapa
          </Text>
        </View>

        {/* ── "Precisa de um hospital?" Button ── */}
        <View className="px-5 mt-5">
          <Pressable
            onPress={() => router.push('/(app)/search')}
            className="flex-row items-center justify-between h-[54px] rounded-2xl bg-[#EFEFEF] px-4 active:opacity-90"
          >
            <View className="w-9 h-9 rounded-xl bg-white items-center justify-center border border-slate-200/50">
              <Building2 size={19} color="#1E293B" strokeWidth={2} />
            </View>
            <Text className="flex-1 text-center text-base font-nunito-extrabold text-slate-900 px-2">
              Precisa de um hospital ?
            </Text>
            <View className="w-7 h-7 rounded-full bg-slate-900 items-center justify-center">
              <ArrowRight size={13} color="#FFFFFF" strokeWidth={3} />
            </View>
          </Pressable>
        </View>

        {/* ── Section Title ── */}
        <View className="px-5 mt-6 mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-nunito-extrabold text-slate-900">
            Acesso Rápido
          </Text>
          <Text className="text-xs font-nunito-bold text-brand-red uppercase tracking-widest">
            Recomendação Direta
          </Text>
        </View>

        {/* ── Emergency Priority Cards Grid ── */}
        <View className="px-5">
          <View className="flex-row flex-wrap gap-3">
            {EMERGENCY_PRIORITIES.map((item) => {
              const Icon = item.icon;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => handleQuickAccessPress(item.need, item.label)}
                  className="active:opacity-90"
                  style={{ width: '47%' }}
                >
                  <View
                    className="rounded-3xl p-5 min-h-[150px] justify-between border"
                    style={{
                      backgroundColor: item.bg,
                      borderColor: 'transparent',
                    }}
                  >
                    {/* Icon container */}
                    <View
                      className="w-14 h-14 rounded-2xl items-center justify-center bg-white"
                    >
                      <Icon
                        size={30}
                        color={item.color}
                        strokeWidth={1.8}
                      />
                    </View>

                    {/* Label */}
                    <View className="mt-4">
                      <Text
                        className="text-base font-nunito-extrabold leading-5 text-slate-900"
                      >
                        {item.label}
                      </Text>
                      <Text
                        className="text-xs font-nunito mt-0.5 text-slate-400"
                      >
                        {item.sublabel}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
