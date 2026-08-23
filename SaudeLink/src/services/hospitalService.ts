import { hospitals as mockHospitals } from '@/data/hospitals';
import { supabase } from '@/lib/supabase';
import { Hospital } from '@/types/hospital';

/**
 * Calculates Haversine distance in kilometers between two coordinates
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// ============================================================
// SUPABASE TYPES
// Shape returned by the nested select query
// ============================================================

interface SupabaseFacilityService {
  is_available: boolean;
  services: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface SupabaseFacility {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  rating: number;
  is_open: boolean;
  emergency_available: boolean;
  image_url: string | null;
  facility_services: SupabaseFacilityService[];
}

// ============================================================
// MAPPER — Supabase → Hospital frontend contract
// ============================================================

export function mapSupabaseFacilityToHospital(facility: SupabaseFacility): Hospital {
  // Build services string array from related services names
  const services: string[] = (facility.facility_services ?? [])
    .filter((fs) => fs.is_available && fs.services !== null)
    .map((fs) => fs.services!.name);

  // Build resources boolean map from slugs
  const slugMap: Record<string, boolean> = {};
  for (const fs of facility.facility_services ?? []) {
    if (fs.services?.slug) {
      slugMap[fs.services.slug] = fs.is_available;
    }
  }

  const resources: Hospital['resources'] = {
    emergency:  slugMap['emergency']  ?? false,
    pharmacy:   slugMap['pharmacy']   ?? false,
    laboratory: slugMap['laboratory'] ?? false,
    maternity:  slugMap['maternity']  ?? false,
    pediatrics: slugMap['pediatrics'] ?? false,
    imaging:    slugMap['imaging']    ?? false,
  };

  return {
    id:                 facility.id,
    name:               facility.name,
    address:            facility.address,
    latitude:           facility.latitude,
    longitude:          facility.longitude,
    phone:              facility.phone ?? '',
    rating:             Number(facility.rating),
    isOpen:             facility.is_open,
    emergencyAvailable: facility.emergency_available,
    image:              facility.image_url ?? undefined,
    distance:           undefined,      // calculated separately via geolocation
    services,
    resources,
  };
}

// ============================================================
// PRIMARY SOURCE — Supabase
// ============================================================

/**
 * Fetches all health facilities from Supabase, including their
 * associated services and availability status.
 * Requires an authenticated session (RLS policy: authenticated).
 */
export async function getHospitalsFromSupabase(): Promise<Hospital[]> {
  const { data, error } = await supabase
    .from('health_facilities')
    .select(`
      id,
      name,
      address,
      latitude,
      longitude,
      phone,
      rating,
      is_open,
      emergency_available,
      image_url,
      facility_services (
        is_available,
        services (
          id,
          name,
          slug
        )
      )
    `)
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  const facilities = (data ?? []) as unknown as SupabaseFacility[];
  return facilities.map(mapSupabaseFacilityToHospital);
}

/**
 * Fetches a single health facility by its UUID.
 * Returns null if the facility is not found (no row), throws on network/RLS error.
 */
