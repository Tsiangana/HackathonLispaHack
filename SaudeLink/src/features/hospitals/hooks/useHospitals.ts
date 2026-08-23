import * as Location from 'expo-location';
import { useEffect, useMemo, useState } from 'react';

import { hospitals as mockFallback } from '@/data/hospitals';
import { supabase } from '@/lib/supabase';
import {
  calculateDistance,
  fetchNearbyHospitals,
  getHospitalsFromSupabase,
} from '@/services/hospitalService';
import { Hospital, HospitalNeed } from '@/types/hospital';

export function useHospitalsState(query = '', need?: HospitalNeed | null) {
  // Start with an empty list while loading (no stale mock shown to user)
  const [hospitalsList, setHospitalsList] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHospitals() {
      try {
        setIsLoading(true);
        setError(null);

        // ── DIAGNOSTIC: check session before query ──────────────────
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('[DIAG][useHospitals] session exists:', !!currentSession);
        console.log('[DIAG][useHospitals] user id:', currentSession?.user?.id ?? 'none');
        console.log('[DIAG][useHospitals] user email:', currentSession?.user?.email ?? 'none');
        console.log('[DIAG][useHospitals] about to call getHospitalsFromSupabase...');
        // ───────────────────────────────────────────────────────────

        // ── PRIMARY SOURCE: Supabase ────────────────────────────────
        let supabaseHospitals: Hospital[] = [];
        try {
          supabaseHospitals = await getHospitalsFromSupabase();
        } catch (supabaseErr) {
          console.warn('[useHospitals] Supabase fetch failed, trying fallback:', supabaseErr);
        }

        if (supabaseHospitals.length > 0) {
          // Enrich with distance if location is available (best-effort, non-blocking)
          let lat = -8.8383;
          let lng = 13.2344;
          try {
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
          } catch {
            // location is optional — continue without it
          }

          const withDistance = supabaseHospitals.map((h) => ({
            ...h,
            distance: calculateDistance(lat, lng, h.latitude, h.longitude),
          }));

          if (isMounted) setHospitalsList(withDistance);
          return;
        }

        // ── FALLBACK: Google Places / OSM / mock ───────────────────
        console.log('[useHospitals] Supabase returned no data, falling back to fetchNearbyHospitals');
        let lat = -8.8383;
        let lng = 13.2344;
        try {
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
        } catch {
          // location optional
        }

        const fallbackData = await fetchNearbyHospitals(lat, lng);
        if (isMounted && fallbackData && fallbackData.length > 0) {
          setHospitalsList(fallbackData);
        } else if (isMounted) {
          // Last-resort: static mock
          setHospitalsList(mockFallback);
        }
      } catch (err) {
        console.error('[useHospitals] Unexpected error:', err);
        if (isMounted) {
          setError('Não foi possível carregar as unidades de saúde.');
          // Show mock so the app is never blank
          setHospitalsList(mockFallback);
        }
      } finally {
        if (isMounted) {
          setTimeout(() => {
            if (isMounted) setIsLoading(false);
          }, 300);
        }
      }
    }

    loadHospitals();

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const result = hospitalsList.filter((hospital) => {
      const matchesNeed = need
        ? hospital.resources[need] || (need === 'emergency' && hospital.emergencyAvailable)
        : true;
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

  return { hospitals: filtered, isLoading, error };
}

export function useHospitals(query = '', need?: HospitalNeed | null) {
  const { hospitals } = useHospitalsState(query, need);
  return hospitals;
}
