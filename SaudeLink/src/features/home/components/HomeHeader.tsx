import { Bell, MapPin } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { IconButton } from '@/components/ui/IconButton';
import { colors } from '@/constants/colors';

export function HomeHeader() {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-sm font-medium text-slate-500">Good afternoon</Text>
        <Text className="mt-1 text-3xl font-bold text-healthcare-900">SaúdeLink</Text>
        <View className="mt-3 flex-row items-center gap-2">
          <MapPin color={colors.primaryRed} size={16} />
          <Text className="text-sm font-semibold text-slate-600">Luanda, Angola</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-3">
        <IconButton icon={Bell} color={colors.blue700} />
        <Avatar name="Ana Paulo" />
      </View>
    </View>
  );
}
