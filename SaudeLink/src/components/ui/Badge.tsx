import { Text, View } from 'react-native';

import { cn } from '@/lib/cn';

interface BadgeProps {
  label: string;
  tone?: 'red' | 'blue' | 'green' | 'yellow' | 'slate';
}

export function Badge({ label, tone = 'blue' }: BadgeProps) {
  const classes = {
    red: 'bg-brand-red-light text-brand-red-dark',
    blue: 'bg-healthcare-100 text-healthcare-700',
    green: 'bg-green-50 text-status-success',
    yellow: 'bg-amber-50 text-status-warning',
    slate: 'bg-slate-100 text-slate-600',
  }[tone];

  const [background, text] = classes.split(' ');

  return (
    <View className={cn('rounded-full px-3 py-1', background)}>
      <Text className={cn('text-xs font-semibold', text)}>{label}</Text>
    </View>
  );
}
