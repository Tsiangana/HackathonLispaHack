import { LocateFixed } from 'lucide-react-native';
import { View } from 'react-native';

import { IconButton } from '@/components/ui/IconButton';

export function MapControls({ onLocate }: { onLocate?: () => void }) {
  return (
    <View className="absolute right-5 top-16 gap-3">
      <IconButton icon={LocateFixed} onPress={onLocate} className="shadow-sm" />
    </View>
  );
}
