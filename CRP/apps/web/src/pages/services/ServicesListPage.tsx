import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  Plus,
  Search,
  Filter,
  Clock,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sliders,
  ChevronRight,
  X,
} from "lucide-react";
import { useProviderStore } from "../../store/useProviderStore";
import { ServiceCategory, ServiceStatus } from "../../types/provider";

export const ServicesListPage: React.FC = () => {
  const services = useProviderStore((s) => s.services);
  const updateServiceStatus = useProviderStore((s) => s.updateServiceStatus);
  const addService = useProviderStore((s) => s.addService);
  const locations = useProviderStore((s) => s.locations);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Service Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("emergency");
  const [description, setDescription] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [locationId, setLocationId] = useState(locations[0]?.id || "");

  const filteredServices = services.filter((srv) => {
    const matchesSearch =
      srv.name.toLowerCase().includes(search.toLowerCase()) ||
      srv.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || srv.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const loc = locations.find((l) => l.id === locationId);

    addService({
      name,
      category,
      description,
      status: "operational",
      waitTimeMinutes: 15,
      capacityPercentage: 40,
      isEmergency,
      locationId: locationId || "loc-001",
      locationName: loc?.name || "Campus Principal",
    });

    setName("");
    setDescription("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-2xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Catálogo de Serviços de Saúde</h1>
          <p className="text-xs text-slate-500 mt-1">
            Gira a lista de especialidades, pronto socorro, diagnósticos e capacidade operativa em tempo real.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs hover:opacity-95 transition-all shadow-md self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Serviço</span>
        </button>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar especialidade ou serviço..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "Todos" },
            { id: "emergency", label: "Emergência 24h" },
            { id: "radiology", label: "Radiologia" },
            { id: "laboratory", label: "Laboratório" },
            { id: "icu", label: "UTI" },
            { id: "pediatrics", label: "Pediatria" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? "bg-slate-900 text-teal-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => {
          const isOp = srv.status === "operational";
          const isBusy = srv.status === "busy";
          const isInterrupted = srv.status === "interrupted";

          return (
            <div
              key={srv.id}
              className="rounded-3xl bg-white border border-slate-200 p-6 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {srv.category}
                  </span>

                  {isOp && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Operacional
                    </span>
                  )}
                  {isBusy && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Alta Demanda
                    </span>
                  )}
                  {isInterrupted && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-700 border border-red-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Indisponível
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                    {srv.name}
                    {srv.isEmergency && (
                      <span className="bg-red-50 text-red-600 text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                        24h ER
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {srv.description}
                  </p>
                </div>
              </div>

              {/* Status Switcher Toolbar inside card */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" /> ~{srv.waitTimeMinutes} min
                  </span>
                  <span>Ocupação: {srv.capacityPercentage}%</span>
                </div>

                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-center">
                  <button
                    onClick={() => updateServiceStatus(srv.id, "operational")}
                    className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                      isOp ? "bg-emerald-500 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Operacional
                  </button>
                  <button
                    onClick={() => updateServiceStatus(srv.id, "busy")}
                    className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                      isBusy ? "bg-amber-500 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Alta Demanda
                  </button>
                  <button
                    onClick={() => updateServiceStatus(srv.id, "interrupted")}
                    className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                      isInterrupted ? "bg-red-500 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Indisponível
                  </button>
                </div>

                <Link
                  to={`/services/${srv.id}`}
                  className="flex items-center justify-center gap-1 w-full text-center text-xs font-bold text-teal-600 hover:text-teal-700 py-1"
                >
                  <span>Detalhes & Configuração Avançada</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Cadastrar Novo Serviço de Saúde</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome do Serviço / Especialidade
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Ortopedia & Traumatologia 24h"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500 capitalize"
                  >
                    <option value="emergency">Emergência</option>
                    <option value="radiology">Radiologia</option>
                    <option value="laboratory">Laboratório</option>
                    <option value="icu">UTI</option>
                    <option value="outpatient">Ambulatório</option>
                    <option value="pediatrics">Pediatria</option>
                    <option value="cardiology">Cardiologia</option>
                    <option value="surgery">Cirurgia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unidade</label>
                  <select
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrição</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o atendimento oferecido ao paciente..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">É um serviço de emergência 24h</span>
                <input
                  type="checkbox"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
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
                  Adicionar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