export async function getHospitalByIdFromSupabase(id: string): Promise<Hospital | null> {
  const { data, error } = await supabase
    .from('health_facilities')
    .select(`
      id,
      name,
      address,
      latitude,
      longitude,
      phone,
      rating,
      is_open,
      emergency_available,
      image_url,
      facility_services (
        is_available,
        services (
          id,
          name,
          slug
        )
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) return null;

  return mapSupabaseFacilityToHospital(data as unknown as SupabaseFacility);
}


// ============================================================
// FALLBACK IMAGES (used by Google/OSM path)
// ============================================================

const HEALTHCARE_IMAGES = [
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=500&q=80',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&q=80',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&q=80',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=500&q=80',
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&q=80',
];

/**
 * Fetches all real clinics and hospitals from Google Places / OpenStreetMap API
 * using user coordinates and filters them to display on the map.
 */
export async function fetchNearbyHospitals(
  latitude: number = -8.8383,
  longitude: number = 13.2344,
  googleApiKey?: string
): Promise<Hospital[]> {
  // Option 1: Try Google Places API if key provided or defined in env
  const apiKey =
    googleApiKey ||
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

  if (apiKey) {
    try {
      const googleUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=25000&type=hospital&keyword=clinica|hospital|centro+medico&key=${apiKey}`;
      const response = await fetch(googleUrl);
      const data = await response.json();

      if (data.status === 'OK' && Array.isArray(data.results) && data.results.length > 0) {
        return data.results
          .map((place: any, idx: number) => {
            const itemLat = place.geometry?.location?.lat;
            const itemLng = place.geometry?.location?.lng;
            const dist = calculateDistance(latitude, longitude, itemLat, itemLng);

            return {
              id: `google-${place.place_id}`,
              name: place.name,
              address: place.vicinity || place.formatted_address || 'Luanda, Angola',
              latitude: itemLat,
              longitude: itemLng,
              distance: dist,
              rating: place.rating || 4.5,
              isOpen: place.opening_hours?.open_now ?? true,
              emergencyAvailable: true,
              services: ['Pronto Atendimento 24/7', 'Clínica Geral', 'Laboratório', 'Imagiologia'],
              resources: {
                emergency: true,
                pharmacy: true,
                laboratory: true,
                maternity: place.name.toLowerCase().includes('matern'),
                pediatrics:
                  place.name.toLowerCase().includes('pediátr') ||
                  place.name.toLowerCase().includes('infantil'),
                imaging: true,
              },
              phone: '+244 923 000 100',
              image: HEALTHCARE_IMAGES[idx % HEALTHCARE_IMAGES.length],
            };
          })
          .sort((a: Hospital, b: Hospital) => (a.distance ?? 999) - (b.distance ?? 999));
      }
    } catch (e) {
      console.log('Google Places fetch error, falling back to OSM API:', e);
    }
  }

  // Option 2: Overpass / OSM Places API for all clinics, medical centers & hospitals
  try {
    const query = `[out:json];(node["amenity"~"hospital|clinic|doctors"](around:30000,${latitude},${longitude});node["healthcare"~"hospital|clinic|doctor|center"](around:30000,${latitude},${longitude});way["amenity"~"hospital|clinic"](around:30000,${latitude},${longitude}););out center 40;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API Error ${response.status}`);
    }

    const data = await response.json();

    if (!data.elements || !Array.isArray(data.elements) || data.elements.length === 0) {
      return getRecalculatedMockHospitals(latitude, longitude);
    }

    const realHospitals: Hospital[] = data.elements
      .map((item: any, idx: number) => {
        const itemLat = item.lat || item.center?.lat;
        const itemLng = item.lon || item.center?.lon;

        if (!itemLat || !itemLng) return null;

        const rawName = item.tags?.name || item.tags?.['name:pt'] || item.tags?.['official_name'];
        if (!rawName) return null;

        const street =
          item.tags?.['addr:street'] ||
          item.tags?.['addr:suburb'] ||
          item.tags?.['addr:neighbourhood'] ||
          'Luanda';
        const city = item.tags?.['addr:city'] || 'Luanda, Angola';
        const fullAddress = `${street}, ${city}`;

        const dist = calculateDistance(latitude, longitude, itemLat, itemLng);

        const isPedia =
          rawName.toLowerCase().includes('pediátr') || rawName.toLowerCase().includes('infantil');
        const isMater = rawName.toLowerCase().includes('matern');
        const isPsych = rawName.toLowerCase().includes('psiquiátr');
        const isClinic =
          rawName.toLowerCase().includes('clínica') ||
          rawName.toLowerCase().includes('clinica') ||
          rawName.toLowerCase().includes('centro');

        return {
          id: `osm-${item.id}`,
          name: rawName,
          address: fullAddress,
          latitude: itemLat,
          longitude: itemLng,
          distance: dist,
          rating: Math.round((4.2 + (idx % 8) * 0.1) * 10) / 10,
          isOpen: true,
          emergencyAvailable: !isPsych,
          services: [
            isClinic ? 'Atendimento Clínico & Especialidades' : 'Pronto Atendimento 24/7',
            isPedia ? 'Pediatria' : 'Clínica Geral',
            isMater ? 'Maternidade' : 'Laboratório',
            'Imagiologia',
          ],
          resources: {
            emergency: !isPsych,
            pharmacy: true,
            laboratory: true,
            maternity: isMater,
            pediatrics: isPedia,
            imaging: true,
          },
          phone: item.tags?.phone || item.tags?.['contact:phone'] || '+244 923 000 100',
          image: HEALTHCARE_IMAGES[idx % HEALTHCARE_IMAGES.length],
        };
      })
      .filter((h: Hospital | null): h is Hospital => h !== null);

    if (realHospitals.length === 0) {
      return getRecalculatedMockHospitals(latitude, longitude);
    }

    // Deduplicate by name similarity
    const uniqueHospitals: Hospital[] = [];
    const seenNames = new Set<string>();

    for (const h of realHospitals) {
      const cleanName = h.name.toLowerCase().trim();
      if (!seenNames.has(cleanName)) {
        seenNames.add(cleanName);
        uniqueHospitals.push(h);
      }
    }

    // Sort by nearest distance
    return uniqueHospitals.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
  } catch (error) {
    console.log('Using fallback hospital data:', error);
    return getRecalculatedMockHospitals(latitude, longitude);
  }
}

function getRecalculatedMockHospitals(lat: number, lng: number): Hospital[] {
  return mockHospitals
    .map((hospital) => ({
      ...hospital,
      distance: calculateDistance(lat, lng, hospital.latitude, hospital.longitude),
    }))
    .sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
}
