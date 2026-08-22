import { Link } from 'expo-router';
import { Text, View } from 'react-native';

import { SafeArea } from '@/components/layout/SafeArea';
import { Button } from '@/components/ui/Button';

export default function NotFoundScreen() {
  return (
    <SafeArea>
      <View className="flex-1 items-center justify-center gap-4 px-5">
        <Text className="text-xl font-semibold text-slate-900">Screen not found</Text>
        <Text className="text-center text-sm text-slate-500">This SaúdeLink route does not exist.</Text>
        <Link href="/(app)/(tabs)" asChild>
          <Button>Go home</Button>
        </Link>
      </View>
    </SafeArea>
  );
}
