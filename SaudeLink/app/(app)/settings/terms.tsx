import { router } from 'expo-router';
import { ArrowLeft, ShieldCheck, Lock, FileText } from 'lucide-react-native';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import { SafeArea } from '@/components/layout/SafeArea';

export default function TermsSettingsScreen() {
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
              Termos & Privacidade
            </Text>
            <Text className="text-xs font-nunito text-slate-500">
              Proteção de dados e diretrizes de uso
            </Text>
          </View>
        </View>

        <View className="w-9 h-9 rounded-full bg-teal-50 items-center justify-center">
          <ShieldCheck size={20} color="#0D9488" strokeWidth={2.5} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, gap: 16 }}
      >
        <View className="bg-teal-50 border border-teal-200/80 rounded-2xl p-4 flex-row items-center gap-3">
          <Lock size={20} color="#0D9488" strokeWidth={2.5} />
          <Text className="text-xs font-nunito text-teal-900 flex-1">
            Os seus dados médicos são encriptados de ponta a ponta e partilhados estritamente com unidades hospitalares no momento da marcação.
          </Text>
        </View>

        <View className="bg-white rounded-3xl p-5 border border-slate-200/80 gap-4 shadow-xs">
          <View className="flex-row items-center gap-2">
            <FileText size={18} color="#0F172A" strokeWidth={2.5} />
            <Text className="text-sm font-nunito-extrabold text-slate-900">
              Termos de Serviço do SaúdeLink
            </Text>
          </View>

          <Text className="text-xs font-nunito text-slate-600 leading-relaxed">
            1. <Text className="font-nunito-bold text-slate-900">Finalidade do Serviço:</Text> O SaúdeLink é uma plataforma tecnológica de localização, agendamento e navegação de emergência hospitalar na República de Angola.
          </Text>

          <Text className="text-xs font-nunito text-slate-600 leading-relaxed">
            2. <Text className="font-nunito-bold text-slate-900">Responsabilidade Médica:</Text> A prestação de cuidados de saúde é da inteira responsabilidade dos hospitais, clínicas e profissionais credenciados. O SaúdeLink atua como facilitador de acesso e conectividade em tempo real.
          </Text>

          <Text className="text-xs font-nunito text-slate-600 leading-relaxed">
            3. <Text className="font-nunito-bold text-slate-900">Privacidade dos Dados Clínicos:</Text> Todas as informações pessoais (grupo sanguíneo, histórico e contactos de emergência) são processadas em conformidade com as diretrizes de proteção de dados e encriptação avançada.
          </Text>
        </View>
      </ScrollView>
    </SafeArea>
  );
}
