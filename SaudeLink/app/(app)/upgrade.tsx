import { router } from 'expo-router';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
  Crown,
  FileText,
  HeartPulse,
  Lock,
  Phone,
  Shield,
  Star,
  X,
  Zap,
} from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FREE_FEATURES = [
  { label: 'Mapa de Hospitais Básico', icon: HeartPulse },
  { label: 'Pesquisa por Sintoma', icon: HeartPulse },
  { label: 'Call Center de Emergência', icon: Phone },
  { label: 'Perfil de Saúde Simples', icon: FileText },
];

const PRO_FEATURES = [
  {
    label: 'Tempos de Espera em Tempo Real',
    sublabel: 'Sabe quanto tempo vai esperar em cada hospital',
    icon: Clock,
    color: '#D9232E',
  },
  {
    label: 'Histórico Médico Completo',
    sublabel: 'Acesso ao teu historial de consultas e exames',
    icon: FileText,
    color: '#7C3AED',
  },
  {
    label: 'Notificações de Saúde Inteligentes',
    sublabel: 'Alertas personalizados com base no teu perfil',
    icon: Zap,
    color: '#F59E0B',
  },
  {
    label: 'Consultas Online com Médicos',
    sublabel: 'Teleconsultas integradas com especialistas',
    icon: HeartPulse,
    color: '#10B981',
  },
  {
    label: 'Relatórios de Saúde Mensais',
    sublabel: 'Análise personalizada do teu estado de saúde',
    icon: Star,
    color: '#0EA5E9',
  },
  {
    label: 'Prioridade em Filas de Urgência',
    sublabel: 'Acesso prioritário em unidades parceiras',
    icon: Shield,
    color: '#D9232E',
  },
];

const PLANS = [
  {
    id: 'monthly',
    label: 'Mensal',
    price: '3.500',
    period: 'Kz / mês',
    highlight: false,
    badge: null,
  },
  {
    id: 'annual',
    label: 'Anual',
    price: '24.990',
    period: 'Kz / ano',
    highlight: true,
    badge: '30% desconto',
  },
];

