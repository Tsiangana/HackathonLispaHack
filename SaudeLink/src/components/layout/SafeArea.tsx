import { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SafeAreaProps {
  children: ReactNode;
  className?: string;
}

export function SafeArea({ children, className = 'bg-white' }: SafeAreaProps) {
  return <SafeAreaView className={`flex-1 ${className}`}>{children}</SafeAreaView>;
}
