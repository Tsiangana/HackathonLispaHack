import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StatusBar, View } from 'react-native';

import { YangoHospitalMap } from '@/components/map/YangoHospitalMap';
import { useHospitalsState } from '@/features/hospitals/hooks/useHospitals';
import { Hospital } from '@/types/hospital';

export default function MapScreen() {
  const params = useLocalSearchParams<{ symptom?: string; hospitalId?: string; autoRoute?: string }>();
  const symptomParam = params.symptom ? String(params.symptom) : undefined;
  const hospitalIdParam = params.hospitalId ? String(params.hospitalId) : undefined;
  const autoRouteParam = params.autoRoute === 'true';

  const { hospitals: realHospitals, isLoading } = useHospitalsState();
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  useEffect(() => {
    if (hospitalIdParam && realHospitals.length > 0) {
      const match = realHospitals.find((h) => h.id === hospitalIdParam);
      if (match) {
        setSelectedHospital(match);
      }
    }
  }, [hospitalIdParam, realHospitals]);

  const activeSelectedHospital = useMemo(() => {
    if (selectedHospital) return selectedHospital;
    if (hospitalIdParam) {
      const match = realHospitals.find((h) => h.id === hospitalIdParam);
      if (match) return match;
    }
    return realHospitals[0];
  }, [selectedHospital, hospitalIdParam, realHospitals]);

  if (!activeSelectedHospital) {
    return null;
  }

  return (
    <View className="flex-1 bg-slate-100">
      <StatusBar barStyle="dark-content" />
      <YangoHospitalMap
        symptom={symptomParam}
        hospitals={realHospitals}
        selectedHospital={activeSelectedHospital}
        onSelectHospital={setSelectedHospital}
        autoRoute={autoRouteParam}
        isLoading={isLoading}
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
