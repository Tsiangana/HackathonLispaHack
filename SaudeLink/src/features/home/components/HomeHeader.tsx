import { router } from 'expo-router';
import { ChevronRight, Settings } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/constants/colors';

export function HomeHeader() {
  return (
    <View className="flex-row items-center justify-between pt-2 pb-2">
      <View>
        <Text className="text-3xl font-nunito-bold text-brand-red tracking-tighter">
          SAÚDELINK
        </Text>
        <TouchableOpacity className="flex-row items-center gap-0.5 mt-0.5">
          <Text className="text-sm font-nunito-extrabold text-slate-800">
            Nacional
          </Text>
          <View className="w-4 h-4 rounded-full bg-slate-900 justify-center items-center ml-1">
            <ChevronRight size={10} color="#FFFFFF" strokeWidth={3} />
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => router.push('/(app)/(tabs)/settings')}
        className="w-10 h-10 items-center justify-center active:opacity-60"
      >
        <Settings size={32} color={colors.textDark} strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
}



