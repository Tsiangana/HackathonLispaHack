import { CheckCircle2, XCircle } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { Hospital } from '@/types/hospital';

const labels: Record<keyof Hospital['resources'], string> = {
  emergency: 'Emergency',
  pharmacy: 'Pharmacy',
  laboratory: 'Laboratory',
  maternity: 'Maternity',
  pediatrics: 'Pediatrics',
  imaging: 'Imaging',
};

export function HospitalResources({ resources }: { resources: Hospital['resources'] }) {
  return (
    <View className="gap-3">
      <Text className="text-base font-semibold text-slate-900">Available resources</Text>
      <View className="gap-3">
        {Object.entries(resources).map(([key, available]) => (
          <View key={key} className="flex-row items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <Text className="text-sm font-medium text-slate-700">{labels[key as keyof Hospital['resources']]}</Text>
            {available ? <CheckCircle2 color={colors.success} size={18} /> : <XCircle color={colors.textMuted} size={18} />}
          </View>
        ))}
      </View>
    </View>
  );
}
