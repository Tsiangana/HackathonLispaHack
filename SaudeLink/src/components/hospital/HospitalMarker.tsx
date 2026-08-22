import { Building2 } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { colors } from '@/constants/colors';

export function HospitalMarker({ selected }: { selected?: boolean }) {
  return (
    <View className="items-center">
      <View
        className={
          selected
            ? 'h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-brand-red shadow-md'
            : 'h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-healthcare-700 shadow-sm'
        }
      >
        <Building2 color={colors.surface} size={selected ? 21 : 18} />
      </View>
      {selected ? (
        <View className="mt-1 rounded-full bg-white px-2 py-1 shadow-sm">
          <Text className="text-[10px] font-bold text-healthcare-900">Selecionado</Text>
        </View>
      ) : null}
    </View>
  );
}
