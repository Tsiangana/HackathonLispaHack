import { useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { SearchBar } from '@/components/ui/SearchBar';
import { HomeHeader } from '@/features/home/components/HomeHeader';
import { NearbyHospitals } from '@/features/home/components/NearbyHospitals';
import { QuickCategories } from '@/features/home/components/QuickCategories';
import { RecommendedHospitals } from '@/features/home/components/RecommendedHospitals';
import { useHospitals } from '@/features/hospitals/hooks/useHospitals';
import { useDebounce } from '@/hooks/useDebounce';
import { HospitalNeed } from '@/types/hospital';

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [need, setNeed] = useState<HospitalNeed | null>(null);
  const debouncedQuery = useDebounce(query);
  const filteredHospitals = useHospitals(debouncedQuery, need);

  return (
    <Screen className="gap-6">
      <HomeHeader />
      <SearchBar value={query} onChangeText={setQuery} />
      <QuickCategories selected={need} onSelect={setNeed} />
      <View className="gap-6">
        <RecommendedHospitals hospitals={filteredHospitals} />
        <NearbyHospitals hospitals={filteredHospitals} />
      </View>
    </Screen>
  );
}
