import { Pressable, Text, View } from 'react-native';

import { categories } from '@/data/categories';
import { cn } from '@/lib/cn';
import { HospitalNeed } from '@/types/hospital';

interface QuickCategoriesProps {
  selected?: HospitalNeed | null;
  onSelect: (need: HospitalNeed | null) => void;
}

export function QuickCategories({ selected, onSelect }: QuickCategoriesProps) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-slate-900">Quick access</Text>
        {selected ? (
          <Text className="text-sm font-semibold text-brand-red" onPress={() => onSelect(null)}>
            Clear
          </Text>
        ) : null}
      </View>
      <View className="flex-row flex-wrap gap-3">
        {categories.slice(0, 4).map((category) => {
          const Icon = category.icon;
          const isSelected = selected === category.id;

          return (
            <Pressable
              key={category.id}
              className={cn(
                'min-h-20 flex-1 basis-[46%] justify-between rounded-2xl border p-4',
                isSelected ? 'border-brand-red bg-brand-red-light' : 'border-slate-200 bg-white',
              )}
              onPress={() => onSelect(isSelected ? null : category.id)}
            >
              <Icon color={isSelected ? '#D9232E' : '#155E8A'} size={23} />
              <Text className={cn('mt-3 text-sm font-semibold', isSelected ? 'text-brand-red-dark' : 'text-slate-800')}>{category.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
