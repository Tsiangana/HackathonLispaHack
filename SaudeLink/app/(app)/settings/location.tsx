import { router } from 'expo-router';
import { ArrowLeft, Check, MapPin, Search } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { SafeArea } from '@/components/layout/SafeArea';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

const ANGOLA_LOCATIONS = [
  { id: '1', province: 'Luanda', municipality: 'Ingombota / Baixa de Luanda' },
  { id: '2', province: 'Luanda', municipality: 'Talatona' },
  { id: '3', province: 'Luanda', municipality: 'Belas / Kilamba' },
  { id: '4', province: 'Luanda', municipality: 'Viana' },
  { id: '5', province: 'Luanda', municipality: 'Cazenga' },
  { id: '6', province: 'Luanda', municipality: 'Cacuaco' },
  { id: '7', province: 'Luanda', municipality: 'Kilamba Kiaxi' },
  { id: '8', province: 'Benguela', municipality: 'Benguela Central' },
  { id: '9', province: 'Huambo', municipality: 'Huambo Central' },
  { id: '10', province: 'Cabinda', municipality: 'Cabinda' },
  { id: '11', province: 'Huíla', municipality: 'Lubango' },
];

export default function LocationSettingsScreen() {
  const { session, loading: authLoading } = useAuth();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = useCallback(async (userId: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('user_settings')
        .select('location_province, location_municipality')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao carregar localização:', error);
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
        return;
      }

      if (data.location_province && data.location_municipality) {
        const match = ANGOLA_LOCATIONS.find(
          (loc) =>
            loc.province === data.location_province &&
            loc.municipality === data.location_municipality
        );
        if (match) {
          setSelectedId(match.id);
        }
      }
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

  const handleSelect = async (loc: (typeof ANGOLA_LOCATIONS)[number]) => {
    if (!session?.user?.id || saving) return;

    setSelectedId(loc.id);
    setSaving(true);

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert(
          {
            user_id: session.user.id,
            location_province: loc.province,
            location_municipality: loc.municipality,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) {
        console.error('Erro ao guardar localização:', error);
      }
    } finally {
      setSaving(false);
    }
  };

  const filteredLocations = ANGOLA_LOCATIONS.filter(
    (loc) =>
      loc.municipality.toLowerCase().includes(search.toLowerCase()) ||
      loc.province.toLowerCase().includes(search.toLowerCase())
  );

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
              Localização Padrão
            </Text>
            <Text className="text-xs font-nunito text-slate-500">
              Região para filtragem de hospitais
            </Text>
          </View>
        </View>

        <View className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center">
          {loading ? (
            <ActivityIndicator size="small" color="#64748B" />
          ) : (
            <MapPin size={20} color="#0F172A" strokeWidth={2.5} />
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, gap: 16 }}
      >
        {/* Search Bar */}
        <View className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 flex-row items-center gap-3 shadow-xs">
          <Search size={18} color="#94A3B8" strokeWidth={2} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Pesquisar província ou município..."
            placeholderTextColor="#94A3B8"
            className="flex-1 text-sm font-nunito text-slate-900"
          />
        </View>

        {/* Location List */}
        <View className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          {filteredLocations.map((loc) => {
            const isSelected = selectedId === loc.id;
            return (
              <TouchableOpacity
                key={loc.id}
                onPress={() => handleSelect(loc)}
                disabled={loading}
                className="flex-row items-center justify-between p-4 border-b border-slate-100 last:border-b-0 active:bg-slate-50"
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <View
                    className={`w-9 h-9 rounded-2xl items-center justify-center ${
                      isSelected ? 'bg-brand-red' : 'bg-slate-100'
                    }`}
                  >
                    <MapPin size={18} color={isSelected ? '#FFFFFF' : '#64748B'} strokeWidth={2} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-nunito-extrabold text-slate-900">
                      {loc.municipality}
                    </Text>
                    <Text className="text-xs font-nunito text-slate-500">
                      {`Província de ${loc.province}`}
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
