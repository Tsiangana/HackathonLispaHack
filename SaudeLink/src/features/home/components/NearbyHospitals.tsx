import { Text, View } from 'react-native';

import { HospitalCard } from '@/components/hospital/HospitalCard';
import { Hospital } from '@/types/hospital';

export function NearbyHospitals({ hospitals }: { hospitals: Hospital[] }) {
  return (
    <View className="gap-3">
      <Text className="text-base font-semibold text-slate-900">Nearby hospitals</Text>
      {hospitals.map((hospital) => (
        <HospitalCard key={hospital.id} hospital={hospital} compact />
      ))}
    </View>
  );
}
