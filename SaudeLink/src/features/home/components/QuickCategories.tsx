import { Ambulance, Stethoscope } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { HospitalNeed } from '@/types/hospital';

interface QuickCategoriesProps {
  selected?: HospitalNeed | null;
  onSelect: (need: HospitalNeed | null) => void;
}

export function QuickCategories({ selected, onSelect }: QuickCategoriesProps) {
  const isEmergencySelected = selected === 'emergency';
  const isConsultingSelected = selected === 'pediatrics';

  return (
    <View className="gap-4 mb-4">
      {/* 2 Top Featured Cards like Yango */}
      <View className="flex-row gap-4">
        {/* Card 1: Emergência */}
        <View className="flex-1">
          <Pressable
            onPress={() => onSelect(isEmergencySelected ? null : 'emergency')}
            className={`w-full aspect-[1.15] rounded-3xl items-center justify-center border active:opacity-95 ${
              isEmergencySelected
                ? 'bg-red-50 border-brand-red'
                : 'bg-[#EAEAEA]/80 border-transparent'
            }`}
          >
            <Ambulance size={54} color={isEmergencySelected ? '#D9232E' : '#2A2A2A'} strokeWidth={1.5} />
          </Pressable>
          <Text className="mt-2 text-sm font-nunito-bold text-slate-800 text-center">
            Emergência
          </Text>
        </View>

        {/* Card 2: Consultas */}
        <View className="flex-1">
          <Pressable
            onPress={() => onSelect(isConsultingSelected ? null : 'pediatrics')}
            className={`w-full aspect-[1.15] rounded-3xl items-center justify-center border active:opacity-95 ${
              isConsultingSelected
                ? 'bg-red-50 border-brand-red'
                : 'bg-[#EAEAEA]/80 border-transparent'
            }`}
          >
            <Stethoscope size={54} color={isConsultingSelected ? '#D9232E' : '#2A2A2A'} strokeWidth={1.5} />
          </Pressable>
          <Text className="mt-2 text-sm font-nunito-bold text-slate-800 text-center" numberOfLines={1}>
            Consultas <Text className="font-nunito text-xs text-slate-500">• a partir de 10 min.</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}


