import { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export function SafeArea({ children }: { children: ReactNode }) {
  return <SafeAreaView className="flex-1 bg-slate-50">{children}</SafeAreaView>;
}
