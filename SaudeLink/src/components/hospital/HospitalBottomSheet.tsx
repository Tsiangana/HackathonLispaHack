import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Link } from 'expo-router';
import { MapPin, Star } from 'lucide-react-native';
import { RefObject, useMemo } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { colors } from '@/constants/colors';
import { Hospital } from '@/types/hospital';
import { formatDistance, formatRating } from '@/utils/format';

interface HospitalBottomSheetProps {
  sheetRef: RefObject<BottomSheet | null>;
  hospital: Hospital | null;
}

export function HospitalBottomSheet({ sheetRef, hospital }: HospitalBottomSheetProps) {
  const snapPoints = useMemo(() => ['34%', '58%'], []);

  return (
    <BottomSheet ref={sheetRef} index={hospital ? 0 : -1} snapPoints={snapPoints} enablePanDownToClose backgroundStyle={{ borderRadius: 24 }}>
      <BottomSheetView className="gap-4 px-5 pb-6">
        {hospital ? (
          <>
            <View>
              <Text className="text-xl font-bold text-slate-900">{hospital.name}</Text>
              <Text className="mt-1 text-sm text-slate-500" numberOfLines={1}>
                {hospital.address}
              </Text>
            </View>
            <View className="flex-row gap-4">
              <View className="flex-row items-center gap-1">
                <Star color={colors.warning} fill={colors.warning} size={16} />
                <Text className="text-sm font-semibold text-slate-700">{formatRating(hospital.rating)}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <MapPin color={colors.blue500} size={16} />
                <Text className="text-sm font-semibold text-slate-700">{formatDistance(hospital.distance)}</Text>
              </View>
              <Badge label={hospital.isOpen ? 'Open now' : 'Closed'} tone={hospital.isOpen ? 'green' : 'slate'} />
            </View>
            <View className="flex-row flex-wrap gap-2">
              {hospital.emergencyAvailable ? <Badge label="Emergency" tone="green" /> : null}
              {hospital.resources.pharmacy ? <Badge label="Pharmacy" /> : null}
              {hospital.resources.laboratory ? <Badge label="Laboratory" /> : null}
              {hospital.resources.maternity ? <Badge label="Maternity" /> : null}
            </View>
            <Link href={`/(app)/hospital/${hospital.id}`} asChild>
              <Button>View hospital</Button>
            </Link>
          </>
        ) : null}
      </BottomSheetView>
    </BottomSheet>
  );
}
