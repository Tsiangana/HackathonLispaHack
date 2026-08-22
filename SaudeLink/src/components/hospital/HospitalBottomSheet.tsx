import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import {
  Building2,
  CheckCircle2,
  Clock,
  Navigation,
  Star,
} from 'lucide-react-native';
import { RefObject, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Hospital } from '@/types/hospital';

interface HospitalBottomSheetProps {
  sheetRef: RefObject<BottomSheet | null>;
  hospitals: Hospital[];
  selectedHospital: Hospital;
  onSelectHospital: (hospital: Hospital) => void;
  symptom?: string;
  onStartRoute?: () => void;
}

export function HospitalBottomSheet({
  sheetRef,
  hospitals,
  selectedHospital,
  onSelectHospital,
}: HospitalBottomSheetProps) {
  const snapPoints = useMemo(() => ['38%', '68%'], []);
  const [activeTab, setActiveTab] = useState<'hospitals' | 'ambulances'>('hospitals');
  const [isNavigating, setIsNavigating] = useState(false);

  // Compute estimated arrival time
  const etaTime = useMemo(() => {
    const now = new Date();
    const minutesToAdd = Math.round((selectedHospital.distance ?? 1) * 4) + 3;
    now.setMinutes(now.getMinutes() + minutesToAdd);
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${mins}`;
  }, [selectedHospital]);

  const travelMinutes = Math.round((selectedHospital.distance ?? 1) * 4) + 3;

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={true}
      enablePanDownToClose={false}
      handleIndicatorStyle={{ backgroundColor: '#CBD5E1', width: 40 }}
      backgroundStyle={{ borderRadius: 28, backgroundColor: '#FFFFFF' }}
    >
      <BottomSheetView style={{ paddingHorizontal: 20, paddingBottom: 28, gap: 12 }}>
        {/* Active Route banner */}
        {isNavigating && (
          <View className="bg-emerald-500 rounded-2xl p-3.5 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <CheckCircle2 size={24} color="#FFFFFF" strokeWidth={2.5} />
              <View>
                <Text className="text-sm font-nunito-extrabold text-white">
                  {`Em rota para ${selectedHospital.name}`}
                </Text>
                <Text className="text-xs font-nunito text-white/90">
                  {`Chegada estimada às ${etaTime} (${travelMinutes} min)`}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setIsNavigating(false)}>
              <Text className="text-xs font-nunito-extrabold text-white underline">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Origin & Destination Rows */}
        <View className="border-b border-slate-100 pb-2">
          {/* Origin */}
          <View className="flex-row items-center gap-3 py-1">
            <View className="w-7 h-7 rounded-full bg-slate-100 items-center justify-center">
              <Navigation size={14} color="#0F172A" strokeWidth={2.5} />
            </View>
            <Text className="text-base font-nunito-extrabold text-slate-900 flex-1">
              Residencial • Sua Localização
            </Text>
          </View>

          {/* Destination */}
          <View className="flex-row items-center justify-between py-1">
            <View className="flex-row items-center gap-3 flex-1 pr-2">
              <View className="w-7 h-7 rounded-full bg-brand-red items-center justify-center">
                <Building2 size={14} color="#FFFFFF" strokeWidth={2.5} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-nunito-extrabold text-slate-900" numberOfLines={1}>
                  {`${selectedHospital.name} • ${travelMinutes} min`}
                </Text>
                <Text className="text-xs font-nunito text-slate-400" numberOfLines={1}>
                  {selectedHospital.address}
                </Text>
              </View>
            </View>

            <View className="bg-slate-100 px-3 py-1 rounded-full">
              <Text className="text-xs font-nunito-bold text-slate-700">
                Paragens
              </Text>
            </View>
          </View>
        </View>

        {/* Tab Buttons (Hospitais / Ambulâncias) */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => setActiveTab('hospitals')}
            className={`px-5 py-2 rounded-2xl flex-row items-center gap-2 active:opacity-90 ${
              activeTab === 'hospitals' ? 'bg-slate-900' : 'bg-slate-100'
            }`}
          >
            <Text
              className={`text-sm font-nunito-extrabold ${
                activeTab === 'hospitals' ? 'text-white' : 'text-slate-700'
              }`}
            >
              Hospitais Próximos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('ambulances')}
            className={`px-5 py-2 rounded-2xl flex-row items-center gap-2 active:opacity-90 ${
              activeTab === 'ambulances' ? 'bg-slate-900' : 'bg-slate-100'
            }`}
          >
            <Text
              className={`text-sm font-nunito-extrabold ${
                activeTab === 'ambulances' ? 'text-white' : 'text-slate-700'
              }`}
            >
              Ambulâncias (24/7)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Enlarged Hospital Option Cards Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingVertical: 4 }}
        >
          {hospitals.map((hosp) => {
            const isSelected = hosp.id === selectedHospital.id;
            const mins = Math.round((hosp.distance ?? 1) * 4) + 3;

            return (
              <Pressable
                key={hosp.id}
                onPress={() => onSelectHospital(hosp)}
                className={`p-4 rounded-3xl w-56 justify-between border-2 active:opacity-95 ${isSelected
                    ? 'bg-red-50/80 border-brand-red'
                    : 'bg-white border-slate-200'
                  }`}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View
                    className={`w-10 h-10 rounded-2xl items-center justify-center border ${isSelected
                        ? 'bg-white border-red-200'
                        : 'bg-slate-50 border-slate-100'
                      }`}
                  >
                    <Building2
                      size={20}
                      color={isSelected ? '#D9232E' : '#64748B'}
                      strokeWidth={2}
                    />
                  </View>
                  <View
                    className={`px-2.5 py-1 rounded-full flex-row items-center gap-1 ${isSelected ? 'bg-brand-red' : 'bg-slate-100'
                      }`}
                  >
                    <Clock size={11} color={isSelected ? '#FFFFFF' : '#475569'} strokeWidth={2.5} />
                    <Text
                      className={`text-xs font-nunito-extrabold ${isSelected ? 'text-white' : 'text-slate-700'
                        }`}
                    >
                      {`${mins} min`}
                    </Text>
                  </View>
                </View>

                <View className="mb-3">
                  <Text
                    className={`text-base font-nunito-extrabold ${isSelected ? 'text-slate-900' : 'text-slate-800'
                      }`}
                    numberOfLines={1}
                  >
                    {hosp.name}
                  </Text>
                  <Text className="text-xs font-nunito text-slate-500 mt-0.5" numberOfLines={1}>
                    {hosp.address}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between pt-2 border-t border-slate-100">
                  <View className="flex-row items-center gap-1">
                    <Star size={13} color="#EAB308" fill="#EAB308" />
                    <Text className="text-xs font-nunito-extrabold text-slate-700">
                      {hosp.rating}
                    </Text>
                    <Text className="text-xs font-nunito text-slate-400">
                      {`• ${hosp.distance} km`}
                    </Text>
                  </View>

                  <View
                    className={`px-2 py-0.5 rounded-md ${hosp.emergencyAvailable ? 'bg-emerald-50' : 'bg-slate-100'
                      }`}
                  >
                    <Text
                      className={`text-[10px] font-nunito-bold ${hosp.emergencyAvailable ? 'text-emerald-700' : 'text-slate-600'
                        }`}
                    >
                      {hosp.emergencyAvailable ? 'Emergência' : 'Consulta'}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
}
