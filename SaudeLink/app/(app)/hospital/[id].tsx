import { router, useLocalSearchParams } from 'expo-router';
import { Clock, MapPin, Phone, Star } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { HospitalResources } from '@/components/hospital/HospitalResources';
import { HospitalServices } from '@/components/hospital/HospitalServices';
import { Header } from '@/components/layout/Header';
import { SafeArea } from '@/components/layout/SafeArea';
import { Screen } from '@/components/layout/Screen';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { hospitals } from '@/data/hospitals';
import { formatDistance, formatRating } from '@/utils/format';

export default function HospitalDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const hospital = hospitals.find((item) => item.id === id);

  if (!hospital) {
    return (
      <SafeArea>
        <Screen>
          <Header title="Hospital not found" onBack={() => router.back()} />
          <Text className="text-sm text-slate-500">We could not find this hospital in the MVP data.</Text>
        </Screen>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <Screen className="gap-5">
        <Header title={hospital.name} subtitle={hospital.address} onBack={() => router.back()} />
        <View className="rounded-2xl border border-slate-200 bg-white p-4">
          <View className="flex-row flex-wrap gap-3">
            <View className="flex-row items-center gap-2 rounded-xl bg-healthcare-50 px-3 py-2">
              <Star color={colors.warning} fill={colors.warning} size={16} />
              <Text className="text-sm font-semibold text-slate-700">{formatRating(hospital.rating)}</Text>
            </View>
            <View className="flex-row items-center gap-2 rounded-xl bg-healthcare-50 px-3 py-2">
              <MapPin color={colors.blue500} size={16} />
              <Text className="text-sm font-semibold text-slate-700">{formatDistance(hospital.distance)}</Text>
            </View>
            <View className="flex-row items-center gap-2 rounded-xl bg-healthcare-50 px-3 py-2">
              <Clock color={hospital.isOpen ? colors.success : colors.textMuted} size={16} />
              <Text className="text-sm font-semibold text-slate-700">{hospital.isOpen ? 'Open now' : 'Closed'}</Text>
            </View>
          </View>
          <View className="mt-4 flex-row flex-wrap gap-2">
            <Badge label={hospital.emergencyAvailable ? 'Emergency available' : 'No emergency'} tone={hospital.emergencyAvailable ? 'green' : 'slate'} />
            <Badge label={hospital.isOpen ? 'Accepting patients' : 'Check before going'} tone={hospital.isOpen ? 'blue' : 'yellow'} />
          </View>
        </View>
        <View className="rounded-2xl border border-slate-200 bg-white p-4">
          <HospitalServices services={hospital.services} />
        </View>
        <View className="rounded-2xl border border-slate-200 bg-white p-4">
          <HospitalResources resources={hospital.resources} />
        </View>
        <View className="rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="text-base font-semibold text-slate-900">Contact</Text>
          <View className="mt-3 flex-row items-center gap-2">
            <Phone color={colors.blue700} size={18} />
            <Text className="text-sm font-semibold text-slate-700">{hospital.phone}</Text>
          </View>
        </View>
        <Button>Get directions</Button>
      </Screen>
    </SafeArea>
  );
}
