import { ChevronLeft } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { IconButton } from '@/components/ui/IconButton';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export function Header({ title, subtitle, onBack }: HeaderProps) {
  return (
    <View className="mb-5 flex-row items-center gap-3">
      {onBack ? <IconButton icon={ChevronLeft} onPress={onBack} color={colors.blue900} /> : null}
      <View className="flex-1">
        <Text className="text-xl font-semibold text-slate-900">{title}</Text>
        {subtitle ? <Text className="mt-1 text-sm text-slate-500">{subtitle}</Text> : null}
      </View>
    </View>
  );
}
