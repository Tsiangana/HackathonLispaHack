import { router } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Globe,
  HeartPulse,
  HelpCircle,
  Info,
  Lock,
  LogOut,
  MapPin,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  User,
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { SafeArea } from '@/components/layout/SafeArea';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface SettingRowProps {
  icon: typeof User;
  iconBg: string;
  iconColor: string;
  label: string;
  value?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
  onPress?: () => void;
}

function SettingItem({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  hasSwitch,
  switchValue,
  onSwitchChange,
  onPress,
}: SettingRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between py-3.5 px-4 active:bg-slate-50 border-b border-slate-100/80 last:border-b-0"
    >
      <View className="flex-row items-center gap-3.5 flex-1 pr-2">
        <View className={`w-10 h-10 rounded-2xl items-center justify-center ${iconBg}`}>
          <Icon size={20} color={iconColor} strokeWidth={2} />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-nunito-extrabold text-slate-900">
            {label}
          </Text>
          {value ? (
            <Text className="text-xs font-nunito text-slate-500 mt-0.5" numberOfLines={1}>
              {value}
            </Text>
          ) : null}
        </View>
      </View>

      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#E2E8F0', true: '#D9232E' }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <ChevronRight size={18} color="#94A3B8" strokeWidth={2} />
      )}
    </Pressable>
  );
}

