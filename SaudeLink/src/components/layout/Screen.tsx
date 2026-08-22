import { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { cn } from '@/lib/cn';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  className?: string;
}

export function Screen({ children, scroll = true, className }: ScreenProps) {
  if (!scroll) {
    return <View className={cn('flex-1 bg-slate-50 px-5', className)}>{children}</View>;
  }

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerClassName={cn('px-5 pb-8 pt-4', className)} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}
