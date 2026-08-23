import { router } from 'expo-router';
import { ArrowLeft, Globe, Heart, Info, Mail, Phone } from 'lucide-react-native';
import { Linking, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import { SafeArea } from '@/components/layout/SafeArea';

export default function AboutSettingsScreen() {
  return (
    <SafeArea>
      <StatusBar barStyle="dark-content" />

      {/* ── Header ── */}
      <View className="flex-row items-center justify-between px-5 pt-3 pb-4 bg-white border-b border-slate-100">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center active:bg-slate-200"
          >
            <ArrowLeft size={20} color="#0F172A" strokeWidth={2.5} />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-nunito-extrabold text-slate-900">
              Sobre o SaúdeLink
            </Text>
            <Text className="text-xs font-nunito text-slate-500">
              Plataforma de saúde e emergência de Angola
            </Text>
          </View>
        </View>

        <View className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center">
          <Info size={20} color="#475569" strokeWidth={2.5} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, gap: 20 }}
      >
        {/* Brand Banner */}
        <View className="bg-slate-900 rounded-3xl p-6 items-center gap-3 shadow-xs">
          <View className="w-16 h-16 rounded-full bg-brand-red items-center justify-center border-2 border-white">
            <Heart size={32} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <Text className="text-2xl font-nunito-extrabold text-white tracking-tight">
            SAÚDELINK
          </Text>
          <View className="bg-white/10 px-3 py-1 rounded-full">
            <Text className="text-xs font-nunito-bold text-emerald-400">Versão 1.0.4 • 2026</Text>
          </View>
        </View>

        {/* Mission Statement */}
        <View className="bg-white rounded-3xl p-5 border border-slate-200/80 gap-3 shadow-xs">
          <Text className="text-sm font-nunito-extrabold text-slate-900">
            A nossa missão em Angola
          </Text>
          <Text className="text-xs font-nunito text-slate-600 leading-relaxed">
            O SaúdeLink é uma solução tecnológica desenhada para salvar vidas. Conectamos cidadãos angolanos a hospitais, clínicas e ambulâncias com informações em tempo real sobre tempos de espera, recursos disponíveis e rotas inteligentes.
          </Text>
        </View>

        {/* Contacts & Support */}
        <View className="bg-white rounded-3xl p-5 border border-slate-200/80 gap-3 shadow-xs">
          <Text className="text-sm font-nunito-extrabold text-slate-900">
            Canais de Contacto
          </Text>

          <TouchableOpacity
            onPress={() => Linking.openURL('https://saudelink.app')}
            className="flex-row items-center gap-3 py-2 border-b border-slate-100 active:bg-slate-50"
          >
            <Globe size={18} color="#D9232E" strokeWidth={2} />
            <Text className="text-xs font-nunito-bold text-slate-800 flex-1">www.saudelink.app</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL('mailto:suporte@saudelink.app')}
            className="flex-row items-center gap-3 py-2 border-b border-slate-100 active:bg-slate-50"
          >
            <Mail size={18} color="#D9232E" strokeWidth={2} />
            <Text className="text-xs font-nunito-bold text-slate-800 flex-1">suporte@saudelink.app</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL('tel:+244923000100')}
            className="flex-row items-center gap-3 py-2 active:bg-slate-50"
          >
            <Phone size={18} color="#D9232E" strokeWidth={2} />
            <Text className="text-xs font-nunito-bold text-slate-800 flex-1">+244 923 000 100</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeArea>
  );
}
