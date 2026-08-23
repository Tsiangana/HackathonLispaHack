import BottomSheet from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { ArrowLeft, Building2, LocateFixed } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

import { HospitalBottomSheet } from '@/components/hospital/HospitalBottomSheet';
import { MapLoadingOverlay } from '@/components/map/MapLoadingOverlay';
import { Hospital } from '@/types/hospital';

export interface YangoHospitalMapProps {
  symptom?: string;
  hospitals: Hospital[];
  selectedHospital: Hospital;
  onSelectHospital: (hospital: Hospital) => void;
  onBack: () => void;
  autoRoute?: boolean;
  isLoading?: boolean;
}

const DEFAULT_LOCATION = { latitude: -8.8383, longitude: 13.2344 };

/** Returns a region that fits all the given coordinates with padding */
function fitRegion(coords: { latitude: number; longitude: number }[], paddingFactor = 1.5) {
  if (coords.length === 0) return null;
  const lats = coords.map((c) => c.latitude);
  const lngs = coords.map((c) => c.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * paddingFactor, 0.02),
    longitudeDelta: Math.max((maxLng - minLng) * paddingFactor, 0.02),
  };
}

export function YangoHospitalMap({
  symptom,
  hospitals,
  selectedHospital,
  onSelectHospital,
  onBack,
  autoRoute,
  isLoading,
}: YangoHospitalMapProps) {
  const mapRef = useRef<MapView>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);

  useEffect(() => {
    let isMounted = true;

    async function getUserLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          if (isMounted && loc?.coords) {
            const newLoc = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            };
            setUserLocation(newLoc);

            // Fit all hospitals + user on screen
            const allCoords = [
              newLoc,
              ...hospitals.map((h) => ({ latitude: h.latitude, longitude: h.longitude })),
            ];
            const region = fitRegion(allCoords, 1.4);
            if (region) {
              mapRef.current?.animateToRegion(region, 900);
            }
          }
        }
      } catch (error) {
        console.log('Location error:', error);
      }
    }

    getUserLocation();
    return () => { isMounted = false; };
  }, [hospitals]);

  /** Recenter camera on user only */
  const handleRecenter = useCallback(() => {
    mapRef.current?.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.014,
        longitudeDelta: 0.014,
      },
      700
    );
  }, [userLocation]);

  /** When a hospital card/marker is tapped, zoom to it */
  const handleSelect = useCallback((h: Hospital) => {
    onSelectHospital(h);
    mapRef.current?.animateToRegion(
      {
        latitude: h.latitude - 0.006,   // shift slightly up so marker isn't behind sheet
        longitude: h.longitude,
        latitudeDelta: 0.028,
        longitudeDelta: 0.028,
      },
      600
    );
  }, [onSelectHospital]);

  return (
    <View className="flex-1 bg-slate-100">
      {/* ── Map Canvas ── */}
      <View className="flex-1 relative overflow-hidden">
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          provider={PROVIDER_DEFAULT}
          userInterfaceStyle="light"
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsCompass={false}
          initialRegion={fitRegion([
            DEFAULT_LOCATION,
            ...hospitals.map((h) => ({ latitude: h.latitude, longitude: h.longitude })),
          ], 1.4) ?? { latitude: DEFAULT_LOCATION.latitude, longitude: DEFAULT_LOCATION.longitude, latitudeDelta: 0.12, longitudeDelta: 0.12 }}
        >
          {/* ── User location — glowing green pulse dot ── */}
          <Marker
            coordinate={userLocation}
            title="Sua Localização"
            description="Você está aqui"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            {/* Outer aura */}
            <View className="w-12 h-12 rounded-full bg-emerald-400/20 items-center justify-center">
              {/* Mid ring */}
              <View className="w-7 h-7 rounded-full bg-emerald-400/40 items-center justify-center">
                {/* Core dot */}
                <View className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
              </View>
            </View>
          </Marker>

          {/* ── Hospital Markers ── */}
          {hospitals.map((hosp) => {
            const isSelected = hosp.id === selectedHospital.id;

            return (
              <Marker
                key={hosp.id}
                coordinate={{ latitude: hosp.latitude, longitude: hosp.longitude }}
                title={hosp.name}
                description={hosp.address}
                onPress={() => handleSelect(hosp)}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View className="items-center">
                  {/* Icon Container */}
                  <View
                    className={`items-center justify-center ${
                      isSelected
                        ? 'w-12 h-12 rounded-2xl bg-brand-red border-2 border-white'
                        : 'w-10 h-10 rounded-xl bg-white border border-slate-200'
                    }`}
                    style={{
                      elevation: isSelected ? 8 : 4,
                    }}
                  >
                    <Building2
                      size={isSelected ? 24 : 18}
                      color={isSelected ? '#FFFFFF' : '#D9232E'}
                      strokeWidth={2}
                    />
                  </View>

                  {/* Drop shadow tail / pin point */}
                  <View
                    className={`w-1.5 rounded-full mt-0.5 ${
                      isSelected ? 'h-2.5 bg-brand-red' : 'h-2 bg-slate-400'
                    }`}
                  />
                </View>
              </Marker>
            );
          })}
        </MapView>

        {/* ── Back button ── */}
        <View className="absolute top-12 left-5">
          <TouchableOpacity
            onPress={onBack}
            className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-md active:bg-slate-100"
            style={{ elevation: 4 }}
          >
            <ArrowLeft size={22} color="#0F172A" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* ── Recenter button ── */}
        <TouchableOpacity
          onPress={handleRecenter}
          className="absolute right-5 bottom-80 w-12 h-12 rounded-full bg-white items-center justify-center shadow-md active:bg-slate-100 z-10"
          style={{ elevation: 4 }}
        >
          <LocateFixed size={22} color="#0F172A" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* ── Loading Overlay ── */}
      {isLoading && <MapLoadingOverlay />}

      {/* ── Bottom Sheet ── */}
      <HospitalBottomSheet
        sheetRef={sheetRef}
        hospitals={hospitals}
        selectedHospital={selectedHospital}
        onSelectHospital={handleSelect}
        symptom={symptom}
        onStartRoute={handleRecenter}
        autoRoute={autoRoute}
      />
    </View>
  );
}
