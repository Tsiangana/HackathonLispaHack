import { router } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';
import { useState } from 'react';
import {
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

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = () => {
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
    router.replace('/(app)/(tabs)');
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
              onPress={() => router.back()}
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
                className={`flex-row items-center bg-white rounded-2xl border-[1.5px] px-4 h-14 ${
                  nameFocused ? 'border-brand-red' : 'border-slate-200'
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
                className={`flex-row items-center bg-white rounded-2xl border-[1.5px] px-4 h-14 ${
                  emailFocused ? 'border-brand-red' : 'border-slate-200'
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
                className={`flex-row items-center bg-white rounded-2xl border-[1.5px] px-4 h-14 ${
                  passwordFocused ? 'border-brand-red' : 'border-slate-200'
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
            className="bg-brand-red rounded-full py-4 items-center active:opacity-90 mb-6"
          >
            <Text className="text-base font-nunito-bold text-white tracking-wide">
              Criar Conta
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