function getInitials(name: string) {
  const value = name.trim();

  if (!value) {
    return 'U';
  }

  const parts = value.split(/\s+/);

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function SettingsScreen() {
  const { session, profile, refreshProfile } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [sosLocationEnabled, setSosLocationEnabled] = useState(true);

  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, [refreshProfile]),
  );

  const fullName = profile?.full_name || (session ? 'Utilizador' : 'Modo Emergência');
  const email = session?.user?.email || 'Acesso rápido sem conta';
  const phone = profile?.phone ?? '';
  const isVerified = Boolean(profile?.is_verified);

  const handleLogout = async () => {
    try {
      if (session) {
        await supabase.auth.signOut();
      }
      router.replace('/(auth)/intro');
    } catch (error) {
      console.error('Erro ao terminar sessão:', error);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(app)/(tabs)');
    }
  };

  return (
    <SafeArea>
      <StatusBar barStyle="dark-content" />

      {/* ── Top Header ── */}
      <View className="flex-row items-center justify-between px-5 pt-3 pb-4 bg-white border-b border-slate-100">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={handleBack}
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center active:bg-slate-200"
          >
            <ArrowLeft size={20} color="#0F172A" strokeWidth={2.5} />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-nunito-extrabold text-slate-900">
              Definições
            </Text>
            <Text className="text-xs font-nunito text-slate-500">
              Gere o teu perfil e preferências
            </Text>
          </View>
        </View>

        {isVerified ? (
          <View className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 flex-row items-center gap-1">
            <CheckCircle2 size={12} color="#16A34A" strokeWidth={2.5} />
            <Text className="text-[11px] font-nunito-bold text-emerald-700">Verificado</Text>
          </View>
        ) : (
          <View className="w-9 h-9" />
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, gap: 20 }}
      >
        {/* ── Hero Profile Card ── */}
        <View className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex-row items-center justify-between">
          <View className="flex-row items-center gap-4 flex-1">
            <View className="relative">
              <View className="w-16 h-16 rounded-full bg-brand-red items-center justify-center border-2 border-white shadow-xs">
                <Text className="text-xl font-nunito-extrabold text-white">{getInitials(fullName)}</Text>
              </View>
              {isVerified ? (
                <View className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white items-center justify-center">
                  <CheckCircle2 size={10} color="#FFFFFF" strokeWidth={3} />
                </View>
              ) : null}
            </View>

            <View className="flex-1">
              <View className="flex-row items-center gap-1.5">
                <Text className="text-lg font-nunito-extrabold text-slate-900" numberOfLines={1}>
                  {fullName}
                </Text>
              </View>
              <Text className="text-xs font-nunito text-slate-500 mt-0.5" numberOfLines={1}>
                {email}
              </Text>
              {phone ? (
                <Text className="text-xs font-nunito-bold text-slate-400 mt-0.5">
                  {phone}
                </Text>
              ) : null}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push(session ? '/(app)/settings/profile' : '/(auth)/login')}
            className="px-3.5 py-2 bg-slate-100 rounded-full active:bg-slate-200"
          >
            <Text className="text-xs font-nunito-extrabold text-slate-700">
              {session ? 'Editar' : 'Entrar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Seção 1: EMERGÊNCIA & SAÚDE ── */}
        <View>
          <Text className="text-xs font-nunito-extrabold text-slate-400 uppercase tracking-wider mb-2 px-1">
            Emergência & Saúde
          </Text>

          <View className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <SettingItem
              icon={HeartPulse}
              iconBg="bg-red-50"
              iconColor="#D9232E"
              label="Perfil Médico & Alergias"
              value="Ficha de emergência e histórico"
              onPress={() => router.push('/(app)/settings/medical-profile')}
            />
            <SettingItem
              icon={PhoneCall}
              iconBg="bg-emerald-50"
              iconColor="#16A34A"
              label="Contactos de Emergência SOS"
              value="2 contactos configurados"
              onPress={() => router.push('/(app)/settings/sos-contacts')}
            />
            <SettingItem
              icon={ShieldAlert}
              iconBg="bg-amber-50"
              iconColor="#D97706"
              label="Partilha de Localização SOS"
              value="Envio automático em caso de emergência"
              hasSwitch={true}
              switchValue={sosLocationEnabled}
              onSwitchChange={setSosLocationEnabled}
            />
          </View>
        </View>

        {/* ── Seção 2: PREFERÊNCIAS & NOTIFICAÇÕES ── */}
        <View>
          <Text className="text-xs font-nunito-extrabold text-slate-400 uppercase tracking-wider mb-2 px-1">
            Preferências & Notificações
          </Text>

          <View className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <SettingItem
              icon={Bell}
              iconBg="bg-blue-50"
              iconColor="#2563EB"
              label="Alertas Urgentes de Saúde"
              value="Tempos de espera e estado dos hospitais"
              hasSwitch={true}
              switchValue={notificationsEnabled}
              onSwitchChange={setNotificationsEnabled}
            />
            <SettingItem
              icon={MapPin}
              iconBg="bg-slate-100"
              iconColor="#0F172A"
              label="Localização Padrão"
              value="Luanda, Angola"
              onPress={() => router.push('/(app)/settings/location')}
            />
            <SettingItem
              icon={Globe}
              iconBg="bg-indigo-50"
              iconColor="#4F46E5"
              label="Idioma da Aplicação"
              value="Português (Angola)"
              onPress={() => router.push('/(app)/settings/language')}
            />
          </View>
        </View>

        {/* ── Seção 3: CONTA & SEGURANÇA ── */}
        <View>
          <Text className="text-xs font-nunito-extrabold text-slate-400 uppercase tracking-wider mb-2 px-1">
            Conta & Segurança
          </Text>

          <View className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <SettingItem
              icon={User}
              iconBg="bg-purple-50"
              iconColor="#9333EA"
              label="Dados Pessoais & Perfil"
              value="Nome, email e documento"
              onPress={() => router.push('/(app)/settings/profile')}
            />
            <SettingItem
              icon={Lock}
              iconBg="bg-slate-100"
              iconColor="#334155"
              label="Segurança & Palavra-passe"
              value="Alterar credenciais de acesso"
              onPress={() => router.push('/(app)/settings/security')}
            />
            <SettingItem
              icon={CreditCard}
              iconBg="bg-emerald-50"
              iconColor="#059669"
              label="Métodos de Pagamento"
              value="Multicaixa Express & Visa"
              onPress={() => router.push('/(app)/settings/payments')}
            />
          </View>
        </View>

        {/* ── Seção 4: SUPORTE & SOBRE ── */}
        <View>
          <Text className="text-xs font-nunito-extrabold text-slate-400 uppercase tracking-wider mb-2 px-1">
            Suporte & Informações
          </Text>

          <View className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <SettingItem
              icon={HelpCircle}
              iconBg="bg-sky-50"
              iconColor="#0284C7"
              label="Centro de Ajuda & FAQ"
              value="Dúvidas frequentes e suporte 24/7"
              onPress={() => router.push('/(app)/settings/help')}
            />
            <SettingItem
              icon={ShieldCheck}
              iconBg="bg-teal-50"
              iconColor="#0D9488"
              label="Termos & Política de Privacidade"
              value="Proteção de dados e diretrizes"
              onPress={() => router.push('/(app)/settings/terms')}
            />
            <SettingItem
              icon={Info}
              iconBg="bg-slate-100"
              iconColor="#475569"
              label="Sobre o SaúdeLink"
              value="Versão 1.0.4 • Compilação 2026"
              onPress={() => router.push('/(app)/settings/about')}
            />
          </View>
        </View>

        {/* ── Log Out Button ── */}
        <TouchableOpacity
          onPress={handleLogout}
          className="w-full bg-red-50 border border-red-200/80 rounded-3xl py-4 flex-row items-center justify-center gap-2.5 active:bg-red-100 mt-2"
        >
          <LogOut size={18} color="#D9232E" strokeWidth={2.5} />
          <Text className="text-base font-nunito-extrabold text-brand-red">
            Terminar Sessão
          </Text>
        </TouchableOpacity>

        {/* ── Footer Info ── */}
        <View className="items-center mt-2">
          <Text className="text-xs font-nunito text-slate-400">
            SaúdeLink Angola © 2026 • Todos os direitos reservados
          </Text>
        </View>
      </ScrollView>
    </SafeArea>
  );
}
