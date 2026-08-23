import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import {
  Building2,
  Car,
  CarTaxiFront,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  FlaskConical,
  Footprints,
  Heart,
  MapPin,
  Microscope,
  Navigation,
  Phone,
  Pill,
  ScanLine,
  Share2,
  Star,
  X,
} from 'lucide-react-native';
import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';

import { Hospital } from '@/types/hospital';

interface HospitalBottomSheetProps {
  sheetRef: RefObject<BottomSheet | null>;
  hospitals: Hospital[];
  selectedHospital: Hospital;
  onSelectHospital: (hospital: Hospital) => void;
  symptom?: string;
  onStartRoute?: () => void;
  autoRoute?: boolean;
}

type SheetView = 'summary' | 'detail' | 'route';
type TransportMode = 'car' | 'taxi' | 'walk';

const RESOURCE_CARDS: Record<string, { icon: typeof Building2; label: string; tag: string }> = {
  emergency: { icon: Heart, label: 'Emergência 24/7', tag: 'Pronto Atendimento' },
  pharmacy: { icon: Pill, label: 'Farmácia Interna', tag: 'Medicamentos' },
  laboratory: { icon: Microscope, label: 'Laboratório', tag: 'Exames Rápidos' },
  maternity: { icon: FlaskConical, label: 'Maternidade', tag: 'Cuidados Maternos' },
  pediatrics: { icon: Building2, label: 'Pediatria', tag: 'Atendimento Infantil' },
  imaging: { icon: ScanLine, label: 'Imagiologia', tag: 'Raio-X & TAC' },
};

