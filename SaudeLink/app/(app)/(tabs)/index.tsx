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
  FlaskConical,
  Heart,
  HeartPulse,
  MapPin,
  Stethoscope,
  Syringe,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Image,
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

// Priority emergency categories with icons (ordered by emergency criticality)
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
  const [need, setNeed] = useState<HospitalNeed | null>(null);
  const filteredHospitals = useHospitals('', need);

  const selectedHospital = filteredHospitals[0];

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

        {/* ── Hero Hospital Card with image background ── */}
        <View className="px-5 mt-4">
          <Pressable
            onPress={() => selectedHospital && router.push(`/(app)/hospital/${selectedHospital.id}`)}
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
                    {filteredHospitals.length} unidades encontradas • Luanda, Angola
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </Pressable>
          <Text className="text-xs font-nunito-bold text-slate-400 uppercase tracking-widest mt-2 ml-3">ver todos os hospitais</Text>
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
          <Text className="text-xs font-nunito-bold text-slate-400 uppercase tracking-widest">
            Prioritário
          </Text>
        </View>

        {/* ── Emergency Priority Cards Grid ── */}
        <View className="px-5">
          <View className="flex-row flex-wrap gap-3">
            {EMERGENCY_PRIORITIES.map((item) => {
              const Icon = item.icon;
              const isSelected = need === item.need;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => setNeed(isSelected ? null : item.need)}
                  className="active:opacity-90"
                  style={{ width: '47%' }}
                >
                  <View
                    className="rounded-3xl p-5 min-h-[150px] justify-between border"
                    style={{
                      backgroundColor: isSelected ? item.color + '18' : item.bg,
                      borderColor: isSelected ? item.color : 'transparent',
                    }}
                  >
                    {/* Icon container */}
                    <View
                      className="w-14 h-14 rounded-2xl items-center justify-center"
                      style={{ backgroundColor: isSelected ? item.color + '25' : '#FFFFFF' }}
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
                        className="text-base font-nunito-extrabold leading-5"
                        style={{ color: '#1E293B' }}
                      >
                        {item.label}
                      </Text>
                      <Text
                        className="text-xs font-nunito mt-0.5"
                        style={{ color: '#94A3B8' }}
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

        {/* ── Results Section (if category selected) ── */}
        {need !== null && (
          <View className="px-5 mt-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-nunito-extrabold text-slate-900">
                Hospitais Encontrados
              </Text>
              <Text className="text-xs font-nunito-bold text-brand-red">
                {filteredHospitals.length} resultado{filteredHospitals.length !== 1 ? 's' : ''}
              </Text>
            </View>

            <View className="gap-0">
              {filteredHospitals.length === 0 ? (
                <View className="rounded-2xl border border-slate-100 bg-slate-50 p-6 items-center">
                  <Text className="text-base font-nunito-bold text-slate-700 text-center">
                    Nenhum hospital encontrado
                  </Text>
                  <Text className="text-xs font-nunito text-slate-400 text-center mt-1">
                    Tenta outro filtro ou pesquisa.
                  </Text>
                </View>
              ) : (
                filteredHospitals.slice(0, 4).map((hospital, i) => (
                  <Pressable
                    key={hospital.id}
                    onPress={() => router.push(`/(app)/hospital/${hospital.id}`)}
                    className="flex-row items-center justify-between py-4 active:opacity-70"
                    style={{
                      borderBottomWidth: i < filteredHospitals.length - 1 ? 1 : 0,
                      borderBottomColor: '#F1F5F9',
                    }}
                  >
                    <View className="flex-row items-center gap-3.5 flex-1 pr-3">
                      <View className="w-12 h-12 rounded-2xl bg-slate-100 items-center justify-center">
                        <Image
                          source={{ uri: hospital.image || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=200&q=60' }}
                          className="w-12 h-12 rounded-2xl"
                          style={{ width: 48, height: 48, borderRadius: 12 }}
                        />
                      </View>
                      <View className="flex-1 min-w-0">
                        <Text className="text-sm font-nunito-extrabold text-slate-800" numberOfLines={1}>
                          {hospital.name}
                        </Text>
                        <View className="flex-row items-center gap-1 mt-0.5">
                          <MapPin size={11} color="#94A3B8" strokeWidth={2} />
                          <Text className="text-xs font-nunito text-slate-400" numberOfLines={1}>
                            {hospital.address}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <View className={`w-2 h-2 rounded-full ${hospital.isOpen ? 'bg-green-500' : 'bg-slate-300'}`} />
                      <ChevronRight size={16} color="#CBD5E1" strokeWidth={2.5} />
                    </View>
                  </Pressable>
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
