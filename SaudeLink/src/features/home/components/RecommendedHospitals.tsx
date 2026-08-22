import { Text, View } from 'react-native';

import { HospitalCard } from '@/components/hospital/HospitalCard';
import { Hospital } from '@/types/hospital';

export function RecommendedHospitals({ hospitals }: { hospitals: Hospital[] }) {
  return (
    <View className="gap-0 mb-4">
      {hospitals.length ? (
        hospitals.slice(0, 3).map((hospital) => (
          <HospitalCard key={hospital.id} hospital={hospital} />
        ))
      ) : (
        <View className="rounded-2xl border border-slate-200 bg-white p-5 items-center">
          <Text className="text-base font-nunito-bold text-slate-900 text-center">
            Nenhum hospital encontrado
          </Text>
          <Text className="mt-1 text-xs font-nunito text-slate-500 text-center">
            Tenta pesquisar por outro nome ou selecionar uma especialidade.
          </Text>
        </View>
      )}
    </View>
  );
}


