import React, { useState } from "react";
import {
  MapPin,
  Plus,
  Phone,
  Clock,
  ShieldCheck,
  Check,
  Navigation,
  Building2,
  AlertCircle,
  X,
} from "lucide-react";
import { useProviderStore } from "../../store/useProviderStore";
import { ProviderLocation } from "../../types/provider";

export const HospitalLocationsPage: React.FC = () => {
  const locations = useProviderStore((s) => s.locations);
  const addLocation = useProviderStore((s) => s.addLocation);

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Luanda");
  const [state, setState] = useState("Luanda");
  const [phone, setPhone] = useState("");
  const [emergencyAvailable, setEmergencyAvailable] = useState(true);

  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;

    addLocation({
      providerId: "prov-001",
      name,
      address,
      city,
      state,
      zipCode: "1000",
      latitude: -8.8383,
      longitude: 13.2344,
      isMain: false,
      emergencyAvailable,
      phone,
      operatingHours: [
        { day: "monday", label: "Segunda-feira", openTime: "08:00", closeTime: "18:00", is24Hours: emergencyAvailable, isClosed: false },
        { day: "tuesday", label: "Terça-feira", openTime: "08:00", closeTime: "18:00", is24Hours: emergencyAvailable, isClosed: false },
        { day: "wednesday", label: "Quarta-feira", openTime: "08:00", closeTime: "18:00", is24Hours: emergencyAvailable, isClosed: false },
        { day: "thursday", label: "Quinta-feira", openTime: "08:00", closeTime: "18:00", is24Hours: emergencyAvailable, isClosed: false },
        { day: "friday", label: "Sexta-feira", openTime: "08:00", closeTime: "18:00", is24Hours: emergencyAvailable, isClosed: false },
        { day: "saturday", label: "Sábado", openTime: "08:00", closeTime: "13:00", is24Hours: false, isClosed: false },
        { day: "sunday", label: "Domingo", openTime: "", closeTime: "", is24Hours: false, isClosed: true },
      ],
    });

    setName("");
    setAddress("");
    setPhone("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-2xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Unidades & Campus do Hospital</h1>
          <p className="text-xs text-slate-500 mt-1">
            Gira os edifícios, unidades externas de diagnóstico e campus hospitalares cadastrados.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs hover:opacity-95 transition-all shadow-md self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar Nova Unidade</span>
        </button>
      </div>

      {/* Locations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="rounded-3xl bg-white border border-slate-200 p-6 shadow-2xs space-y-4 relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900">{loc.name}</h3>
                  {loc.isMain && (
                    <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-extrabold text-[10px] border border-teal-200">
                      Sede Principal
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  {loc.address}, {loc.city}
                </p>
              </div>

              {loc.emergencyAvailable && (
                <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-extrabold text-[10px] border border-red-200 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  Emergência 24h
                </span>
              )}
            </div>

            {/* Map Visual Simulation Box */}
            <div className="h-36 rounded-2xl bg-slate-900 p-4 relative overflow-hidden flex flex-col justify-end text-white border border-slate-800">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80')",
                }}
              />
              <div className="relative z-10 flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <Navigation className="h-4 w-4 text-teal-400" />
                  {loc.latitude}, {loc.longitude}
                </span>
                <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded text-[10px] font-semibold">
                  Coordenadas GPS SaúdeLink
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                <Phone className="h-3.5 w-3.5 text-slate-400" /> {loc.phone || "Linha Geral"}
              </span>
              <span className="text-teal-600 font-bold hover:underline cursor-pointer">
                Editar Horários & Acesso
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Location Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Cadastrar Nova Unidade Hospitalar</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLocation} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome da Unidade / Campus
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Unidade Especializada de Oncologia"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Endereço</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Rua Rainha Ginga, Nº 12"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+244 923 000 000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Possui Entrada de Emergência 24h</span>
                <input
                  type="checkbox"
                  checked={emergencyAvailable}
                  onChange={(e) => setEmergencyAvailable(e.target.checked)}
                  className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs hover:opacity-95 shadow-sm"
                >
                  Cadastrar Unidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
