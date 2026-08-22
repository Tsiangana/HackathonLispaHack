import { useEffect, useRef } from 'react';
import RNMapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { HospitalMarker } from '@/components/hospital/HospitalMarker';
import { UserLocationMarker } from '@/components/map/UserLocationMarker';
import { config } from '@/constants/config';
import { colors } from '@/constants/colors';
import { Hospital } from '@/types/hospital';

interface SaúdeMapViewProps {
  hospitals: Hospital[];
  userLocation?: { latitude: number; longitude: number } | null;
  selectedHospitalId?: string;
  onSelectHospital: (hospital: Hospital) => void;
}

export function MapView({ hospitals, userLocation, selectedHospitalId, onSelectHospital }: SaúdeMapViewProps) {
  const mapRef = useRef<RNMapView>(null);
  const region = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }
    : config.defaultRegion;

  useEffect(() => {
    const selectedHospital = hospitals.find((hospital) => hospital.id === selectedHospitalId);

    if (!selectedHospital) {
      return;
    }

    mapRef.current?.animateToRegion(
      {
        latitude: selectedHospital.latitude - 0.012,
        longitude: selectedHospital.longitude,
        latitudeDelta: 0.055,
        longitudeDelta: 0.055,
      },
      450,
    );
  }, [hospitals, selectedHospitalId]);

  return (
    <RNMapView
      ref={mapRef}
      className="flex-1"
      initialRegion={region}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={false}
      showsCompass={false}
      showsMyLocationButton={false}
      toolbarEnabled={false}
      mapPadding={{ top: 110, right: 20, bottom: 300, left: 20 }}
      customMapStyle={mapStyle}
    >
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

const mapStyle = [
  {
    featureType: 'poi.medical',
    elementType: 'labels.icon',
    stylers: [{ color: colors.primaryRed }],
  },
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#FFFFFF' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: colors.blue100 }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: colors.blue50 }],
  },
];
