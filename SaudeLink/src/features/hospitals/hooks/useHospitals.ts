import { useMemo } from 'react';

import { hospitals } from '@/data/hospitals';
import { HospitalNeed } from '@/types/hospital';

export function useHospitals(query = '', need?: HospitalNeed | null) {
  return useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = hospitals.filter((hospital) => {
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

    return filtered.sort((a, b) => {
      const availabilityScore = Number(b.isOpen) - Number(a.isOpen);
      const emergencyScore = Number(b.emergencyAvailable) - Number(a.emergencyAvailable);
      const distanceScore = (a.distance ?? 999) - (b.distance ?? 999);
      const ratingScore = b.rating - a.rating;

      return availabilityScore || emergencyScore || distanceScore || ratingScore;
    });
  }, [need, query]);
}
