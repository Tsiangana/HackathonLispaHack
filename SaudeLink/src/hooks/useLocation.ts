import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export function useLocation() {
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function requestLocation() {
      try {
        setLoading(true);
        const permission = await Location.requestForegroundPermissionsAsync();

        if (!mounted) {
          return;
        }

        setPermissionStatus(permission.status);

        if (permission.status !== Location.PermissionStatus.GRANTED) {
          setError('Location permission was not granted.');
          return;
        }

        const current = await Location.getCurrentPositionAsync({});

        if (!mounted) {
          return;
        }

        setLatitude(current.coords.latitude);
        setLongitude(current.coords.longitude);
        setError(null);
      } catch {
        if (mounted) {
          setError('We could not detect your current location.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    requestLocation();

    return () => {
      mounted = false;
    };
  }, []);

  return { permissionStatus, latitude, longitude, loading, error };
}
