import { router } from 'expo-router';
import { ArrowLeft, Camera, Check, User } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { SafeArea } from '@/components/layout/SafeArea';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

function isoDateToDisplay(isoDate: string): string {
  const [year, month, day] = isoDate.slice(0, 10).split('-');

  if (!year || !month || !day) {
    return '';
  }

  return `${day}/${month}/${year}`;
}

function parseBirthDateForSave(value: string): { ok: true; date: string | null } | { ok: false } {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: true, date: null };
  }

  const parts = trimmed.split('/');

  if (parts.length !== 3) {
    return { ok: false };
  }

  const [dayPart, monthPart, yearPart] = parts;

  if (dayPart.length !== 2 || monthPart.length !== 2 || yearPart.length !== 4) {
    return { ok: false };
  }

  const day = Number(dayPart);
  const month = Number(monthPart);
  const year = Number(yearPart);

  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
    return { ok: false };
  }

  const date = new Date(year, month - 1, day);
  const isValidDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isValidDate) {
    return { ok: false };
  }

  return { ok: true, date: `${yearPart}-${monthPart}-${dayPart}` };
}

export default function ProfileSettingsScreen() {
  const { session, loading: authLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nif, setNif] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [, setAvatarUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async (userId: string, userEmail: string | undefined) => {
    try {
      setLoading(true);
      setError('');
      setEmail(userEmail ?? '');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, phone, nif, birth_date, avatar_url, is_verified')
        .eq('id', userId)
        .single();

      if (profileError) {
        throw profileError;
      }

      setName(profile.full_name ?? '');
      setPhone(profile.phone ?? '');
      setNif(profile.nif ?? '');
      setAvatarUrl(profile.avatar_url ?? null);

      if (profile.birth_date) {
        setBirthDate(isoDateToDisplay(profile.birth_date));
      } else {
        setBirthDate('');
      }
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      setError('Não foi possível carregar os dados do teu perfil.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!session?.user?.id) {
      setError('Não foi possível identificar o utilizador autenticado.');
      setLoading(false);
      return;
    }

    loadProfile(session.user.id, session.user.email);
  }, [authLoading, session?.user?.id, session?.user?.email, loadProfile]);

  const handleBirthDateChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);

    let formatted = digits;

    if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    }

    setBirthDate(formatted);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSavedSuccess(false);

      if (!session?.user?.id) {
        setError('Sessão inválida. Inicia sessão novamente.');
        return;
      }

      if (!name.trim()) {
        setError('O nome completo é obrigatório.');
        return;
      }

      const birthDateResult = parseBirthDateForSave(birthDate);

      if (!birthDateResult.ok) {
        setError('A data de nascimento deve estar no formato DD/MM/AAAA.');
        return;
      }

      const convertedBirthDate = birthDateResult.date;
      const trimmedName = name.trim();
      const trimmedPhone = phone.trim();
      const trimmedNif = nif.trim();

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: trimmedName,
          phone: trimmedPhone || null,
          nif: trimmedNif || null,
          birth_date: convertedBirthDate || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (updateError) {
        throw updateError;
      }

      setName(trimmedName);
      setPhone(trimmedPhone);
      setNif(trimmedNif);
      setBirthDate(convertedBirthDate ? isoDateToDisplay(convertedBirthDate) : '');
      setSavedSuccess(true);

      setTimeout(() => {
        setSavedSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Erro ao guardar perfil:', err);
      setError('Não foi possível guardar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    const value = name.trim();

    if (!value) {
      return 'U';
    }

    const parts = value.split(/\s+/);

    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const fieldsDisabled = loading || saving || authLoading;

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

        {error ? (
          <View className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <Text className="text-sm font-nunito-bold text-red-700">
              {error}
            </Text>
          </View>
        ) : null}

        {/* ── Avatar Edit ── */}
        <View className="items-center py-2">
          <View className="relative">
            <View className="w-24 h-24 rounded-full bg-brand-red items-center justify-center border-4 border-white shadow-sm">
              <Text className="text-3xl font-nunito-extrabold text-white">{getInitials()}</Text>
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
              editable={!fieldsDisabled}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-nunito-bold text-slate-900"
            />
          </View>

          <View>
            <Text className="text-xs font-nunito-bold text-slate-500 mb-1">E-mail</Text>
            <TextInput
              value={email}
              editable={false}
              keyboardType="email-address"
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-nunito-bold text-slate-900"
            />
          </View>

          <View>
            <Text className="text-xs font-nunito-bold text-slate-500 mb-1">Número de Telefone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              editable={!fieldsDisabled}
              keyboardType="phone-pad"
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-nunito-bold text-slate-900"
            />
          </View>

          <View>
            <Text className="text-xs font-nunito-bold text-slate-500 mb-1">Número de BI / NIF</Text>
            <TextInput
              value={nif}
              onChangeText={setNif}
              editable={!fieldsDisabled}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-nunito-bold text-slate-900"
            />
          </View>

          <View>
            <Text className="text-xs font-nunito-bold text-slate-500 mb-1">Data de Nascimento</Text>
            <TextInput
              value={birthDate}
              onChangeText={handleBirthDateChange}
              editable={!fieldsDisabled}
              keyboardType="number-pad"
              maxLength={10}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-nunito-bold text-slate-900"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={fieldsDisabled}
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
