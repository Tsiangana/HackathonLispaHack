import { router } from 'expo-router';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle, MessageSquare, PhoneCall } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import { SafeArea } from '@/components/layout/SafeArea';

const FAQS = [
  {
    id: '1',
    question: 'Como funciona a navegação de emergência no SaúdeLink?',
    answer:
      'O SaúdeLink localiza a sua posição GPS e calcula a rota mais rápida em tempo real para os hospitais mais próximos com urgência ativa e vagas disponíveis.',
  },
  {
    id: '2',
    question: 'Como os hospitais recebem a minha marcação de consulta?',
    answer:
      'Assim que confirma a rota ou marcação na app, um código de referência único (Ref ID) é enviado diretamente para o painel clínico do hospital parceiro.',
  },
  {
    id: '3',
    question: 'Como solicitar uma ambulância de emergência?',
    answer:
      'No mapa ou ecrã inicial, selecione a aba de Ambulâncias ou clique no botão vermelho de emergência SOS para enviar a sua posição direta à central de resgate.',
  },
  {
    id: '4',
    question: 'O SaúdeLink funciona em todas as províncias de Angola?',
    answer:
      'Atualmente cobrimos toda a província de Luanda com dados em tempo real, estando em expansão para Benguela, Huambo, Huíla e Cabinda.',
  },
];

export default function HelpSettingsScreen() {
  const [expandedId, setExpandedId] = useState<string | null>('1');

  const toggleFaq = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
              Centro de Ajuda & FAQ
            </Text>
            <Text className="text-xs font-nunito text-slate-500">
              Suporte 24/7 e respostas frequentes
            </Text>
          </View>
        </View>

        <View className="w-9 h-9 rounded-full bg-sky-50 items-center justify-center">
          <HelpCircle size={20} color="#0284C7" strokeWidth={2.5} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, gap: 16 }}
      >
        {/* Support Direct Action Cards */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => Linking.openURL('tel:112')}
            className="flex-1 bg-brand-red rounded-3xl p-4 gap-2 active:opacity-90 shadow-xs"
          >
            <View className="w-9 h-9 rounded-full bg-white/20 items-center justify-center">
              <PhoneCall size={18} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <Text className="text-sm font-nunito-extrabold text-white">
              Linha 112 SOS
            </Text>
            <Text className="text-[11px] font-nunito text-white/80">
              Chamada de emergência nacional
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL('https://wa.me/244923000100')}
            className="flex-1 bg-slate-900 rounded-3xl p-4 gap-2 active:opacity-90 shadow-xs"
          >
            <View className="w-9 h-9 rounded-full bg-white/20 items-center justify-center">
              <MessageSquare size={18} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <Text className="text-sm font-nunito-extrabold text-white">
              Chat Suporte
            </Text>
            <Text className="text-[11px] font-nunito text-slate-400">
              Atendimento 24/7 via WhatsApp
            </Text>
          </TouchableOpacity>
        </View>

        {/* FAQs Section */}
        <Text className="text-xs font-nunito-extrabold text-slate-400 uppercase tracking-wider mt-2 px-1">
          Perguntas Frequentes
        </Text>

        <View className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          {FAQS.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <View key={faq.id} className="border-b border-slate-100 last:border-b-0">
                <TouchableOpacity
                  onPress={() => toggleFaq(faq.id)}
                  className="flex-row items-center justify-between p-4 active:bg-slate-50 gap-3"
                >
                  <Text className="text-sm font-nunito-extrabold text-slate-900 flex-1">
                    {faq.question}
                  </Text>
                  {isExpanded ? (
                    <ChevronUp size={18} color="#94A3B8" strokeWidth={2} />
                  ) : (
                    <ChevronDown size={18} color="#94A3B8" strokeWidth={2} />
                  )}
                </TouchableOpacity>

                {isExpanded && (
                  <View className="px-4 pb-4 pt-1 bg-slate-50/60 border-t border-slate-100">
                    <Text className="text-xs font-nunito text-slate-600 leading-relaxed">
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeArea>
  );
}
