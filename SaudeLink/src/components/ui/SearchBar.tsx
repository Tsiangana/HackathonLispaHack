import { Search } from 'lucide-react-native';
import { TextInput, View } from 'react-native';

import { colors } from '@/constants/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search hospitals...' }: SearchBarProps) {
  return (
    <View className="h-13 flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
      <Search color={colors.blue700} size={20} />
      <TextInput
        className="flex-1 text-base text-slate-900"
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
    </View>
  );
}
