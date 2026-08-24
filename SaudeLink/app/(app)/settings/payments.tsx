import { router } from 'expo-router';
import { ArrowLeft, CreditCard, Plus, ShieldCheck, Trash2, Wallet } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { SafeArea } from '@/components/layout/SafeArea';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

type PaymentMethod = {
  id: string;
  user_id: string;
  title: string;
  subtitle: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export default function PaymentsSettingsScreen() {
  const { session, loading: authLoading } = useAuth();

  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');

  const loadMethods = useCallback(async (userId: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('payment_methods')
        .select('id, user_id, title, subtitle, is_active, created_at, updated_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar métodos de pagamento:', error);
        return;
      }

      setMethods(data ?? []);
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
    loadMethods(session.user.id);
  }, [authLoading, session?.user?.id, loadMethods]);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    if (!session?.user?.id || saving) return;

    setSaving(true);

    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: session.user.id,
          title: newTitle.trim(),
          subtitle: newSubtitle.trim() || null,
          is_active: true,
        })
        .select('id, user_id, title, subtitle, is_active, created_at, updated_at')
        .single();

      if (error) {
        console.error('Erro ao adicionar método de pagamento:', error);
        return;
      }

      setMethods((prev) => [...prev, data]);
      setNewTitle('');
      setNewSubtitle('');
      setShowAddForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (paymentId: string) => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', paymentId)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Erro ao eliminar método de pagamento:', error);
        return;
      }

      setMethods((prev) => prev.filter((m) => m.id !== paymentId));
    } catch (err) {
      console.error('Erro inesperado ao eliminar método de pagamento:', err);
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
              Métodos de Pagamento
            </Text>
            <Text className="text-xs font-nunito text-slate-500">
              Cartões e contas para consultas e serviços
            </Text>
          </View>
        </View>

        <View className="w-9 h-9 rounded-full bg-emerald-50 items-center justify-center">
          {loading ? (
            <ActivityIndicator size="small" color="#059669" />
          ) : (
            <CreditCard size={20} color="#059669" strokeWidth={2.5} />
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, gap: 16 }}
      >
        <View className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex-row items-center gap-3">
          <ShieldCheck size={20} color="#059669" strokeWidth={2.5} />
          <Text className="text-xs font-nunito text-emerald-900 flex-1">
            Os seus dados financeiros são encriptados e protegidos com os padrões de segurança bancária da rede EMIS / Multicaixa.
          </Text>
        </View>

        {/* ── Payment Methods List ── */}
        <View className="gap-3">
          {methods.map((method) => (
            <View
              key={method.id}
              className="bg-white rounded-3xl p-4 border border-slate-200/80 flex-row items-center justify-between shadow-xs"
            >
              <View className="flex-row items-center gap-3.5 flex-1 pr-2">
                <View className="w-11 h-11 rounded-2xl bg-slate-900 items-center justify-center">
                  <Wallet size={20} color="#FFFFFF" strokeWidth={2} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-nunito-extrabold text-slate-900">
                    {method.title}
                  </Text>
                  {method.subtitle ? (
                    <Text className="text-xs font-nunito text-slate-500 mt-0.5" numberOfLines={1}>
                      {method.subtitle}
                    </Text>
                  ) : null}
                </View>
              </View>

              <TouchableOpacity
                onPress={() => handleDelete(method.id)}
                className="w-9 h-9 rounded-full bg-red-50 items-center justify-center active:bg-red-100 ml-2"
              >
                <Trash2 size={16} color="#DC2626" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* ── Add Form ── */}
        {showAddForm ? (
          <View className="bg-white rounded-3xl p-5 border border-slate-200/80 gap-3 shadow-xs mt-2">
            <Text className="text-sm font-nunito-extrabold text-slate-900">
              Novo Método de Pagamento
            </Text>

            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Ex: Cartão Multicaixa / Visa"
              placeholderTextColor="#94A3B8"
              editable={!saving}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-nunito text-slate-900"
            />
            <TextInput
              value={newSubtitle}
              onChangeText={setNewSubtitle}
              placeholder="Número ou IBAN da Conta"
              placeholderTextColor="#94A3B8"
              editable={!saving}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-nunito text-slate-900"
            />

            <View className="flex-row gap-3 pt-2">
              <TouchableOpacity
                onPress={() => setShowAddForm(false)}
                disabled={saving}
                className="flex-1 bg-slate-100 rounded-full py-3 items-center justify-center active:bg-slate-200"
              >
                <Text className="text-sm font-nunito-extrabold text-slate-700">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAdd}
                disabled={saving}
                className="flex-1 bg-brand-red rounded-full py-3 items-center justify-center active:opacity-90"
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-sm font-nunito-extrabold text-white">Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setShowAddForm(true)}
            className="w-full bg-slate-900 rounded-full flex-row items-center justify-center gap-2 active:opacity-90 mt-2"
            style={{ height: 50 }}
          >
            <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
            <Text className="text-sm font-nunito-extrabold text-white">
              Adicionar Método de Pagamento
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeArea>
  );
}
