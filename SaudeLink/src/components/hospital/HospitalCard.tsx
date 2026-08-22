import { Link } from 'expo-router';
import { Building2, ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Hospital } from '@/types/hospital';

interface HospitalCardProps {
  hospital: Hospital;
  compact?: boolean;
  onPress?: () => void;
}

export function HospitalCard({ hospital, compact, onPress }: HospitalCardProps) {
  const card = (
    <Pressable
      className="flex-row items-center justify-between py-4 border-b border-slate-200/60 active:opacity-70 bg-transparent"
      onPress={onPress}
    >
      <View className="flex-row items-center gap-3.5 flex-1 pr-4">
        <View className="w-12 h-12 rounded-2xl bg-[#EAEAEA]/70 items-center justify-center">
          <Building2 color="#475569" size={22} strokeWidth={2} />
        </View>
        <View className="flex-1 min-w-0">
          <Text className="text-base font-nunito-bold text-slate-800" numberOfLines={1}>
            {hospital.name}
          </Text>
          {compact ? (
            <Text className="text-sm font-nunito text-slate-400 mt-0.5" numberOfLines={1}>
              {hospital.distance ? `${hospital.distance} km` : 'Perto de ti'} • {hospital.isOpen ? 'Aberto' : 'Fechado'}
            </Text>
          ) : (
            <Text className="text-sm font-nunito text-slate-400 mt-0.5" numberOfLines={1}>
              {hospital.address}
            </Text>
          )}
        </View>
      </View>
      <ChevronRight size={18} color="#94A3B8" strokeWidth={2.5} />
    </Pressable>
  );

  if (onPress) {
    return card;
  }

  return <Link href={`/(app)/hospital/${hospital.id}`} asChild>{card}</Link>;
}

