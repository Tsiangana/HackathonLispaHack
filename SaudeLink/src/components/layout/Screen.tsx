import { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { cn } from '@/lib/cn';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  className?: string;
  bgClassName?: string;
}

export function Screen({
  children,
  scroll = true,
  className,
  bgClassName = 'bg-[#FAFAF8]',
}: ScreenProps) {
  if (!scroll) {
    return <View className={cn('flex-1 px-5', bgClassName, className)}>{children}</View>;
  }

  return (
    <ScrollView
      className={cn('flex-1', bgClassName)}
      contentContainerClassName={cn('px-5 pb-8 pt-4', className)}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

