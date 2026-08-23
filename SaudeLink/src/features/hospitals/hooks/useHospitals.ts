import * as Location from 'expo-location';
import { useEffect, useMemo, useState } from 'react';

import { hospitals as initialHospitals } from '@/data/hospitals';
import { fetchNearbyHospitals } from '@/services/hospitalService';
import { Hospital, HospitalNeed } from '@/types/hospital';

export function useHospitalsState(query = '', need?: HospitalNeed | null) {
  const [hospitalsList, setHospitalsList] = useState<Hospital[]>(initialHospitals);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadRealHospitals() {
      try {
        setIsLoading(true);
        let lat = -8.8383;
        let lng = 13.2344;

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          if (loc?.coords) {
            lat = loc.coords.latitude;
            lng = loc.coords.longitude;
          }
        }

        const data = await fetchNearbyHospitals(lat, lng);
        if (isMounted && data && data.length > 0) {
          setHospitalsList(data);
        }
      } catch (error) {
        console.log('Error fetching real hospitals in useHospitals:', error);
      } finally {
        if (isMounted) {
          // Brief smooth delay to ensure map markers render cleanly
          setTimeout(() => {
            if (isMounted) setIsLoading(false);
          }, 400);
        }
      }
    }

    loadRealHospitals();

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const result = hospitalsList.filter((hospital) => {
      const matchesNeed = need ? hospital.resources[need] || (need === 'emergency' && hospital.emergencyAvailable) : true;
      const searchable = [
        hospital.name,
        hospital.address,
        ...hospital.services,
        ...Object.entries(hospital.resources)
          .filter(([, available]) => available)
          .map(([resource]) => resource),
      ]
        .join(' ')
        .toLowerCase();

      return matchesNeed && (!normalizedQuery || searchable.includes(normalizedQuery));
    });

    return result.sort((a, b) => {
      const availabilityScore = Number(b.isOpen) - Number(a.isOpen);
      const emergencyScore = Number(b.emergencyAvailable) - Number(a.emergencyAvailable);
      const distanceScore = (a.distance ?? 999) - (b.distance ?? 999);
      const ratingScore = b.rating - a.rating;

      return availabilityScore || emergencyScore || distanceScore || ratingScore;
    });
  }, [hospitalsList, need, query]);

  return { hospitals: filtered, isLoading };
}

export function useHospitals(query = '', need?: HospitalNeed | null) {
  const { hospitals } = useHospitalsState(query, need);
  return hospitals;
}