export function HospitalBottomSheet({
  sheetRef,
  hospitals,
  selectedHospital,
  onSelectHospital,
  onStartRoute,
  autoRoute,
}: HospitalBottomSheetProps) {
  const snapPoints = useMemo(() => ['95%'], []);
  const [activeTab, setActiveTab] = useState<'hospitals' | 'ambulances'>('hospitals');
  const [view, setView] = useState<SheetView>(autoRoute ? 'route' : 'summary');
  const [selectedTransport, setSelectedTransport] = useState<TransportMode>('car');
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (autoRoute) {
      setView('route');
      sheetRef.current?.collapse();
    }
  }, [autoRoute, selectedHospital, sheetRef]);

  const travelMinutes = Math.round((selectedHospital.distance ?? 1) * 4) + 3;
  const taxiMinutes = Math.max(travelMinutes - 2, 3);
  const walkMinutes = Math.round((selectedHospital.distance ?? 1) * 14) + 10;

  const openDetail = useCallback(() => {
    setView('detail');
    sheetRef.current?.snapToIndex(0);
  }, [sheetRef]);

  const closeDetail = useCallback(() => {
    setView('summary');
    sheetRef.current?.collapse();
  }, [sheetRef]);

  const startRoute = useCallback(() => {
    setView('route');
    onStartRoute?.();
    sheetRef.current?.collapse();
  }, [onStartRoute, sheetRef]);

  const cancelRoute = useCallback(() => {
    setView('summary');
    setBookingId(null);
    sheetRef.current?.collapse();
  }, [sheetRef]);

  const handleBookAppointment = useCallback(() => {
    const randomRef = `REF-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookingId(randomRef);
  }, []);

  const handleCardSelect = useCallback((h: Hospital) => {
    if (view === 'detail') setView('summary');
    setBookingId(null);
    onSelectHospital(h);
    sheetRef.current?.collapse();
  }, [view, onSelectHospital, sheetRef]);

  const handleShare = useCallback(async () => {
    try {
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${selectedHospital.latitude},${selectedHospital.longitude}`;
      await Share.share({
        title: selectedHospital.name,
        message: `Hospital: ${selectedHospital.name}\nEndereço: ${selectedHospital.address}\nLocalização: ${mapUrl}`,
        url: mapUrl,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  }, [selectedHospital]);

  const activeResourceCards = Object.entries(selectedHospital.resources)
    .filter(([, val]) => val)
    .map(([key]) => RESOURCE_CARDS[key])
    .filter(Boolean);

  const transportOptions = useMemo(
    () => [
      {
        id: 'car' as const,
        label: 'De Carro',
        subtitle: `${selectedHospital.distance} km de distância`,
        minutes: travelMinutes,
        icon: Car,
      },
      {
        id: 'taxi' as const,
        label: 'Táxi / Rápido',
        subtitle: 'Via expressa prioridade',
        minutes: taxiMinutes,
        icon: CarTaxiFront,
      },
      {
        id: 'walk' as const,
        label: 'Caminhando',
        subtitle: 'A pé em ritmo direto',
        minutes: walkMinutes,
        icon: Footprints,
      },
    ],
    [selectedHospital.distance, travelMinutes, taxiMinutes, walkMinutes]
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={true}
      enablePanDownToClose={false}
      handleIndicatorStyle={{ backgroundColor: '#CBD5E1', width: 40 }}
      backgroundStyle={{ borderRadius: 28, backgroundColor: '#FFFFFF' }}
    >
      {/* ─────────────────── SUMMARY VIEW ─────────────────── */}
      {view === 'summary' && (
        <BottomSheetView style={{ paddingHorizontal: 20, paddingBottom: 24, gap: 12 }}>
          {/* Origin & Destination */}
          <View className="border-b border-slate-100 pb-2">
            <View className="flex-row items-center gap-3 py-1">
              <View className="w-7 h-7 rounded-full bg-slate-100 items-center justify-center">
                <Navigation size={14} color="#0F172A" strokeWidth={2.5} />
              </View>
              <Text className="text-base font-nunito-extrabold text-slate-900 flex-1">
                Residencial • Sua Localização
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-1">
              <View className="flex-row items-center gap-3 flex-1 pr-2">
                <View className="w-7 h-7 rounded-full bg-brand-red items-center justify-center">
                  <Building2 size={14} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-nunito-extrabold text-slate-900" numberOfLines={1}>
                    {`${selectedHospital.name} • ${travelMinutes} min`}
                  </Text>
                  <Text className="text-xs font-nunito text-slate-400" numberOfLines={1}>
                    {selectedHospital.address}
                  </Text>
                </View>
              </View>
              <View className="bg-slate-100 px-3 py-1 rounded-full">
                <Text className="text-xs font-nunito-bold text-slate-700">Paragens</Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setActiveTab('hospitals')}
              className={`px-5 py-2 rounded-2xl flex-row items-center gap-2 active:opacity-90 ${
                activeTab === 'hospitals' ? 'bg-slate-900' : 'bg-slate-100'
              }`}
            >
              <Text className={`text-sm font-nunito-extrabold ${activeTab === 'hospitals' ? 'text-white' : 'text-slate-700'}`}>
                Hospitais Próximos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('ambulances')}
              className={`px-5 py-2 rounded-2xl flex-row items-center gap-2 active:opacity-90 ${
                activeTab === 'ambulances' ? 'bg-slate-900' : 'bg-slate-100'
              }`}
            >
              <Text className={`text-sm font-nunito-extrabold ${activeTab === 'ambulances' ? 'text-white' : 'text-slate-700'}`}>
                Ambulâncias (24/7)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Hospital Cards Carousel */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 4 }}>
            {hospitals.map((hosp) => {
              const isSelected = hosp.id === selectedHospital.id;
              const mins = Math.round((hosp.distance ?? 1) * 4) + 3;
              return (
                <Pressable
                  key={hosp.id}
                  onPress={() => handleCardSelect(hosp)}
                  className={`p-4 rounded-3xl w-56 justify-between border-2 active:opacity-95 ${
                    isSelected ? 'bg-red-50/80 border-brand-red' : 'bg-white border-slate-200'
                  }`}
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className={`w-10 h-10 rounded-2xl items-center justify-center border ${
                      isSelected ? 'bg-white border-red-200' : 'bg-slate-50 border-slate-100'
                    }`}>
                      <Building2 size={20} color={isSelected ? '#D9232E' : '#64748B'} strokeWidth={2} />
                    </View>
                    <View className={`px-2.5 py-1 rounded-full flex-row items-center gap-1 ${isSelected ? 'bg-brand-red' : 'bg-slate-100'}`}>
                      <Clock size={11} color={isSelected ? '#FFFFFF' : '#475569'} strokeWidth={2.5} />
                      <Text className={`text-xs font-nunito-extrabold ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                        {`${mins} min`}
                      </Text>
                    </View>
                  </View>

                  <View className="mb-3">
                    <Text className={`text-base font-nunito-extrabold ${isSelected ? 'text-slate-900' : 'text-slate-800'}`} numberOfLines={1}>
                      {hosp.name}
                    </Text>
                    <Text className="text-xs font-nunito text-slate-500 mt-0.5" numberOfLines={1}>
                      {hosp.address}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between pt-2 border-t border-slate-100">
                    <View className="flex-row items-center gap-1">
                      <Star size={13} color="#EAB308" fill="#EAB308" />
                      <Text className="text-xs font-nunito-extrabold text-slate-700">{hosp.rating}</Text>
                      <Text className="text-xs font-nunito text-slate-400">{`• ${hosp.distance} km`}</Text>
                    </View>
                    <View className={`px-2 py-0.5 rounded-md ${hosp.emergencyAvailable ? 'bg-emerald-50' : 'bg-slate-100'}`}>
                      <Text className={`text-[10px] font-nunito-bold ${hosp.emergencyAvailable ? 'text-emerald-700' : 'text-slate-600'}`}>
                        {hosp.emergencyAvailable ? 'Emergência' : 'Consulta'}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* ── Ver Detalhes Button ── */}
          <TouchableOpacity
            onPress={openDetail}
            className="w-full h-13 bg-brand-red rounded-full flex-row items-center justify-center gap-2 active:opacity-85"
            style={{ height: 52 }}
          >
            <Building2 size={18} color="#FFFFFF" strokeWidth={2} />
            <Text className="text-base font-nunito-extrabold text-white">
              {`Ver Detalhes • ${selectedHospital.name}`}
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      )}

      {/* ─────────────────── DETAIL VIEW (CLEAN & MODERN DESIGN BASED ON TEMPLATE) ─────────────────── */}
      {view === 'detail' && (
        <BottomSheetScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 36, gap: 20 }}>
          {/* Header Title & Close Button */}
          <View className="flex-row items-center justify-between pt-1">
            <Text className="text-2xl font-nunito-extrabold text-slate-900">
              Detalhes do Hospital
            </Text>
            <TouchableOpacity
              onPress={closeDetail}
              className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center active:bg-slate-200"
            >
              <ChevronDown size={22} color="#0F172A" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* ── Pickup Point & Pickout Point Card (Template Style) ── */}
          <View className="p-4 relative">
            <View className="flex-row items-start gap-3">
              <View className="items-center mt-1">
                <MapPin size={18} color="#0F172A" strokeWidth={2.5} />
                <View className="w-0.5 h-8 border-r border-dashed border-slate-300 my-1" />
                <MapPin size={18} color="#D9232E" strokeWidth={2.5} />
              </View>

              <View className="flex-1 justify-between gap-4">
                {/* Origin */}
                <View>
                  <Text className="text-xs font-nunito-bold text-slate-400">Ponto de Partida</Text>
                  <Text className="text-sm font-nunito-extrabold text-slate-800" numberOfLines={1}>
                    Sua Localização Atual • Luanda
                  </Text>
                </View>

                {/* Destination */}
                <View>
                  <Text className="text-xs font-nunito-bold text-slate-400">Hospital de Destino</Text>
                  <Text className="text-sm font-nunito-extrabold text-slate-900" numberOfLines={1}>
                    {selectedHospital.name}
                  </Text>
                  <Text className="text-xs font-nunito text-slate-500" numberOfLines={1}>
                    {selectedHospital.address}
                  </Text>
                </View>
              </View>

            </View>
          </View>

          {/* ── Tempo de Deslocamento (Mapped Cards) ── */}
          <View>
            <Text className="text-base font-nunito-extrabold text-slate-900 mb-3">
              Tempo de Deslocamento
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 4 }}>
              {transportOptions.map((opt) => {
                const isSelected = selectedTransport === opt.id;
                const IconComp = opt.icon;

                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => setSelectedTransport(opt.id)}
                    className={`p-4 rounded-3xl w-44 justify-between border-2 active:opacity-95 ${
                      isSelected
                        ? 'bg-red-50/80 border-brand-red'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <View className="flex-row items-center justify-between mb-3">
                      <View
                        className={`w-10 h-10 rounded-2xl items-center justify-center border ${
                          isSelected
                            ? 'bg-white border-red-200'
                            : 'bg-slate-50 border-slate-100'
                        }`}
                      >
                        <IconComp
                          size={20}
                          color={isSelected ? '#D9232E' : '#64748B'}
                          strokeWidth={2}
                        />
                      </View>

                      <View
                        className={`px-2.5 py-1 rounded-full flex-row items-center gap-1 ${
                          isSelected ? 'bg-brand-red' : 'bg-slate-100'
                        }`}
                      >
                        <Clock size={11} color={isSelected ? '#FFFFFF' : '#475569'} strokeWidth={2.5} />
                        <Text
                          className={`text-xs font-nunito-extrabold ${
                            isSelected ? 'text-white' : 'text-slate-700'
                          }`}
                        >
                          {`${opt.minutes} min`}
                        </Text>
                      </View>
                    </View>

                    <View>
                      <Text
                        className={`text-base font-nunito-extrabold ${
                          isSelected ? 'text-slate-900' : 'text-slate-800'
                        }`}
                        numberOfLines={1}
                      >
                        {opt.label}
                      </Text>
                      <Text className="text-xs font-nunito text-slate-500 mt-0.5" numberOfLines={1}>
                        {opt.subtitle}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* ── Serviços & Recursos ── */}
          {activeResourceCards.length > 0 && (
            <View>
              <Text className="text-base font-nunito-extrabold text-slate-900 mb-3">
                Serviços & Recursos
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingVertical: 4 }}
              >
                {activeResourceCards.map((res, index) => {
                  const IconComponent = res.icon;

                  return (
                    <View
                      key={index}
                      className="p-4 rounded-3xl w-44 justify-between border-2 bg-white border-slate-200"
                    >
                      <View className="flex-row items-center justify-between mb-3">
                        <View className="w-10 h-10 rounded-2xl items-center justify-center border bg-slate-50 border-slate-100">
                          <IconComponent size={20} color="#D9232E" strokeWidth={2} />
                        </View>

                        <View className="px-2.5 py-1 rounded-full bg-emerald-50 flex-row items-center gap-1">
                          <Check size={11} color="#059669" strokeWidth={2.5} />
                          <Text className="text-xs font-nunito-extrabold text-emerald-700">
                            Ativo
                          </Text>
                        </View>
                      </View>

                      <View>
                        <Text
                          className="text-base font-nunito-extrabold text-slate-900"
                          numberOfLines={1}
                        >
                          {res.label}
                        </Text>
                        <Text className="text-xs font-nunito text-slate-500 mt-0.5" numberOfLines={1}>
                          {res.tag}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* ── Informações & Contacto ── */}
          <View className="bg-slate-50 border border-slate-100 rounded-3xl p-4 gap-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Star size={16} color="#EAB308" fill="#EAB308" />
                <Text className="text-sm font-nunito-extrabold text-slate-900">
                  {`${selectedHospital.rating} de avaliação`}
                </Text>
              </View>

              <View className={`px-3 py-1 rounded-full`}>
                <Text className={`text-xs font-nunito-extrabold ${selectedHospital.isOpen ? 'text-emerald-800' : 'text-slate-600'}`}>
                  {selectedHospital.isOpen ? '● Aberto Agora' : '● Fechado'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between pt-2 border-t border-slate-200/60">
              <View className="flex-row items-center gap-2 flex-1">
                <Phone size={16} color="#16A34A" strokeWidth={2.5} />
                <Text className="text-sm font-nunito-extrabold text-slate-800">
                  {selectedHospital.phone || '+244 923 000 100'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => selectedHospital.phone && Linking.openURL(`tel:${selectedHospital.phone}`)}
                className="px-4 py-2 bg-emerald-500 rounded-2xl active:bg-emerald-600"
              >
                <Text className="text-xs font-nunito-extrabold text-white">Ligar Agora</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Single Brand CTA Button ── */}
          <TouchableOpacity
            onPress={startRoute}
            className="w-full bg-brand-red rounded-full flex-row items-center justify-center gap-2 active:opacity-90 mt-2"
            style={{ height: 54 }}
          >
            <Navigation size={18} color="#FFFFFF" strokeWidth={2.5} />
            <Text className="text-base font-nunito-extrabold text-white">
              Iniciar Rota
            </Text>
          </TouchableOpacity>

          {/* ── Dual Buttons: Cancelar & Partilhar ── */}
          <View className="flex-row gap-3">
            {/* Cancelar Button (Black Background) */}
            <TouchableOpacity
              onPress={closeDetail}
              className="flex-1 bg-slate-900 rounded-full flex-row items-center justify-center gap-2 active:opacity-90"
              style={{ height: 48 }}
            >
              <X size={16} color="#FFFFFF" strokeWidth={2.5} />
              <Text className="text-sm font-nunito-extrabold text-white">
                Cancelar
              </Text>
            </TouchableOpacity>

            {/* Partilhar Button */}
            <TouchableOpacity
              onPress={handleShare}
              className="flex-1 bg-slate-100 border border-slate-200/80 rounded-full flex-row items-center justify-center gap-2 active:bg-slate-200"
              style={{ height: 48 }}
            >
              <Share2 size={16} color="#0F172A" strokeWidth={2.5} />
              <Text className="text-sm font-nunito-extrabold text-slate-800">
                Partilhar
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      )}

      {/* ─────────────────── ROUTE / LIVE NAVIGATION VIEW ─────────────────── */}
      {view === 'route' && (
        <BottomSheetView style={{ paddingHorizontal: 20, paddingBottom: 28, gap: 16 }}>
          {/* Live Navigation Status Header */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5">
              <View className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white items-center justify-center">
                <View className="w-1.5 h-1.5 rounded-full bg-white" />
              </View>
              <View>
                <Text className="text-[11px] font-nunito-extrabold text-emerald-600 uppercase tracking-wider">
                  Navegação em Tempo Real
                </Text>
                <Text className="text-lg font-nunito-extrabold text-slate-900" numberOfLines={1}>
                  {`A caminho do ${selectedHospital.name}`}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={cancelRoute}
              className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center active:bg-slate-200"
            >
              <X size={18} color="#0F172A" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* Route Metric Content (Clean Light Platform Style) */}
          <View className="py-1 gap-3">
            <View className="flex-row items-center justify-between border-b border-slate-100 pb-3">
              <View>
                <Text className="text-xs font-nunito text-slate-500">Tempo Estimado</Text>
                <Text className="text-3xl font-nunito-extrabold text-slate-900">
                  {`${selectedTransport === 'car' ? travelMinutes : selectedTransport === 'taxi' ? taxiMinutes : walkMinutes} min`}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-xs font-nunito text-slate-500">Distância Restante</Text>
                <Text className="text-xl font-nunito-extrabold text-brand-red">
                  {`${selectedHospital.distance} km`}
                </Text>
              </View>
            </View>

            {/* Route Points */}
            <View className="flex-row items-center gap-2.5">
              <MapPin size={16} color="#D9232E" strokeWidth={2.5} />
              <Text className="text-xs font-nunito text-slate-600 flex-1" numberOfLines={1}>
                {`Sua Localização → ${selectedHospital.address}`}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 pt-1">
            {/* Finalizar Marcação ou Badge de Confirmação com Ref ID */}
            {!bookingId ? (
              <TouchableOpacity
                onPress={handleBookAppointment}
                className="w-full bg-brand-red rounded-full flex-row items-center justify-center gap-2 active:opacity-90"
                style={{ height: 52 }}
              >
                <CheckCircle2 size={18} color="#FFFFFF" strokeWidth={2.5} />
                <Text className="text-base font-nunito-extrabold text-white">
                  Finalizar Marcação de Consulta
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="w-full bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 flex-row items-center justify-between shadow-xs">
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-full bg-emerald-500 items-center justify-center">
                    <CheckCircle2 size={20} color="#FFFFFF" strokeWidth={2.5} />
                  </View>
                  <View>
                    <Text className="text-xs font-nunito-bold text-emerald-800">
                      Marcação Confirmada!
                    </Text>
                    <Text className="text-sm font-nunito-extrabold text-emerald-950">
                      {`Ref ID: ${bookingId}`}
                    </Text>
                  </View>
                </View>
                <View className="bg-white border border-emerald-200 px-3 py-1.5 rounded-xl">
                  <Text className="text-[11px] font-nunito-extrabold text-emerald-700">A caminho</Text>
                </View>
              </View>
            )}

            {/* Cancelar Rota */}
            <TouchableOpacity
              onPress={cancelRoute}
              className="w-full bg-slate-900 rounded-full flex-row items-center justify-center gap-2 active:opacity-90"
              style={{ height: 48 }}
            >
              <X size={16} color="#FFFFFF" strokeWidth={2.5} />
              <Text className="text-sm font-nunito-extrabold text-white">
                Cancelar Rota
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      )}
    </BottomSheet>
  );
}
