import { ActivityIndicator, Pressable, Text } from 'react-native';

import { colors } from '@/constants/colors';
import { cn } from '@/lib/cn';

interface ButtonProps {
  children: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  className?: string;
}

export function Button({ children, onPress, variant = 'primary', loading, className }: ButtonProps) {
  const variantClass = {
    primary: 'bg-brand-red',
    secondary: 'bg-healthcare-100',
    ghost: 'bg-transparent',
  }[variant];

  const textClass = {
    primary: 'text-white',
    secondary: 'text-healthcare-700',
    ghost: 'text-healthcare-700',
  }[variant];

  return (
    <Pressable
      className={cn('min-h-12 items-center justify-center rounded-xl px-5', variantClass, className)}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? <ActivityIndicator color={colors.surface} /> : <Text className={cn('text-base font-semibold', textClass)}>{children}</Text>}
    </Pressable>
  );
}
