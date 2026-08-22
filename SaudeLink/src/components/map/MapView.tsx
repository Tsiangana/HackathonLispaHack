import { Building2, Navigation } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { colors } from '@/constants/colors';
import { Hospital } from '@/types/hospital';
import { formatDistance } from '@/utils/format';

interface SaúdeMapViewProps {
  hospitals: Hospital[];
  userLocation?: { latitude: number; longitude: number } | null;
  selectedHospitalId?: string;
  onSelectHospital: (hospital: Hospital) => void;
}

export function MapView({ hospitals, selectedHospitalId, onSelectHospital }: SaúdeMapViewProps) {
  return (
    <View className="flex-1 bg-healthcare-50 px-5 pb-32 pt-32">
      <View className="absolute inset-0 opacity-60">
        <View className="absolute left-6 top-24 h-2 w-full rotate-12 rounded-full bg-white" />
        <View className="absolute right-10 top-52 h-2 w-full -rotate-12 rounded-full bg-white" />
        <View className="absolute left-0 top-80 h-2 w-full rotate-6 rounded-full bg-white" />
        <View className="absolute left-12 top-44 h-10 w-10 items-center justify-center rounded-full bg-healthcare-500">
          <Navigation color={colors.surface} size={16} />
        </View>
      </View>
      <View className="gap-3">
        {hospitals.map((hospital) => (
          <Pressable
            key={hospital.id}
            className={selectedHospitalId === hospital.id ? 'rounded-2xl border border-brand-red bg-white p-4' : 'rounded-2xl border border-slate-200 bg-white p-4'}
            onPress={() => onSelectHospital(hospital)}
          >
            <View className="flex-row items-center justify-between gap-3">
              <View className={selectedHospitalId === hospital.id ? 'h-11 w-11 items-center justify-center rounded-full bg-brand-red' : 'h-11 w-11 items-center justify-center rounded-full bg-healthcare-700'}>
                <Building2 color={colors.surface} size={19} />
              </View>
              <View className="min-w-0 flex-1">
                <Text className="text-base font-semibold text-slate-900" numberOfLines={1}>
                  {hospital.name}
                </Text>
                <Text className="mt-1 text-sm text-slate-500">{formatDistance(hospital.distance)}</Text>
              </View>
              <Badge label={hospital.emergencyAvailable ? 'Emergency' : 'Clinic'} tone={hospital.emergencyAvailable ? 'green' : 'blue'} />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
