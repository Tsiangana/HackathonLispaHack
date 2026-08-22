import BottomSheet from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { HospitalBottomSheet } from '@/components/hospital/HospitalBottomSheet';
import { SafeArea } from '@/components/layout/SafeArea';
import { MapControls } from '@/components/map/MapControls';
import { MapView } from '@/components/map/MapView';
import { IconButton } from '@/components/ui/IconButton';
import { colors } from '@/constants/colors';
import { hospitals } from '@/data/hospitals';
import { useLocation } from '@/hooks/useLocation';
import { Hospital } from '@/types/hospital';
import { LocateFixed } from 'lucide-react-native';

export default function MapScreen() {
  const sheetRef = useRef<BottomSheet>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const { latitude, longitude, loading, error } = useLocation();
  const userLocation = latitude && longitude ? { latitude, longitude } : null;

  function handleSelectHospital(hospital: Hospital) {
    setSelectedHospital(hospital);
    sheetRef.current?.snapToIndex(0);
  }

  return (
    <SafeArea>
      <View className="flex-1">
        <MapView hospitals={hospitals} userLocation={userLocation} selectedHospitalId={selectedHospital?.id} onSelectHospital={handleSelectHospital} />
        <View className="absolute left-5 right-5 top-5 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="text-base font-semibold text-healthcare-900">Hospitals near Luanda</Text>
          <Text className="mt-1 text-sm text-slate-500">
            {loading ? 'Detecting your location...' : error ? 'Using Luanda as your map center.' : 'Tap a marker to compare availability.'}
          </Text>
        </View>
        <MapControls onLocate={() => sheetRef.current?.close()} />
        <View className="absolute bottom-28 right-5">
          <IconButton icon={LocateFixed} color={colors.primaryRed} className="shadow-sm" />
        </View>
        <HospitalBottomSheet sheetRef={sheetRef} hospital={selectedHospital} />
      </View>
    </SafeArea>
  );
}
