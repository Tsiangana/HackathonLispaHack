import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StatusBar, View } from 'react-native';

import { YangoHospitalMap } from '@/components/map/YangoHospitalMap';
import { hospitals } from '@/data/hospitals';
import { Hospital } from '@/types/hospital';

export default function MapScreen() {
  const params = useLocalSearchParams<{ symptom?: string; hospitalId?: string }>();
  const symptomParam = params.symptom ? String(params.symptom) : undefined;
  const hospitalIdParam = params.hospitalId ? String(params.hospitalId) : undefined;

  const initialHospital = useMemo(() => {
    if (hospitalIdParam) {
      const match = hospitals.find((h) => h.id === hospitalIdParam);
      if (match) return match;
    }
    return hospitals[0];
  }, [hospitalIdParam]);

  const [selectedHospital, setSelectedHospital] = useState<Hospital>(initialHospital);

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar barStyle="dark-content" />
      <YangoHospitalMap
        symptom={symptomParam}
        hospitals={hospitals}
        selectedHospital={selectedHospital}
        onSelectHospital={setSelectedHospital}
        onBack={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.push('/(app)/(tabs)');
          }
        }}
      />
    </View>
  );
}
