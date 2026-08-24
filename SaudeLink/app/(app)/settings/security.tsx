import { router } from 'expo-router';
import { ArrowLeft, Check, KeyRound, Lock, ShieldCheck, Smartphone } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { SafeArea } from '@/components/layout/SafeArea';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function SecuritySettingsScreen() {
  const { session, loading: authLoading } = useAuth();

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [loading, setLoading] = useState(true);
  const [savingBiometric, setSavingBiometric] = useState(false);
  const [savingTwoFactor, setSavingTwoFactor] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  const loadSettings = useCallback(async (userId: string) => {
    try {
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from('user_settings')
        .select('biometric_enabled, two_factor_enabled')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('Erro ao carregar definições de segurança:', fetchError);
        return;
      }

      if (!data) {
        const { error: insertError } = await supabase
          .from('user_settings')
          .insert({ user_id: userId });

        if (insertError) {
          console.error('Erro ao criar user_settings:', insertError);
        }
        return;
      }

      setBiometricsEnabled(data.biometric_enabled ?? false);
      setTwoFactorEnabled(data.two_factor_enabled ?? false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }
    loadSettings(session.user.id);
  }, [authLoading, session?.user?.id, loadSettings]);

  const handleBiometricToggle = async (value: boolean) => {
    if (!session?.user?.id || savingBiometric) return;

    setBiometricsEnabled(value);
    setSavingBiometric(true);

    try {
      const { error: upsertError } = await supabase
        .from('user_settings')
        .upsert(
          {
            user_id: session.user.id,
            biometric_enabled: value,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (upsertError) {
        console.error('Erro ao guardar preferência de biometria:', upsertError);
        setBiometricsEnabled(!value); // reverter em caso de erro
      }
    } finally {
      setSavingBiometric(false);
    }
  };

  const handleTwoFactorToggle = async (value: boolean) => {
    if (!session?.user?.id || savingTwoFactor) return;

    setTwoFactorEnabled(value);
    setSavingTwoFactor(true);

    try {
      const { error: upsertError } = await supabase
        .from('user_settings')
        .upsert(
          {
            user_id: session.user.id,
            two_factor_enabled: value,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (upsertError) {
        console.error('Erro ao guardar preferência de 2FA:', upsertError);
        setTwoFactorEnabled(!value); // reverter em caso de erro
      }
    } finally {
      setSavingTwoFactor(false);
    }
  };

  const handleSavePassword = async () => {
    setError('');
    setSavedSuccess(false);

    if (!currentPass.trim()) {
      setError('Introduz a palavra-passe atual.');
      return;
    }
    if (!newPass.trim()) {
      setError('Introduz a nova palavra-passe.');
      return;
    }
    if (newPass !== confirmPass) {
      setError('A nova palavra-passe e a confirmação não coincidem.');
      return;
    }
    if (newPass.length < 6) {
      setError('A nova palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }
    if (!session?.user?.email) {
      setError('Sessão inválida. Inicia sessão novamente.');
      return;
    }

    setSavingPassword(true);

    try {
      // Reautenticar com a palavra-passe atual
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: currentPass,
      });

      if (signInError) {
        setError('Palavra-passe atual incorreta.');
        return;
      }

      // Atualizar para a nova palavra-passe
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPass,
      });

      if (updateError) {
        console.error('Erro ao atualizar palavra-passe:', updateError);
        setError('Não foi possível atualizar a palavra-passe. Tenta novamente.');
        return;
      }

      // Sucesso: limpar campos e mostrar mensagem
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSavingPassword(false);
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
              Segurança &amp; Acesso
            </Text>
            <Text className="text-xs font-nunito text-slate-500">
              Proteção da conta e credenciais
            </Text>
          </View>
        </View>

        <View className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center">
          {loading ? (
            <ActivityIndicator size="small" color="#64748B" />
          ) : (
            <Lock size={20} color="#0F172A" strokeWidth={2.5} />
          )}
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

        {error ? (
          <View className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <Text className="text-sm font-nunito-bold text-red-700">{error}</Text>
          </View>
        ) : null}

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

            {savingBiometric ? (
              <ActivityIndicator size="small" color="#D9232E" />
            ) : (
              <Switch
                value={biometricsEnabled}
                onValueChange={handleBiometricToggle}
                disabled={loading}
                trackColor={{ false: '#E2E8F0', true: '#D9232E' }}
                thumbColor="#FFFFFF"
              />
            )}
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

            {savingTwoFactor ? (
              <ActivityIndicator size="small" color="#D9232E" />
            ) : (
              <Switch
                value={twoFactorEnabled}
                onValueChange={handleTwoFactorToggle}
                disabled={loading}
                trackColor={{ false: '#E2E8F0', true: '#D9232E' }}
                thumbColor="#FFFFFF"
              />
            )}
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
              editable={!savingPassword}
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
              editable={!savingPassword}
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
              editable={!savingPassword}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-nunito text-slate-900"
            />
          </View>

          <TouchableOpacity
            onPress={handleSavePassword}
            disabled={savingPassword}
            className="w-full bg-slate-900 rounded-full flex-row items-center justify-center gap-2 active:opacity-90 mt-2"
            style={{ height: 48 }}
          >
            {savingPassword ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
                <Text className="text-sm font-nunito-extrabold text-white">
                  Atualizar Palavra-passe
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeArea>
  );
}
