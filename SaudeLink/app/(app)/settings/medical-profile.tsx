import { router } from 'expo-router';
import { ArrowLeft, Check, HeartPulse, Plus, ShieldAlert, Trash2 } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { SafeArea } from '@/components/layout/SafeArea';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export default function MedicalProfileScreen() {
  const { session, loading: authLoading } = useAuth();

  const [selectedBlood, setSelectedBlood] = useState('O+');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState('');
  const [chronicConditions, setChronicConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  const loadMedicalProfile = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('user_settings')
        .select('blood_type, allergies, chronic_conditions')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('Erro ao carregar perfil médico:', fetchError);
        return;
      }

      if (data) {
        if (data.blood_type) setSelectedBlood(data.blood_type);
        if (Array.isArray(data.allergies)) setAllergies(data.allergies);
        if (Array.isArray(data.chronic_conditions)) setChronicConditions(data.chronic_conditions);
      }
    } catch (err) {
      console.error('Erro ao carregar perfil médico:', err);
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
    loadMedicalProfile(session.user.id);
  }, [authLoading, session?.user?.id, loadMedicalProfile]);

  const addAllergy = () => {
    const val = newAllergy.trim();
    if (val && !allergies.includes(val)) {
      setAllergies([...allergies, val]);
      setNewAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const addCondition = () => {
    const val = newCondition.trim();
    if (val && !chronicConditions.includes(val)) {
      setChronicConditions([...chronicConditions, val]);
      setNewCondition('');
    }
  };

  const removeCondition = (index: number) => {
    setChronicConditions(chronicConditions.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!session?.user?.id || saving) return;

    setSaving(true);
    setError('');

    try {
      const { error: saveError } = await supabase
        .from('user_settings')
        .upsert(
          {
            user_id: session.user.id,
            blood_type: selectedBlood,
            allergies,
            chronic_conditions: chronicConditions,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (saveError) {
        console.error('Erro ao guardar perfil médico:', saveError);
        setError('Não foi possível guardar no servidor.');
        return;
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Erro inesperado ao guardar perfil médico:', err);
      setError('Ocorreu um erro ao guardar.');
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
              Perfil Médico & Alergias
            </Text>
            <Text className="text-xs font-nunito text-slate-500">
              Ficha clínica de emergência
            </Text>
          </View>
        </View>

        <View className="w-9 h-9 rounded-full bg-red-50 items-center justify-center">
          {loading ? (
            <ActivityIndicator size="small" color="#D9232E" />
          ) : (
            <HeartPulse size={20} color="#D9232E" strokeWidth={2.5} />
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
              Ficha médica guardada com sucesso!
            </Text>
          </View>
        )}

        {error ? (
          <View className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <Text className="text-sm font-nunito-bold text-red-700">{error}</Text>
          </View>
        ) : null}

        {/* ── Grupo Sanguíneo ── */}
        <View className="bg-white rounded-3xl p-5 border border-slate-200/80 gap-3 shadow-xs">
          <Text className="text-sm font-nunito-extrabold text-slate-900">
            Grupo Sanguíneo
          </Text>
          <Text className="text-xs font-nunito text-slate-500">
            Selecione o seu tipo de sangue correto para transfusões de emergência
          </Text>

          <View className="flex-row flex-wrap gap-2 pt-1">
            {BLOOD_TYPES.map((type) => {
              const isSelected = selectedBlood === type;
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => setSelectedBlood(type)}
                  disabled={loading || saving}
                  className={`px-4 py-2.5 rounded-2xl border ${
                    isSelected
                      ? 'bg-brand-red border-brand-red'
                      : 'bg-slate-50 border-slate-200/80 active:bg-slate-100'
                  }`}
                >
                  <Text
                    className={`text-sm font-nunito-extrabold ${
                      isSelected ? 'text-white' : 'text-slate-800'
                    }`}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Alergias Registradas ── */}
        <View className="bg-white rounded-3xl p-5 border border-slate-200/80 gap-3 shadow-xs">
          <View className="flex-row items-center gap-2">
            <ShieldAlert size={18} color="#D9232E" strokeWidth={2.5} />
            <Text className="text-sm font-nunito-extrabold text-slate-900">
              Alergias Medicamentosas & Alimentares
            </Text>
          </View>

          <View className="flex-row gap-2">
            <TextInput
              value={newAllergy}
              onChangeText={setNewAllergy}
              placeholder="Ex: Penicilina, Dipirona..."
              placeholderTextColor="#94A3B8"
              editable={!loading && !saving}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-nunito text-slate-900"
            />
            <TouchableOpacity
              onPress={addAllergy}
              disabled={loading || saving}
              className="bg-slate-900 px-4 rounded-2xl items-center justify-center active:opacity-90"
            >
              <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap gap-2 pt-1">
            {allergies.map((allergy, index) => (
              <View
                key={index}
                className="bg-red-50 border border-red-200/80 px-3 py-1.5 rounded-xl flex-row items-center gap-2"
              >
                <Text className="text-xs font-nunito-bold text-red-900">{allergy}</Text>
                <TouchableOpacity onPress={() => removeAllergy(index)} disabled={loading || saving}>
                  <Trash2 size={14} color="#D9232E" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* ── Condições Crónicas ── */}
        <View className="bg-white rounded-3xl p-5 border border-slate-200/80 gap-3 shadow-xs">
          <Text className="text-sm font-nunito-extrabold text-slate-900">
            Condições Crónicas / Diagnósticos
          </Text>

          <View className="flex-row gap-2">
            <TextInput
              value={newCondition}
              onChangeText={setNewCondition}
              placeholder="Ex: Diabetes Tipo 2, Asma..."
              placeholderTextColor="#94A3B8"
              editable={!loading && !saving}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-nunito text-slate-900"
            />
            <TouchableOpacity
              onPress={addCondition}
              disabled={loading || saving}
              className="bg-slate-900 px-4 rounded-2xl items-center justify-center active:opacity-90"
            >
              <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap gap-2 pt-1">
            {chronicConditions.map((condition, index) => (
              <View
                key={index}
                className="bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-xl flex-row items-center gap-2"
              >
                <Text className="text-xs font-nunito-bold text-slate-800">{condition}</Text>
                <TouchableOpacity onPress={() => removeCondition(index)} disabled={loading || saving}>
                  <Trash2 size={14} color="#64748B" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* ── Botão Guardar ── */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={loading || saving}
          className="w-full bg-brand-red rounded-full flex-row items-center justify-center gap-2 active:opacity-90 shadow-xs"
          style={{ height: 52 }}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
              <Text className="text-base font-nunito-extrabold text-white">
                Guardar Ficha Médica
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeArea>
  );
}
