import React from 'react';
import { ActivityIndicator, Image, StatusBar, Text, View } from 'react-native';

export function AppLoadingScreen({ message = 'A carregar SaúdeLink...' }: { message?: string }) {
  return (
    <View className="flex-1 bg-white items-center justify-center p-6">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View className="items-center gap-4">
        {/* Brand Logo */}
        <Image
          source={require('assets/images/logosemfundoremovebg.png')}
          style={{ width: 90, height: 90 }}
          resizeMode="contain"
        />

        <View className="items-center">
          <Text className="text-2xl font-nunito-extrabold text-brand-red tracking-tight">
            SAÚDELINK
          </Text>
          <Text className="text-xs font-nunito-bold text-slate-400 mt-0.5">
            Cuidados de saúde ao alcance de todos
          </Text>
        </View>

        {/* Spinner & Message */}
        <View className="mt-8 items-center gap-3">
          <ActivityIndicator size="large" color="#D9232E" />
          <Text className="text-sm font-nunito-bold text-slate-500">{message}</Text>
        </View>
      </View>
    </View>
  );
}
