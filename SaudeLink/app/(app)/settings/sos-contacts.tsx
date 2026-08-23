import { router } from 'expo-router';
import { ArrowLeft, Check, PhoneCall, Plus, ShieldAlert, UserCheck } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { SafeArea } from '@/components/layout/SafeArea';

interface Contact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

export default function SosContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Carlos Paulo', relation: 'Irmão', phone: '+244 924 111 222' },
    { id: '2', name: 'Dra. Maria Santos', relation: 'Médica de Família', phone: '+244 912 345 678' },
  ]);

  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [phone, setPhone] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = () => {
    if (name.trim() && phone.trim()) {
      setContacts([
        ...contacts,
        {
          id: Date.now().toString(),
          name: name.trim(),
          relation: relation.trim() || 'Familiar / Amigo',
          phone: phone.trim(),
        },
      ]);
      setName('');
      setRelation('');
      setPhone('');
      setShowAddForm(false);
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
              Contactos de Emergência SOS
            </Text>
            <Text className="text-xs font-nunito text-slate-500">
              Pessoas notificadas em situações críticas
            </Text>
          </View>
        </View>

        <View className="w-9 h-9 rounded-full bg-emerald-50 items-center justify-center">
          <PhoneCall size={20} color="#16A34A" strokeWidth={2.5} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, gap: 16 }}
      >
        <View className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex-row items-center gap-3">
          <ShieldAlert size={20} color="#D97706" strokeWidth={2.5} />
          <Text className="text-xs font-nunito text-amber-900 flex-1">
            Estes contactos receberão alertas com a sua localização exata quando acionar o botão de socorro ou ambulância no SaúdeLink.
          </Text>
        </View>

        {/* ── Contact List ── */}
        <View className="gap-3">
          {contacts.map((contact) => (
            <View
              key={contact.id}
              className="bg-white rounded-3xl p-4 border border-slate-200/80 flex-row items-center justify-between shadow-xs"
            >
              <View className="flex-row items-center gap-3.5 flex-1">
                <View className="w-11 h-11 rounded-full bg-emerald-100 items-center justify-center">
                  <UserCheck size={20} color="#16A34A" strokeWidth={2} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-nunito-extrabold text-slate-900">
                    {contact.name}
                  </Text>
                  <Text className="text-xs font-nunito-bold text-emerald-700">
                    {contact.relation}
                  </Text>
                  <Text className="text-xs font-nunito text-slate-500 mt-0.5">
                    {contact.phone}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ── Add Contact Form ── */}
        {showAddForm ? (
          <View className="bg-white rounded-3xl p-5 border border-slate-200/80 gap-3 shadow-xs mt-2">
            <Text className="text-sm font-nunito-extrabold text-slate-900">
              Novo Contacto de Emergência
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nome Completo"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-nunito text-slate-900"
            />
            <TextInput
              value={relation}
              onChangeText={setRelation}
              placeholder="Parentesco (ex: Pai, Esposa, Amigo...)"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-nunito text-slate-900"
            />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Número de Telefone (+244...)"
              keyboardType="phone-pad"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-nunito text-slate-900"
            />

            <View className="flex-row gap-3 pt-2">
              <TouchableOpacity
                onPress={() => setShowAddForm(false)}
                className="flex-1 bg-slate-100 rounded-full py-3 items-center justify-center active:bg-slate-200"
              >
                <Text className="text-sm font-nunito-extrabold text-slate-700">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAdd}
                className="flex-1 bg-brand-red rounded-full py-3 items-center justify-center active:opacity-90 flex-row gap-2"
              >
                <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
                <Text className="text-sm font-nunito-extrabold text-white">Adicionar</Text>
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
              Adicionar Contacto SOS
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeArea>
  );
}
