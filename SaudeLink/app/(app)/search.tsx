import { router } from 'expo-router';
import {
  Activity,
  ArrowLeft,
  Baby,
  Bone,
  Brain,
  Building2,
  ChevronRight,
  HeartPulse,
  MapPin,
  ShieldAlert,
  Stethoscope,
  Syringe,
  Thermometer,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



// Structured symptoms list for specific health searches
const SYMPTOMS_LIST = [
  {
    id: 'sym-1',
    title: 'Dor de Cabeça Aguda & Enxaqueca',
    department: 'Neurologia • Pronta Resposta',
    icon: Brain,
    color: '#7C3AED',
    hospitalId: 'hospital-central',
    hospitalName: 'Hospital Central de Luanda',
  },
  {
    id: 'sym-2',
    title: 'Febre Alta & Calafrios',
    department: 'Clínica Geral & Infecções',
    icon: Thermometer,
    color: '#EF4444',
    hospitalId: 'hospital-municipal',
    hospitalName: 'Hospital Municipal de Luanda',
  },
  {
    id: 'sym-3',
    title: 'Fratura, Lesão ou Trauma Ósseo',
    department: 'Ortopedia & Traumatologia',
    icon: Bone,
    color: '#F97316',
    hospitalId: 'hospital-geral',
    hospitalName: 'Hospital Geral de Luanda',
  },
  {
    id: 'sym-4',
    title: 'Falta de Ar & Dificuldade Respiratória',
    department: 'Pneumologia & Emergência 24h',
    icon: Activity,
    color: '#0EA5E9',
    hospitalId: 'clinica-girassol',
    hospitalName: 'Clínica Girassol',
  },
  {
    id: 'sym-5',
    title: 'Dor Abdominal ou Estomacal Aguda',
    department: 'Gastroenterologia & Urgência',
    icon: Stethoscope,
    color: '#EAB308',
    hospitalId: 'clinica-nova-vida',
    hospitalName: 'Clínica Nova Vida',
  },
  {
    id: 'sym-6',
    title: 'Pressão Alta & Dor no Peito',
    department: 'Cardiologia & Urgência 24h',
    icon: HeartPulse,
    color: '#DC2626',
    hospitalId: 'hospital-central',
    hospitalName: 'Hospital Central de Luanda',
  },
  {
    id: 'sym-7',
    title: 'Enjoo, Vómitos & Desidratação',
    department: 'Urgência Médica & Soro',
    icon: Syringe,
    color: '#10B981',
    hospitalId: 'hospital-materno-infantil',
    hospitalName: 'Hospital Materno Infantil',
  },
  {
    id: 'sym-8',
    title: 'Gravidez, Dores ou Trabalho de Parto',
    department: 'Maternidade & Ginecologia',
    icon: Baby,
    color: '#EC4899',
    hospitalId: 'hospital-materno-infantil',
    hospitalName: 'Hospital Materno Infantil',
  },
  {
    id: 'sym-9',
    title: 'Reação Alérgica Aguda & Inchaço',
    department: 'Alergologia & Imunologia',
    icon: ShieldAlert,
    color: '#F43F5E',
    hospitalId: 'clinica-girassol',
    hospitalName: 'Clínica Girassol',
  },
];

export default function SearchSymptomsScreen() {
  const [query, setQuery] = useState('');

  // Filter symptoms based on live query
  const filteredSymptoms = useMemo(() => {
    if (!query.trim()) return SYMPTOMS_LIST;
    const q = query.toLowerCase().trim();
    return SYMPTOMS_LIST.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.hospitalName.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Top Bar with Back Action ── */}
      <View className="px-5 pt-2 pb-3 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center active:bg-slate-200"
        >
          <ArrowLeft size={20} color="#1E293B" strokeWidth={2.5} />
        </TouchableOpacity>

        <View className="flex-row items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full">
          <MapPin size={12} color="#64748B" strokeWidth={2} />
          <Text className="text-xs font-nunito-extrabold text-slate-700">
            Luanda, Angola
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ── Yango-inspired Destination / Symptom Search Container ── */}
        <View className="px-5">
          <View className="bg-white rounded-3xl p-4">
            {/* Origin Location indicator line */}
            <View className="flex-row items-center gap-2 pb-3 mb-3 border-b border-slate-100">
              <Text className="text-xs font-nunito-bold text-slate-500">
                Sua Localização actual
              </Text>
            </View>

            {/* Input Row */}
            <View className="flex-row items-center justify-between gap-3 pb-5 border-b border-slate-100">
              {/* Red Yango-styled Icon Badge */}
              <View className="w-11 h-11 rounded-2xl bg-brand-red items-center justify-center">
                <Building2 size={22} color="#FFFFFF" strokeWidth={2.2} />
              </View>

              {/* Input Area */}
              <View className="flex-1">
                <Text className="text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  Destino / Sintoma
                </Text>
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  autoFocus
                  placeholder="Pesquisar sintoma ou hospital..."
                  placeholderTextColor="#94A3B8"
                  className="text-base font-nunito-extrabold text-slate-900 p-0"
                  returnKeyType="search"
                />
              </View>

              {/* Limpar Button */}
              {query.length > 0 ? (
                <TouchableOpacity
                  onPress={() => setQuery('')}
                  className="bg-slate-100 px-3.5 py-1.5 rounded-full active:bg-slate-200"
                >
                  <Text className="text-xs font-nunito-extrabold text-slate-700">
                    Limpar
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>

        {/* ── Symptoms List Section ── */}
        <View className="px-5 mt-2">
          <Text className="text-xs font-nunito-bold text-slate-400 uppercase tracking-widest mb-3">
            {query ? 'Sintomas Relacionados' : 'Sintomas Frequentes'}
          </Text>

          <View className="bg-white">
            {filteredSymptoms.length > 0 ? (
              filteredSymptoms.map((symptom, index) => {
                const IconComponent = symptom.icon;
                const isLast = index === filteredSymptoms.length - 1;

                return (
                  <Pressable
                    key={symptom.id}
                    onPress={() =>
                      router.push({
                        pathname: '/(app)/(tabs)/map',
                        params: { symptom: symptom.title, hospitalId: symptom.hospitalId },
                      })
                    }
                    className="flex-row items-center justify-between py-3.5 active:opacity-70"
                    style={{
                      borderBottomWidth: isLast ? 0 : 1,
                      borderBottomColor: '#F1F5F9',
                    }}
                  >
                    <View className="flex-row items-center gap-3.5 flex-1 pr-3">
                      {/* Grey rounded icon box matching Yango list */}
                      <View className="w-11 h-11 rounded-2xl bg-slate-100 items-center justify-center">
                        <IconComponent size={20} color={symptom.color} strokeWidth={2} />
                      </View>

                      <View className="flex-1 min-w-0">
                        <Text
                          className="text-base font-nunito-extrabold text-slate-900"
                          numberOfLines={1}
                        >
                          {symptom.title}
                        </Text>
                        <Text
                          className="text-xs font-nunito text-slate-400 mt-0.5"
                          numberOfLines={1}
                        >
                          {symptom.department} • {symptom.hospitalName}
                        </Text>
                      </View>
                    </View>

                    <ChevronRight size={18} color="#CBD5E1" strokeWidth={2.5} />
                  </Pressable>
                );
              })
            ) : (
              <View className="py-6 items-center">
                <Text className="text-sm font-nunito-bold text-slate-500">
                  {`Nenhum sintoma encontrado para "${query}"`}
                </Text>
              </View>
            )}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
