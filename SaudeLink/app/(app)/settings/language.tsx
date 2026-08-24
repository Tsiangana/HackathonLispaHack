import { router } from 'expo-router';
import { ArrowLeft, Check, Globe } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import { SafeArea } from '@/components/layout/SafeArea';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

const LANGUAGES = [
  { id: 'pt-ao', name: 'Português (Angola)', flag: '🇦🇴', code: 'PT-AO' },
  { id: 'pt-pt', name: 'Português (Portugal)', flag: '🇵🇹', code: 'PT-PT' },
  { id: 'en-us', name: 'English (United States)', flag: '🇺🇸', code: 'EN-US' },
  { id: 'fr-fr', name: 'Français (France)', flag: '🇫🇷', code: 'FR-FR' },
  { id: 'umb', name: 'Umbundu (Angola)', flag: '🇦🇴', code: 'UMB' },
  { id: 'kmb', name: 'Kimbundu (Angola)', flag: '🇦🇴', code: 'KMB' },
];

export default function LanguageSettingsScreen() {
  const { session, loading: authLoading } = useAuth();

  const [selectedId, setSelectedId] = useState('pt-ao');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = useCallback(async (userId: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('user_settings')
        .select('preferred_language')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao carregar idioma:', error);
        return;
      }

      if (!data) {
        // Criar linha vazia para o utilizador
        const { error: insertError } = await supabase
          .from('user_settings')
          .insert({ user_id: userId });

        if (insertError) {
          console.error('Erro ao criar user_settings:', insertError);
        }
        // Manter o default 'pt-ao'
        return;
      }

      if (data.preferred_language) {
        setSelectedId(data.preferred_language);
      }
      // Se preferred_language for null, manter o default 'pt-ao'
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

  const handleSelect = async (lang: (typeof LANGUAGES)[number]) => {
    if (!session?.user?.id || saving) return;

    setSelectedId(lang.id);
    setSaving(true);

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert(
          {
            user_id: session.user.id,
            preferred_language: lang.id,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) {
        console.error('Erro ao guardar idioma:', error);
      }
    } finally {
      setSaving(false);
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
              Idioma da Aplicação
            </Text>
            <Text className="text-xs font-nunito text-slate-500">
              Idioma preferencial de navegação
            </Text>
          </View>
        </View>

        <View className="w-9 h-9 rounded-full bg-indigo-50 items-center justify-center">
          {loading ? (
            <ActivityIndicator size="small" color="#4F46E5" />
          ) : (
            <Globe size={20} color="#4F46E5" strokeWidth={2.5} />
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, gap: 16 }}
      >
        <View className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedId === lang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                onPress={() => handleSelect(lang)}
                disabled={loading}
                className="flex-row items-center justify-between p-4 border-b border-slate-100 last:border-b-0 active:bg-slate-50"
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <Text className="text-2xl">{lang.flag}</Text>
                  <View className="flex-1">
                    <Text className="text-sm font-nunito-extrabold text-slate-900">
                      {lang.name}
                    </Text>
                    <Text className="text-xs font-nunito text-slate-400">
                      {lang.code}
                    </Text>
                  </View>
                </View>

                {isSelected && (
                  <View className="w-6 h-6 rounded-full bg-brand-red items-center justify-center">
                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeArea>
  );
}
