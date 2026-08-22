import BottomSheet from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { ArrowLeft, LocateFixed } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

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
  const sheetRef = useRef<BottomSheet>(null);
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);

  // Fetch real-time user location
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
            setUserLocation({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            });
          }
        }
      } catch (error) {
        console.log('Location fetch error on web:', error);
      }
    }

    getUserLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleRecenter() {
    sheetRef.current?.snapToIndex(0);
  }

  // Interactive OpenStreetMap HTML string for Web centered closely on User
  const leafletHtml = useMemo(() => {
    const hospitalsJson = JSON.stringify(
      hospitals.map((h) => ({
        id: h.id,
        name: h.name,
        address: h.address,
        lat: h.latitude,
        lng: h.longitude,
        isSelected: h.id === selectedHospital.id,
      }))
    );

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body, #map { width: 100%; height: 100%; margin: 0; padding: 0; background: #e5e3df; font-family: system-ui, -apple-system, sans-serif; }
          .user-pulse-pin {
            width: 24px; height: 24px; background: #10b981; border: 3px solid #ffffff; border-radius: 50%;
            box-shadow: 0 0 0 8px rgba(16,185,129,0.3); animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
            70% { box-shadow: 0 0 0 14px rgba(16, 185, 129, 0); }
            100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
          }
          .hosp-icon-pin {
            width: 36px; height: 36px; background: #ffffff; border: 2px solid #cbd5e1; border-radius: 12px;
            display: flex; align-items: center; justify-content: center; font-size: 18px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.18); cursor: pointer; transition: transform 0.15s ease;
          }
          .hosp-icon-pin:hover { transform: scale(1.15); }
          .hosp-icon-pin.active { background: #ef4444; border-color: #ffffff; color: #ffffff; box-shadow: 0 4px 14px rgba(239,68,68,0.5); transform: scale(1.1); }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const userLoc = [${userLocation.latitude}, ${userLocation.longitude}];
          const map = L.map('map', { zoomControl: false }).setView(userLoc, 15);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
          }).addTo(map);

          // Glowing Pulsing User Pin Marker
          const userIcon = L.divIcon({ className: 'user-pulse-pin', iconSize: [24, 24], iconAnchor: [12, 12] });
          L.marker(userLoc, { icon: userIcon }).addTo(map);

          // Clean Hospital Icon Pins (No Text Labels)
          const list = ${hospitalsJson};
          list.forEach(h => {
            const isSel = h.isSelected;
            const icon = L.divIcon({
              className: 'custom-hosp-icon',
              html: \`<div class="hosp-icon-pin \${isSel ? 'active' : ''}">🏥</div>\`,
              iconAnchor: [18, 18]
            });
            L.marker([h.lat, h.lng], { icon }).addTo(map);
          });
        </script>
      </body>
      </html>
    `;
  }, [hospitals, selectedHospital, userLocation]);

  return (
    <View className="flex-1 bg-slate-900">
      {/* ── Interactive Web Map Canvas ── */}
      <View className="flex-1 bg-[#EBECE9] relative overflow-hidden">
        {Platform.OS === 'web' ? (
          <iframe
            srcDoc={leafletHtml}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Mapa de Hospitais de Luanda"
          />
        ) : (
          <Svg height="100%" width="100%" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
            <Rect x="0" y="0" width="400" height="600" fill="#E8ECE7" />
            <Path d="M 0 0 L 140 0 L 100 120 L 0 80 Z" fill="#D4E4D3" />
            <Path d="M 280 180 L 400 160 L 400 320 L 320 280 Z" fill="#DDF0DC" />
            <Path d="M 20 420 L 150 400 L 180 550 L 0 580 Z" fill="#DAECD8" />

            <Line x1="0" y1="120" x2="400" y2="180" stroke="#FFFFFF" strokeWidth="12" />
            <Line x1="60" y1="0" x2="160" y2="600" stroke="#FFFFFF" strokeWidth="10" />
            <Line x1="220" y1="0" x2="140" y2="600" stroke="#FFFFFF" strokeWidth="8" />
            <Line x1="0" y1="340" x2="400" y2="300" stroke="#FFFFFF" strokeWidth="10" />

            <Circle cx="200" cy="280" r="14" fill="#10B981" opacity="0.3" />
            <Circle cx="200" cy="280" r="8" fill="#FFFFFF" stroke="#10B981" strokeWidth="3" />
            <Circle cx="200" cy="280" r="4" fill="#10B981" />

            <Rect x="285" y="155" width="36" height="36" rx="12" fill="#EF4444" />
          </Svg>
        )}

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
