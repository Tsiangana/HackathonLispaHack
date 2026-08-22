import { Text, View } from 'react-native';

export function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View className="h-12 w-12 items-center justify-center rounded-full bg-healthcare-100">
      <Text className="text-base font-bold text-healthcare-700">{initials}</Text>
    </View>
  );
}
