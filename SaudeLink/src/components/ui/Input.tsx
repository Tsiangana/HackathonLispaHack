import { Text, TextInput, TextInputProps, View } from 'react-native';

import { colors } from '@/constants/colors';
import { cn } from '@/lib/cn';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <View className="gap-2">
      {label ? <Text className="text-sm font-semibold text-slate-700">{label}</Text> : null}
      <TextInput
        className={cn('min-h-12 rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900', className)}
        placeholderTextColor={colors.textMuted}
        {...props}
      />
      {error ? <Text className="text-xs font-medium text-status-danger">{error}</Text> : null}
    </View>
  );
}
