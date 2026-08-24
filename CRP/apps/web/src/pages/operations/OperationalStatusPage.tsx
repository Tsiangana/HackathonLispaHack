import React, { useState } from "react";
import {
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Bell,
  Sparkles,
  Plus,
  X,
  ShieldAlert,
} from "lucide-react";
import { useProviderStore } from "../../store/useProviderStore";

export const OperationalStatusPage: React.FC = () => {
  const services = useProviderStore((s) => s.services);
  const interruptions = useProviderStore((s) => s.interruptions);
  const updateServiceStatus = useProviderStore((s) => s.updateServiceStatus);
  const createInterruption = useProviderStore((s) => s.createInterruption);
  const resolveInterruption = useProviderStore((s) => s.resolveInterruption);
  const togglePatientPreview = useProviderStore((s) => s.togglePatientPreview);

  const [showInterruptionModal, setShowInterruptionModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || "");
  const [reason, setReason] = useState("");
  const [estimatedResolution, setEstimatedResolution] = useState("Hoje às 18:00");
  const [severity, setSeverity] = useState<"info" | "warning" | "critical">("warning");

  const activeInterruptions = interruptions.filter((i) => i.status === "active");

  const handleCreateInterruptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !selectedServiceId) return;

    const srv = services.find((s) => s.id === selectedServiceId);
    if (!srv) return;

    createInterruption({
      serviceId: selectedServiceId,
      serviceName: srv.name,
      title: `Interrupção Operativa: ${srv.name}`,
      reason,
      severity,
      estimatedResolution,
      notifiedPatientsCount: Math.floor(Math.random() * 120) + 30,
    });

    setReason("");
    setShowInterruptionModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-slate-800 p-6 rounded-3xl text-slate-100 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 fill-amber-300" /> Centro de Alteração de Status
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
              Sincronia 0s
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">Status Operativo 24h & Interrupções</h1>
          <p className="text-xs text-slate-300">
            Altere a disponibilidade dos serviços hospitalares. A alteração propaga-se no mesmo instante para a aplicação móvel dos pacientes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setShowInterruptionModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Reportar Interrupção / Manutenção</span>
          </button>
        </div>
      </div>

      {/* Active Interruption Alert Banner */}
      {activeInterruptions.length > 0 && (
        <div className="rounded-3xl bg-amber-50 border border-amber-200 p-6 text-amber-900 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-black text-sm">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span>{activeInterruptions.length} Interrupções Notificadas aos Pacientes</span>
            </div>
            <button
              onClick={togglePatientPreview}
              className="text-xs font-bold text-amber-900 underline"
            >
              Ver como o paciente vê
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeInterruptions.map((int) => (
              <div
                key={int.id}
                className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs flex justify-between items-start"
              >
                <div className="space-y-1">
                  <span className="font-extrabold text-xs text-slate-900">{int.serviceName}</span>
                  <p className="text-xs text-slate-600">{int.reason}</p>
                  <div className="text-[10px] text-amber-700 font-semibold pt-1">
                    Previsão: {int.estimatedResolution} &bull; {int.notifiedPatientsCount} pacientes
                    alertados
                  </div>
                </div>

                <button
                  onClick={() => resolveInterruption(int.id)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-colors"
                >
                  Resolver
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services Operational Control Matrix */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-bold text-base text-slate-900">Matriz de Disponibilidade de Serviços</h2>
          <span className="text-xs text-slate-500">
            Total: <strong>{services.length} serviços</strong>
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-md">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">{srv.name}</span>
                  {srv.isEmergency && (
                    <span className="bg-red-50 text-red-600 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border border-red-200">
                      24h ER
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{srv.description}</p>
                <div className="text-[11px] text-slate-400 flex items-center gap-3">
                  <span>{srv.locationName}</span>
                  <span>&bull;</span>
                  <span>~{srv.waitTimeMinutes} min esperados</span>
                </div>
              </div>

              {/* Status Action Pills */}
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
                <button
                  onClick={() => updateServiceStatus(srv.id, "operational")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    srv.status === "operational"
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Operacional
                </button>

                <button
                  onClick={() => updateServiceStatus(srv.id, "busy")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    srv.status === "busy"
                      ? "bg-amber-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Alta Demanda
                </button>

                <button
                  onClick={() => updateServiceStatus(srv.id, "interrupted")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    srv.status === "interrupted"
                      ? "bg-red-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Indisponível
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interruption Modal */}
      {showInterruptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Reportar Interrupção Operativa</h3>
              <button
                onClick={() => setShowInterruptionModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInterruptionSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Selecione o Serviço Afetado
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.locationName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Motivo da Interrupção / Manutenção
                </label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: Calibração técnica periódica do equipamento tomógrafo."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gravidade da Interrupção
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="info">Informativa (Sem impacto grave)</option>
                    <option value="warning">Aviso (Capacidade reduzida)</option>
                    <option value="critical">Crítica (Interrupção total)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Previsão de Resolução
                  </label>
                  <input
                    type="text"
                    value={estimatedResolution}
                    onChange={(e) => setEstimatedResolution(e.target.value)}
                    placeholder="Ex: Hoje às 17:30"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInterruptionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 shadow-sm"
                >
                  Publicar Interrupção
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
