import { Link } from 'expo-router';
import { ChevronRight, Clock, MapPin, ShieldCheck, Star } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { colors } from '@/constants/colors';
import { Hospital } from '@/types/hospital';
import { formatDistance, formatRating } from '@/utils/format';

interface HospitalCardProps {
  hospital: Hospital;
  compact?: boolean;
  onPress?: () => void;
}

export function HospitalCard({ hospital, compact, onPress }: HospitalCardProps) {
  const card = (
    <Pressable className="rounded-2xl border border-slate-200 bg-white p-4" onPress={onPress}>
      <View className="flex-row gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-healthcare-100">
          <ShieldCheck color={colors.blue700} size={23} />
        </View>
        <View className="min-w-0 flex-1">
          <View className="flex-row items-start justify-between gap-3">
            <Text className="flex-1 text-base font-semibold text-slate-900" numberOfLines={1}>
              {hospital.name}
            </Text>
            <ChevronRight color={colors.textMuted} size={18} />
          </View>
          <View className="mt-2 flex-row flex-wrap items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Star color={colors.warning} fill={colors.warning} size={14} />
              <Text className="text-xs font-semibold text-slate-700">{formatRating(hospital.rating)}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MapPin color={colors.blue500} size={14} />
              <Text className="text-xs font-semibold text-slate-700">{formatDistance(hospital.distance)}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Clock color={hospital.isOpen ? colors.success : colors.textMuted} size={14} />
              <Text className="text-xs font-semibold text-slate-700">{hospital.isOpen ? 'Open now' : 'Closed'}</Text>
            </View>
          </View>
          {!compact ? (
            <View className="mt-3 flex-row flex-wrap gap-2">
              <Badge label={hospital.emergencyAvailable ? 'Emergency' : 'No emergency'} tone={hospital.emergencyAvailable ? 'green' : 'slate'} />
              {hospital.resources.pharmacy ? <Badge label="Pharmacy" tone="blue" /> : null}
              {hospital.resources.maternity ? <Badge label="Maternity" tone="blue" /> : null}
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );

  if (onPress) {
    return card;
  }

  return <Link href={`/(app)/hospital/${hospital.id}`} asChild>{card}</Link>;
}
