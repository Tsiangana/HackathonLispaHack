import { router } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import { sendOtpCode } from '@/services/otpService';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const translateError = (msg?: string) => {
    if (!msg) return 'Erro ao criar conta. Tenta novamente.';
    const lower = msg.toLowerCase();
    if (lower.includes('already registered') || lower.includes('already in use')) {
      return 'Este email já está registado. Podes fazer login.';
    }
    if (lower.includes('weak') || lower.includes('password')) {
      return 'A password é demasiado fraca. Usa pelo menos 6 caracteres.';
    }
    return msg;
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      setError('Por favor introduz o teu nome completo.');
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Por favor introduz um email válido.');
      return;
    }

    if (!password || password.length < 6) {
      setError('A password deve ter pelo menos 6 caracteres.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      // Create Supabase user profile
      const { error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

      if (signUpError) {
        setError(translateError(signUpError.message));
        return;
      }

      // Send 6-digit OTP code to user's email
      const otpResult = await sendOtpCode(cleanEmail);
      if (!otpResult.success) {
        console.warn('OTP trigger warning:', otpResult.message);
      }

      // Redirect to OTP verification screen
      router.replace('/(auth)/email-login');
    } catch (err: any) {
      setError(translateError(err?.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAF8]">
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF8" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View className="flex-1 px-7 pt-4 pb-4">
          {/* Header navigation bar */}
          <View className="flex-row items-center justify-between h-12 mb-4">
            <TouchableOpacity
              onPress={() => router.replace('/(auth)/intro')}
              className="w-12 h-12 rounded-full bg-white border border-slate-200 items-center justify-center active:bg-slate-100"
            >
              <ArrowLeft size={20} color={colors.textDark} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Title + Subtitle section */}
          <View className="pt-2 mb-6">
            <Text className="text-3xl font-nunito-extrabold text-healthcare-900 text-center leading-[38px] mb-2">
              Criar Conta
            </Text>
            <Text className="text-base font-nunito text-slate-500 text-center leading-6 px-2">
              Cria o teu perfil no SaúdeLink para acederes a {'\n'}todos os serviços de saúde.
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4 mb-6">
            {/* Nome Field */}
            <View>
              <Text className="text-xs font-nunito-bold text-slate-500 mb-2 tracking-wider uppercase">
                Nome Completo
              </Text>
              <View
                className={`flex-row items-center bg-white rounded-2xl border-[1.5px] px-4 h-14 ${nameFocused ? 'border-brand-red' : 'border-slate-200'
                  }`}
              >
                <User
                  size={20}
                  color={nameFocused ? colors.primaryRed : colors.textMuted}
                  strokeWidth={2}
                />
                <TextInput
                  value={name}
                  onChangeText={(v) => {
                    setName(v);
                    if (error) setError('');
                  }}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  placeholder="Ex: Ana Silva"
                  placeholderTextColor={colors.textMuted}
                  className="flex-1 ml-3 text-base font-nunito text-slate-900"
                />
              </View>
            </View>

            {/* Email Field */}
            <View>
              <Text className="text-xs font-nunito-bold text-slate-500 mb-2 tracking-wider uppercase">
                Endereço de Email
              </Text>
              <View
                className={`flex-row items-center bg-white rounded-2xl border-[1.5px] px-4 h-14 ${emailFocused ? 'border-brand-red' : 'border-slate-200'
                  }`}
              >
                <Mail
                  size={20}
                  color={emailFocused ? colors.primaryRed : colors.textMuted}
                  strokeWidth={2}
                />
                <TextInput
                  value={email}
                  onChangeText={(v) => {
                    setEmail(v);
                    if (error) setError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="o.teu@email.com"
                  placeholderTextColor={colors.textMuted}
                  className="flex-1 ml-3 text-base font-nunito text-slate-900"
                />
              </View>
            </View>

            {/* Password Field */}
            <View>
              <Text className="text-xs font-nunito-bold text-slate-500 mb-2 tracking-wider uppercase">
                Password
              </Text>
              <View
                className={`flex-row items-center bg-white rounded-2xl border-[1.5px] px-4 h-14 ${passwordFocused ? 'border-brand-red' : 'border-slate-200'
                  }`}
              >
                <Lock
                  size={20}
                  color={passwordFocused ? colors.primaryRed : colors.textMuted}
                  strokeWidth={2}
                />
                <TextInput
                  value={password}
                  onChangeText={(v) => {
                    setPassword(v);
                    if (error) setError('');
                  }}
                  secureTextEntry={!showPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  className="flex-1 ml-3 text-base font-nunito text-slate-900"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  className="p-1"
                >
                  {showPassword ? (
                    <EyeOff size={20} color={colors.textMuted} strokeWidth={2} />
                  ) : (
                    <Eye size={20} color={colors.textMuted} strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {error ? (
              <Text className="text-xs font-nunito-semibold text-red-500 text-center mt-1">
                {error}
              </Text>
            ) : null}
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleRegister}
            disabled={loading}
            className="bg-brand-red rounded-full py-4 items-center flex-row justify-center gap-2 active:opacity-90 disabled:opacity-60 mb-6"
          >
            {loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : null}
            <Text className="text-base font-nunito-bold text-white tracking-wide">
              {loading ? 'A criar conta...' : 'Criar Conta'}
            </Text>
          </Pressable>

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

