import RNMapView, { Marker } from 'react-native-maps';

import { HospitalMarker } from '@/components/hospital/HospitalMarker';
import { UserLocationMarker } from '@/components/map/UserLocationMarker';
import { config } from '@/constants/config';
import { Hospital } from '@/types/hospital';

interface SaúdeMapViewProps {
  hospitals: Hospital[];
  userLocation?: { latitude: number; longitude: number } | null;
  selectedHospitalId?: string;
  onSelectHospital: (hospital: Hospital) => void;
}

export function MapView({ hospitals, userLocation, selectedHospitalId, onSelectHospital }: SaúdeMapViewProps) {
  const region = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }
    : config.defaultRegion;

  return (
    <RNMapView className="flex-1" initialRegion={region} showsUserLocation={false}>
      {userLocation ? (
        <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 0.5 }}>
          <UserLocationMarker />
        </Marker>
      ) : null}
      {hospitals.map((hospital) => (
        <Marker
          key={hospital.id}
          coordinate={{ latitude: hospital.latitude, longitude: hospital.longitude }}
          onPress={() => onSelectHospital(hospital)}
        >
          <HospitalMarker selected={hospital.id === selectedHospitalId} />
        </Marker>
      ))}
    </RNMapView>
  );
}
