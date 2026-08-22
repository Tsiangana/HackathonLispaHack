import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';

export function HospitalServices({ services }: { services: string[] }) {
  return (
    <View className="gap-3">
      <Text className="text-base font-semibold text-slate-900">Services</Text>
      <View className="flex-row flex-wrap gap-2">
        {services.map((service) => (
          <Badge key={service} label={service} tone="blue" />
        ))}
      </View>
    </View>
  );
}
