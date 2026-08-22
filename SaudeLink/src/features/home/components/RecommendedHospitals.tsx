import { Text, View } from 'react-native';

import { HospitalCard } from '@/components/hospital/HospitalCard';
import { Hospital } from '@/types/hospital';

export function RecommendedHospitals({ hospitals }: { hospitals: Hospital[] }) {
  return (
    <View className="gap-3">
      <Text className="text-base font-semibold text-slate-900">Recommended for you</Text>
      {hospitals.length ? (
        hospitals.slice(0, 2).map((hospital) => <HospitalCard key={hospital.id} hospital={hospital} />)
      ) : (
        <View className="rounded-2xl border border-slate-200 bg-white p-5">
          <Text className="text-base font-semibold text-slate-900">No hospitals found</Text>
          <Text className="mt-1 text-sm text-slate-500">Try searching for another hospital or healthcare service.</Text>
        </View>
      )}
    </View>
  );
}
