import { router } from 'expo-router';
import { ArrowLeft, Camera, Check, User } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { SafeArea } from '@/components/layout/SafeArea';

export default function ProfileSettingsScreen() {
  const [name, setName] = useState('Ana Paulo');
  const [email, setEmail] = useState('ana.paulo@saudelink.app');
  const [phone, setPhone] = useState('+244 923 000 100');
  const [nif, setNif] = useState('006192842LA042');
  const [birthDate, setBirthDate] = useState('14/08/1996');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
              Dados Pessoais & Perfil
            </Text>
            <Text className="text-xs font-nunito text-slate-500">
              Informações da tua conta
            </Text>
          </View>
        </View>

        <View className="w-9 h-9 rounded-full bg-purple-50 items-center justify-center">
          <User size={20} color="#9333EA" strokeWidth={2.5} />
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
              Dados atualizados com sucesso!
            </Text>
          </View>
        )}

        {/* ── Avatar Edit ── */}
        <View className="items-center py-2">
          <View className="relative">
            <View className="w-24 h-24 rounded-full bg-brand-red items-center justify-center border-4 border-white shadow-sm">
              <Text className="text-3xl font-nunito-extrabold text-white">AP</Text>
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-900 items-center justify-center border-2 border-white">
              <Camera size={14} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <Text className="text-xs font-nunito text-slate-500 mt-2">
            Toque para alterar a foto de perfil
          </Text>
        </View>

        {/* ── Personal Info Form ── */}
        <View className="bg-white rounded-3xl p-5 border border-slate-200/80 gap-4 shadow-xs">
          <View>
            <Text className="text-xs font-nunito-bold text-slate-500 mb-1">Nome Completo</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-nunito-bold text-slate-900"
            />
          </View>

          <View>
            <Text className="text-xs font-nunito-bold text-slate-500 mb-1">E-mail</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-nunito-bold text-slate-900"
            />
          </View>

          <View>
            <Text className="text-xs font-nunito-bold text-slate-500 mb-1">Número de Telefone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-nunito-bold text-slate-900"
            />
          </View>

          <View>
            <Text className="text-xs font-nunito-bold text-slate-500 mb-1">Número de BI / NIF</Text>
            <TextInput
              value={nif}
              onChangeText={setNif}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-nunito-bold text-slate-900"
            />
          </View>

          <View>
            <Text className="text-xs font-nunito-bold text-slate-500 mb-1">Data de Nascimento</Text>
            <TextInput
              value={birthDate}
              onChangeText={setBirthDate}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-nunito-bold text-slate-900"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          className="w-full bg-brand-red rounded-full flex-row items-center justify-center gap-2 active:opacity-90 shadow-xs"
          style={{ height: 52 }}
        >
          <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
          <Text className="text-base font-nunito-extrabold text-white">
            Guardar Alterações
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeArea>
  );
}
