import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Save,
  Sliders,
  ShieldCheck,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useProviderStore } from "../../store/useProviderStore";
import { ServiceStatus } from "../../types/provider";

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const services = useProviderStore((s) => s.services);
  const updateServiceStatus = useProviderStore((s) => s.updateServiceStatus);
  const deleteService = useProviderStore((s) => s.deleteService);
  const togglePatientPreview = useProviderStore((s) => s.togglePatientPreview);

  const service = services.find((s) => s.id === id);

  if (!service) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Serviço Não Encontrado</h2>
        <p className="text-xs text-slate-500">
          O serviço solicitado não existe ou foi removido do sistema.
        </p>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
        >
          <ArrowLeft className="h-4 w-4" /> Regressar ao Catálogo
        </Link>
      </div>
    );
  }

  const [status, setStatus] = useState<ServiceStatus>(service.status);
  const [waitTime, setWaitTime] = useState(service.waitTimeMinutes);
  const [capacity, setCapacity] = useState(service.capacityPercentage);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateServiceStatus(service.id, status, waitTime, capacity);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDelete = () => {
    if (confirm(`Tem a certeza que deseja eliminar o serviço "${service.name}"?`)) {
      deleteService(service.id);
      navigate("/services");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao Catálogo de Serviços
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePatientPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-teal-300 font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            <Smartphone className="h-4 w-4" /> Ver no App
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            title="Eliminar Serviço"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Hero Banner Card */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
            {service.category}
          </span>
          <span className="text-xs text-slate-400 font-mono">ID: {service.id}</span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            {service.name}
            {service.isEmergency && (
              <span className="bg-red-100 text-red-700 text-xs font-extrabold px-2 py-0.5 rounded-full">
                24h Emergência
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">{service.description}</p>
        </div>

        <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-4">
          <span>Unidade: <strong>{service.locationName}</strong></span>
          <span>&bull;</span>
          <span>Última Atualização: <strong>{new Date(service.lastUpdated).toLocaleTimeString()}</strong></span>
        </div>
      </div>

      {/* Config Form Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Adjustments */}
        <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-base text-slate-900">Ajustes em Tempo Real</h2>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                ✓ Atualizado em Tempo Real!
              </span>
            )}
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Estado Operativo Atual</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "operational", label: "Operacional", color: "bg-emerald-500 text-white" },
                { id: "busy", label: "Alta Demanda", color: "bg-amber-500 text-white" },
                { id: "interrupted", label: "Indisponível", color: "bg-red-500 text-white" },
              ].map((st) => (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setStatus(st.id as ServiceStatus)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                    status === st.id
                      ? `${st.color} border-transparent shadow-md`
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Wait Time Slider */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">Tempo Estimado de Espera</span>
              <span className="text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                {waitTime} minutos
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="5"
              value={waitTime}
              onChange={(e) => setWaitTime(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <p className="text-[11px] text-slate-400">
              Valor exibido aos pacientes ao procurar por este serviço na aplicação móvel SaúdeLink.
            </p>
          </div>

          {/* Capacity Slider */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">Taxa de Ocupação / Lotação</span>
              <span className="text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                {capacity}% ocupado
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs hover:opacity-95 shadow-md transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Publicar Alteração Imediata</span>
            </button>
          </div>
        </div>

        {/* Right Col: Patient View Simulator Preview */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Smartphone className="h-5 w-5 text-teal-400" />
            <h3 className="font-bold text-sm text-slate-100">Visão Direta no SaúdeLink Mobile</h3>
          </div>

          <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">{service.name}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  status === "operational"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : status === "busy"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}
              >
                {status.toUpperCase()}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 space-y-1">
              <div>⏱ Tempo de espera: <strong>~{waitTime} min</strong></div>
              <div>📊 Ocupação estimada: <strong>{capacity}%</strong></div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
