import BottomSheet from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { ArrowLeft, Building2, LocateFixed } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

import { HospitalBottomSheet } from '@/components/hospital/HospitalBottomSheet';
import { Hospital } from '@/types/hospital';

export interface YangoHospitalMapProps {
  symptom?: string;
  hospitals: Hospital[];
  selectedHospital: Hospital;
  onSelectHospital: (hospital: Hospital) => void;
  onBack: () => void;
}

const DEFAULT_LOCATION = { latitude: -8.8383, longitude: 13.2344 };

export function YangoHospitalMap({
  symptom,
  hospitals,
  selectedHospital,
  onSelectHospital,
  onBack,
}: YangoHospitalMapProps) {
  const mapRef = useRef<MapView>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);

  // Fetch real-time user location and zoom in closely on user
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

            // Animate map camera zoomed in close to user location
            mapRef.current?.animateToRegion({
              latitude: newLoc.latitude,
              longitude: newLoc.longitude,
              latitudeDelta: 0.012,
              longitudeDelta: 0.012,
            }, 800);
          }
        }
      } catch (error) {
        console.log('Location permission/fetch error:', error);
      }
    }

    getUserLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleRecenter() {
    mapRef.current?.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      },
      800
    );
  }

  function handleSelect(h: Hospital) {
    onSelectHospital(h);
  }

  return (
    <View className="flex-1 bg-slate-900">
      {/* ── Native Map Canvas ── */}
      <View className="flex-1 relative overflow-hidden">
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          provider={PROVIDER_DEFAULT}
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsCompass={false}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.012,
            longitudeDelta: 0.012,
          }}
        >
          {/* Glowing Interactive User Location Pulse Pin */}
          <Marker
            coordinate={userLocation}
            title="Sua Localização"
            description="Você está aqui"
          >
            <View className="items-center justify-center">
              <View className="w-12 h-12 rounded-full bg-emerald-500/25 items-center justify-center border border-emerald-400/40 shadow-lg">
                <View className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white items-center justify-center shadow-md">
                  <View className="w-2 h-2 rounded-full bg-white" />
                </View>
              </View>
            </View>
          </Marker>

          {/* Hospital Markers (Clean Icons Only - No Text) */}
          {hospitals.map((hosp) => {
            const isSelected = hosp.id === selectedHospital.id;

            return (
              <Marker
                key={hosp.id}
                coordinate={{ latitude: hosp.latitude, longitude: hosp.longitude }}
                title={hosp.name}
                description={hosp.address}
                onPress={() => handleSelect(hosp)}
              >
                <View
                  className={`w-10 h-10 rounded-2xl items-center justify-center shadow-lg border-2 ${
                    isSelected
                      ? 'bg-brand-red border-white scale-110'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <Building2
                    size={20}
                    color={isSelected ? '#FFFFFF' : '#EF4444'}
                    strokeWidth={2.5}
                  />
                </View>
              </Marker>
            );
          })}
        </MapView>

        {/* ── Top Floating Back Button ── */}
        <View className="absolute top-12 left-5 pointer-events-box-none">
          <TouchableOpacity
            onPress={onBack}
            className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-md active:bg-slate-100"
          >
            <ArrowLeft size={22} color="#0F172A" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* ── Floating Right Recenter Button ── */}
        <TouchableOpacity
          onPress={handleRecenter}
          className="absolute right-5 bottom-80 w-12 h-12 rounded-full bg-white items-center justify-center shadow-md active:bg-slate-100 z-10"
        >
          <LocateFixed size={22} color="#0F172A" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* ── Interactive Draggable Hospital Bottom Sheet ── */}
      <HospitalBottomSheet
        sheetRef={sheetRef}
        hospitals={hospitals}
        selectedHospital={selectedHospital}
        onSelectHospital={onSelectHospital}
        symptom={symptom}
        onStartRoute={handleRecenter}
      />
    </View>
  );
}