export default function UpgradeScreen() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [isLoading, setIsLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleUpgrade = () => {
    setIsLoading(true);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    // Simulated — replace with real payment gateway call
    setTimeout(() => {
      setIsLoading(false);
      router.push('/(app)/settings/payments');
    }, 1200);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Header ── */}
      <View className="flex-row items-center px-5 pt-3 pb-4 border-b border-slate-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center active:bg-slate-200 mr-3"
        >
          <ArrowLeft size={20} color="#0F172A" strokeWidth={2.5} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-nunito-extrabold text-slate-900">SaúdeLink PRO</Text>
          <Text className="text-xs font-nunito text-slate-500">Desbloqueia todas as funcionalidades</Text>
        </View>
        <View className="w-10 h-10 rounded-2xl bg-amber-50 items-center justify-center border border-amber-200/60">
          <Crown size={20} color="#D97706" strokeWidth={2} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ── Hero Banner ── */}
        <View className="mx-5 mt-5 rounded-3xl overflow-hidden bg-gradient-to-br">
          <View
            className="rounded-3xl p-6 items-center"
            style={{ backgroundColor: '#D9232E' }}
          >
            <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center mb-3 border border-white/30">
              <Crown size={32} color="#FFFFFF" strokeWidth={2} />
            </View>
            <Text className="text-2xl font-nunito-extrabold text-white text-center leading-7 mb-2">
              Acesso Completo{'\n'}à Saúde Angola
            </Text>
            <Text className="text-sm font-nunito text-white/80 text-center leading-5">
              Consultas em tempo real, histórico médico e{'\n'}notificações inteligentes ao teu alcance.
            </Text>
          </View>
        </View>

        {/* ── Plan Selector ── */}
        <View className="px-5 mt-6">
          <Text className="text-xs font-nunito-extrabold text-slate-400 uppercase tracking-wider mb-3">
            Escolhe o teu Plano
          </Text>
          <View className="flex-row gap-3">
            {PLANS.map((plan) => (
              <Pressable
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id as 'monthly' | 'annual')}
                className="flex-1 active:opacity-90"
              >
                <View
                  className={`rounded-3xl p-4 border-2 relative overflow-hidden ${
                    selectedPlan === plan.id
                      ? 'border-brand-red bg-red-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  {plan.badge && (
                    <View className="absolute top-3 right-3 bg-brand-red rounded-full px-2 py-0.5">
                      <Text className="text-[10px] font-nunito-extrabold text-white">{plan.badge}</Text>
                    </View>
                  )}
                  <View
                    className={`w-5 h-5 rounded-full border-2 mb-3 items-center justify-center ${
                      selectedPlan === plan.id ? 'border-brand-red bg-brand-red' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {selectedPlan === plan.id && (
                      <Check size={11} color="#FFFFFF" strokeWidth={3} />
                    )}
                  </View>
                  <Text className="text-xs font-nunito-bold text-slate-500 mb-1">{plan.label}</Text>
                  <Text className="text-xl font-nunito-extrabold text-slate-900 leading-6">
                    {plan.price}
                  </Text>
                  <Text className="text-xs font-nunito text-slate-400">{plan.period}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── PRO Features ── */}
        <View className="px-5 mt-6">
          <Text className="text-xs font-nunito-extrabold text-slate-400 uppercase tracking-wider mb-3">
            Incluído no PRO
          </Text>
          <View className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden">
            {PRO_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              const isLast = index === PRO_FEATURES.length - 1;
              return (
                <View
                  key={feature.label}
                  className={`flex-row items-center gap-4 px-4 py-4 ${
                    isLast ? '' : 'border-b border-slate-100'
                  }`}
                >
                  <View
                    className="w-10 h-10 rounded-2xl items-center justify-center"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <Icon size={20} color={feature.color} strokeWidth={2} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-nunito-extrabold text-slate-900">
                      {feature.label}
                    </Text>
                    <Text className="text-xs font-nunito text-slate-400 mt-0.5">
                      {feature.sublabel}
                    </Text>
                  </View>
                  <Check size={16} color="#16A34A" strokeWidth={2.5} />
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Free vs PRO Comparison ── */}
        <View className="px-5 mt-6">
          <Text className="text-xs font-nunito-extrabold text-slate-400 uppercase tracking-wider mb-3">
            Comparação de Planos
          </Text>
          <View className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden">
            {/* Header row */}
            <View className="flex-row items-center px-4 py-3 bg-slate-50 border-b border-slate-100">
              <Text className="flex-1 text-xs font-nunito-extrabold text-slate-500 uppercase tracking-wider">Funcionalidade</Text>
              <Text className="w-14 text-center text-xs font-nunito-extrabold text-slate-500 uppercase">Grátis</Text>
              <Text className="w-14 text-center text-xs font-nunito-extrabold text-brand-red uppercase">PRO</Text>
            </View>

            {FREE_FEATURES.map((feat, index) => {
              const Icon = feat.icon;
              const isLast = index === FREE_FEATURES.length - 1;
              return (
                <View
                  key={feat.label}
                  className={`flex-row items-center px-4 py-3 ${isLast ? '' : 'border-b border-slate-100'}`}
                >
                  <View className="flex-1 flex-row items-center gap-2">
                    <Icon size={14} color="#64748B" strokeWidth={2} />
                    <Text className="text-xs font-nunito-bold text-slate-700">{feat.label}</Text>
                  </View>
                  <View className="w-14 items-center">
                    <Check size={15} color="#16A34A" strokeWidth={2.5} />
                  </View>
                  <View className="w-14 items-center">
                    <Check size={15} color="#16A34A" strokeWidth={2.5} />
                  </View>
                </View>
              );
            })}

            {PRO_FEATURES.map((feat, index) => {
              const Icon = feat.icon;
              const isLast = index === PRO_FEATURES.length - 1;
              return (
                <View
                  key={feat.label}
                  className={`flex-row items-center px-4 py-3 bg-red-50/50 ${isLast ? '' : 'border-b border-red-100/60'}`}
                >
                  <View className="flex-1 flex-row items-center gap-2">
                    <Lock size={14} color="#D9232E" strokeWidth={2} />
                    <Text className="text-xs font-nunito-bold text-slate-700" numberOfLines={1}>
                      {feat.label}
                    </Text>
                  </View>
                  <View className="w-14 items-center">
                    <X size={14} color="#94A3B8" strokeWidth={2.5} />
                  </View>
                  <View className="w-14 items-center">
                    <Check size={15} color="#16A34A" strokeWidth={2.5} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* ── Sticky Bottom CTA ── */}
      <View
        className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-white border-t border-slate-100"
        style={{ elevation: 10 }}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Pressable
            onPress={handleUpgrade}
            disabled={isLoading}
            className="bg-brand-red rounded-2xl py-4 items-center flex-row justify-center gap-2 active:opacity-90 disabled:opacity-70"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Crown size={18} color="#FFFFFF" strokeWidth={2.5} />
            )}
            <Text className="text-base font-nunito-extrabold text-white">
              {isLoading ? 'A processar...' : `Activar SaúdeLink PRO`}
            </Text>
            {!isLoading && <ChevronRight size={18} color="rgba(255,255,255,0.8)" strokeWidth={2.5} />}
          </Pressable>
        </Animated.View>
        <Text className="text-xs font-nunito text-slate-400 text-center mt-2">
          Cancela quando quiseres • Sem compromisso
        </Text>
      </View>
    </SafeAreaView>
  );
}
