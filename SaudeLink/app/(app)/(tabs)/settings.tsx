import { Bell, ChevronRight, Globe, Info, LogOut, MapPin, Shield, User } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { router } from 'expo-router';

import { Header } from '@/components/layout/Header';
import { SafeArea } from '@/components/layout/SafeArea';
import { Screen } from '@/components/layout/Screen';
import { Avatar } from '@/components/ui/Avatar';
import { Divider } from '@/components/ui/Divider';
import { colors } from '@/constants/colors';

function SettingsRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value?: string }) {
  return (
    <View className="flex-row items-center gap-3 py-4">
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-healthcare-100">
        <Icon color={colors.blue700} size={20} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-slate-800">{label}</Text>
        {value ? <Text className="mt-1 text-xs text-slate-500">{value}</Text> : null}
      </View>
      <ChevronRight color={colors.textMuted} size={18} />
    </View>
  );
}

export default function SettingsScreen() {
  return (
    <SafeArea>
      <Screen>
        <Header title="Settings" subtitle="Manage your local MVP preferences" />
        <View className="mb-6 flex-row items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
          <Avatar name="Ana Paulo" />
          <View className="flex-1">
            <Text className="text-base font-semibold text-slate-900">Ana Paulo</Text>
            <Text className="mt-1 text-sm text-slate-500">ana@saudelink.app</Text>
          </View>
        </View>
        <View className="rounded-2xl border border-slate-200 bg-white px-4">
          <SettingsRow icon={User} label="Profile" value="Account" />
          <Divider />
          <SettingsRow icon={Bell} label="Notifications" value="Urgent care updates" />
          <Divider />
          <SettingsRow icon={MapPin} label="Location" value="Luanda, Angola" />
          <Divider />
          <SettingsRow icon={Globe} label="Language" value="English" />
        </View>
        <View className="mt-5 rounded-2xl border border-slate-200 bg-white px-4">
          <SettingsRow icon={Info} label="About SaúdeLink" />
          <Divider />
          <SettingsRow icon={Shield} label="Terms and Privacy" />
        </View>
        <View className="mt-5 rounded-2xl border border-red-100 bg-white px-4">
          <View className="flex-row items-center gap-3 py-4" onTouchEnd={() => router.replace('/(auth)/login')}>
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-brand-red-light">
              <LogOut color={colors.primaryRed} size={20} />
            </View>
            <Text className="flex-1 text-sm font-semibold text-brand-red">Logout</Text>
          </View>
        </View>
      </Screen>
    </SafeArea>
  );
}
