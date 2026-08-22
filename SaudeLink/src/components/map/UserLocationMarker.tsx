import { Navigation } from 'lucide-react-native';
import { View } from 'react-native';

import { colors } from '@/constants/colors';

export function UserLocationMarker() {
  return (
    <View className="h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-healthcare-500">
      <Navigation color={colors.surface} size={16} />
    </View>
  );
}
