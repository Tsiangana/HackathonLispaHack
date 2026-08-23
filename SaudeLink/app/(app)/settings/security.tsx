import { router } from 'expo-router';
import { ArrowLeft, Check, KeyRound, Lock, ShieldCheck, Smartphone } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StatusBar, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { SafeArea } from '@/components/layout/SafeArea';

export default function SecuritySettingsScreen() {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePassword = () => {
    if (newPass && newPass === confirmPass) {
      setSavedSuccess(true);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

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
              Segurança & Acesso
            </Text>
            <Text className="text-xs font-nunito text-slate-500">
              Proteção da conta e credenciais
            </Text>
          </View>
        </View>

        <View className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center">
          <Lock size={20} color="#0F172A" strokeWidth={2.5} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, gap: 20 }}
      >
        {savedSuccess && (
          <View className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex-row items-center gap-3">
            <View className="w-8 h-8 rounded-full bg-emerald-500 items-center justify-center">
              <Check size={18} color="#FFFFFF" strokeWidth={3} />
            </View>
            <Text className="text-sm font-nunito-extrabold text-emerald-900">
              Palavra-passe alterada com sucesso!
            </Text>
          </View>
        )}

        {/* ── Biometria & 2FA ── */}
        <View className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <View className="flex-row items-center justify-between p-4 border-b border-slate-100">
            <View className="flex-row items-center gap-3 flex-1 pr-2">
              <View className="w-10 h-10 rounded-2xl bg-indigo-50 items-center justify-center">
                <ShieldCheck size={20} color="#4F46E5" strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-nunito-extrabold text-slate-900">
                  Biometria / Face ID
                </Text>
                <Text className="text-xs font-nunito text-slate-500 mt-0.5">
                  Acessar a app com impressão digital ou rosto
                </Text>
              </View>
            </View>

            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: '#E2E8F0', true: '#D9232E' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3 flex-1 pr-2">
              <View className="w-10 h-10 rounded-2xl bg-amber-50 items-center justify-center">
                <Smartphone size={20} color="#D97706" strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-nunito-extrabold text-slate-900">
                  Autenticação de 2 Factores (2FA)
                </Text>
                <Text className="text-xs font-nunito text-slate-500 mt-0.5">
                  Confirmar acessos com código por SMS
                </Text>
              </View>
            </View>

            <Switch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              trackColor={{ false: '#E2E8F0', true: '#D9232E' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* ── Alterar Palavra-passe ── */}
        <View className="bg-white rounded-3xl p-5 border border-slate-200/80 gap-4 shadow-xs">
          <View className="flex-row items-center gap-2">
            <KeyRound size={18} color="#0F172A" strokeWidth={2.5} />
            <Text className="text-sm font-nunito-extrabold text-slate-900">
              Alterar Palavra-passe
            </Text>
          </View>

          <View>
            <Text className="text-xs font-nunito-bold text-slate-500 mb-1">Palavra-passe Atual</Text>
            <TextInput
              value={currentPass}
              onChangeText={setCurrentPass}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-nunito text-slate-900"
            />
          </View>

          <View>
            <Text className="text-xs font-nunito-bold text-slate-500 mb-1">Nova Palavra-passe</Text>
            <TextInput
              value={newPass}
              onChangeText={setNewPass}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-nunito text-slate-900"
            />
          </View>

          <View>
            <Text className="text-xs font-nunito-bold text-slate-500 mb-1">Confirmar Nova Palavra-passe</Text>
            <TextInput
              value={confirmPass}
              onChangeText={setConfirmPass}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-nunito text-slate-900"
            />
          </View>

          <TouchableOpacity
            onPress={handleSavePassword}
            className="w-full bg-slate-900 rounded-full flex-row items-center justify-center gap-2 active:opacity-90 mt-2"
            style={{ height: 48 }}
          >
            <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
            <Text className="text-sm font-nunito-extrabold text-white">
              Atualizar Palavra-passe
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeArea>
  );
}
