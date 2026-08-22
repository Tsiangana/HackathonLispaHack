import { ShieldCheck } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { colors } from '@/constants/colors';

export function HospitalMarker({ selected }: { selected?: boolean }) {
  return (
    <View className="items-center">
      <View className={selected ? 'h-11 w-11 items-center justify-center rounded-full bg-brand-red' : 'h-10 w-10 items-center justify-center rounded-full bg-healthcare-700'}>
        <ShieldCheck color={colors.surface} size={21} />
      </View>
      <Text className="mt-1 text-xs font-bold text-healthcare-900">Hospital</Text>
    </View>
  );
}
