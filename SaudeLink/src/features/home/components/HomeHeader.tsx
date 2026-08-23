import { router } from 'expo-router';
import { ChevronRight, Phone, Settings, X } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/constants/colors';

const CALL_CENTER_NUMBER = '+244 928 636 896';

export function HomeHeader() {
  const [showCallModal, setShowCallModal] = useState(false);

  const handleCallCenter = () => {
    setShowCallModal(false);
    Linking.openURL(`tel:${CALL_CENTER_NUMBER.replace(/\s/g, '')}`);
  };

  return (
    <>
      <View className="flex-row items-center justify-between pt-2 pb-2">
        <View>
          <Text className="text-3xl font-nunito-bold text-brand-red tracking-tighter">
            SAÚDELINK
          </Text>
          <TouchableOpacity className="flex-row items-center gap-0.5 mt-0.5">
            <Text className="text-sm font-nunito-extrabold text-slate-800">
              Nacional
            </Text>
            <View className="w-4 h-4 rounded-full bg-slate-900 justify-center items-center ml-1">
              <ChevronRight size={10} color="#FFFFFF" strokeWidth={3} />
            </View>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center gap-2">
          {/* Call Center Icon */}
          <TouchableOpacity
            onPress={() => setShowCallModal(true)}
            className="w-10 h-10 rounded-full bg-[#2196C7]/10 items-center justify-center active:opacity-70"
          >
            <Phone size={20} color="#2196C7" strokeWidth={2.2} />
          </TouchableOpacity>

          {/* Settings Icon */}
          <TouchableOpacity
            onPress={() => router.push('/(app)/(tabs)/settings')}
            className="w-10 h-10 items-center justify-center active:opacity-60"
          >
            <Settings size={30} color={colors.textDark} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Call Center Confirmation Modal ── */}
      <Modal
        visible={showCallModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowCallModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 items-center justify-end pb-6 px-4 z-[9999]"
          onPress={() => setShowCallModal(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="w-full bg-white rounded-3xl overflow-hidden"
          >
            {/* Modal Header */}
            <View className="px-6 pt-6 pb-4 flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-lg font-nunito-extrabold text-slate-900 leading-6 mb-1">
                  Ligar para o Call Center?
                </Text>
                <Text className="text-sm font-nunito text-slate-500 leading-5">
                  Será ligado para um operador do SaúdeLink que o pode auxiliar com urgências e encaminhamentos.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowCallModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center mt-0.5"
              >
                <X size={16} color="#475569" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            {/* Number display */}
            <View className="mx-6 mb-5 bg-slate-50 rounded-2xl px-4 py-3.5 flex-row items-center gap-3 border border-slate-100">
              <View className="w-9 h-9 rounded-xl bg-[#2196C7]/10 items-center justify-center">
                <Phone size={17} color="#2196C7" strokeWidth={2.2} />
              </View>
              <View>
                <Text className="text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wide">
                  Número do Call Center
                </Text>
                <Text className="text-base font-nunito-extrabold text-slate-900">
                  {CALL_CENTER_NUMBER}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="px-6 pb-6 gap-3">
              <Pressable
                onPress={handleCallCenter}
                className="bg-[#2196C7] rounded-2xl py-4 items-center active:opacity-90 flex-row justify-center gap-2"
              >
                <Phone size={16} color="#FFFFFF" strokeWidth={2.5} />
                <Text className="text-base font-nunito-extrabold text-white">
                  Ligar Agora
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setShowCallModal(false)}
                className="bg-slate-100 rounded-2xl py-4 items-center active:opacity-80"
              >
                <Text className="text-base font-nunito-extrabold text-slate-700">
                  Cancelar
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
