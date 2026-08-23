import BottomSheet from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { ArrowLeft, LocateFixed } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

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

export function YangoHospitalMap({
  symptom,
  hospitals,
  selectedHospital,
  onSelectHospital,
  onBack,
  autoRoute,
  isLoading,
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

  // Interactive OpenStreetMap HTML string for Web — fits all hospitals + user
  const leafletHtml = useMemo(() => {
    const hospitalsJson = JSON.stringify(
      hospitals.map((h) => ({
        id: h.id,
        name: h.name,
        address: h.address,
        emergencyAvailable: h.emergencyAvailable,
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
          html, body, #map { width: 100%; height: 100%; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }

          /* User — animated pulsing green dot */
          .user-pulse-outer {
            width: 48px; height: 48px; border-radius: 50%;
            background: rgba(16,185,129,0.18); display: flex; align-items: center; justify-content: center;
            animation: aura 2.2s ease-out infinite;
          }
          .user-pulse-inner {
            width: 22px; height: 22px; border-radius: 50%;
            background: #10b981; border: 3px solid #ffffff;
            box-shadow: 0 2px 8px rgba(16,185,129,0.6);
          }
          @keyframes aura {
            0%   { transform: scale(0.8); opacity: 0.9; }
            50%  { transform: scale(1.15); opacity: 0.4; }
            100% { transform: scale(0.8); opacity: 0.9; }
          }

          /* Hospital icon pin */
          .hosp-pin {
            display: flex; flex-direction: column; align-items: center; gap: 2px; cursor: pointer;
          }
          .hosp-pin-icon {
            width: 40px; height: 40px; border-radius: 14px;
            background: #ffffff; border: 2px solid #e2e8f0;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 14px rgba(0,0,0,0.14);
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          }
          .hosp-pin-icon svg { width: 22px; height: 22px; }
          .hosp-pin-icon:hover { transform: scale(1.12); box-shadow: 0 6px 20px rgba(0,0,0,0.2); }
          .hosp-pin-icon.active {
            background: #D9232E; border-color: #ffffff;
            box-shadow: 0 4px 18px rgba(217,35,46,0.45); transform: scale(1.1);
          }
          .hosp-pin-dot {
            width: 6px; height: 6px; border-radius: 50%; background: #94a3b8;
          }
          .hosp-pin-dot.active { background: #D9232E; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const userLoc = [${userLocation.latitude}, ${userLocation.longitude}];
          const map = L.map('map', { zoomControl: false });

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19, attribution: '© OpenStreetMap'
          }).addTo(map);

          /* User marker */
          const userIcon = L.divIcon({
            className: '',
            html: '<div class="user-pulse-outer"><div class="user-pulse-inner"></div></div>',
            iconSize: [48, 48], iconAnchor: [24, 24]
          });
          L.marker(userLoc, { icon: userIcon }).addTo(map);

          /* Hospital SVG cross icon (red cross inside white rounded square) */
          const crossSvg = (isActive) => isActive
            ? '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="#D9232E" stroke-width="2.5" stroke-linecap="round"/></svg>';

          const list = ${hospitalsJson};
          const allLatLngs = [userLoc, ...list.map(h => [h.lat, h.lng])];

          list.forEach(h => {
            const isSel = h.isSelected;
            const icon = L.divIcon({
              className: '',
              html: \`<div class="hosp-pin">
                <div class="hosp-pin-icon \${isSel ? 'active' : ''}">\${crossSvg(isSel)}</div>
                <div class="hosp-pin-dot \${isSel ? 'active' : ''}"></div>
              </div>\`,
              iconSize: [40, 50], iconAnchor: [20, 48]
            });
            L.marker([h.lat, h.lng], { icon })
              .addTo(map)
              .bindTooltip(h.name, { permanent: false, direction: 'top', className: 'leaflet-tooltip' });
          });

          /* Auto-fit bounds to show user + all hospitals */
          const bounds = L.latLngBounds(allLatLngs);
          map.fitBounds(bounds, { padding: [60, 60] });
        </script>
      </body>
      </html>
    `;
  }, [hospitals, selectedHospital, userLocation]);

  return (
    <View className="flex-1 bg-slate-100">
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

      {/* ── Loading Overlay ── */}
      {isLoading && <MapLoadingOverlay />}

      {/* ── Interactive Draggable Hospital Bottom Sheet ── */}
      <HospitalBottomSheet
        sheetRef={sheetRef}
        hospitals={hospitals}
        selectedHospital={selectedHospital}
        onSelectHospital={onSelectHospital}
        symptom={symptom}
        onStartRoute={handleRecenter}
        autoRoute={autoRoute}
      />
    </View>
  );
}
