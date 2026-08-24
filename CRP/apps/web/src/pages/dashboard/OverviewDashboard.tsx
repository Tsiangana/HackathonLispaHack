import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  Users,
  Eye,
  Clock,
  CheckCircle2,
  Zap,
  Smartphone,
  ChevronRight,
  TrendingUp,
  Megaphone,
  Inbox,
  ShieldCheck,
  Building2,
  Stethoscope,
  Cpu,
} from "lucide-react";
import { useProviderStore } from "../../store/useProviderStore";

export const OverviewDashboard: React.FC = () => {
  const navigate = useNavigate();
  const provider = useProviderStore((s) => s.provider);
  const services = useProviderStore((s) => s.services);
  const interruptions = useProviderStore((s) => s.interruptions);
  const announcements = useProviderStore((s) => s.announcements);
  const requests = useProviderStore((s) => s.requests);
  const telemetry = useProviderStore((s) => s.telemetry);
  const updateServiceStatus = useProviderStore((s) => s.updateServiceStatus);
  const togglePatientPreview = useProviderStore((s) => s.togglePatientPreview);

  const operationalServices = services.filter((s) => s.status === "operational").length;
  const busyServices = services.filter((s) => s.status === "busy").length;
  const interruptedServices = services.filter((s) => s.status === "interrupted").length;
  const activeInterrupts = interruptions.filter((i) => i.status === "active");
  const pendingRequests = requests.filter((r) => r.status === "pending");

  const healthScore = Math.round((operationalServices / (services.length || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-slate-800 p-6 md:p-8 text-slate-100 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold text-xs border border-teal-500/30 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
                Centro de Controlo Operativo
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30 capitalize">
                Plano {provider.plan}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {provider.name}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Disponibilidade dos serviços sincronizada em tempo real com a comunidade de pacientes no SaúdeLink.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={togglePatientPreview}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs shadow-lg hover:opacity-95 transition-all"
            >
              <Smartphone className="h-4 w-4" />
              <span>Ver na App Paciente</span>
            </button>

            <button
              onClick={() => navigate("/operations/status")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
            >
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Gerir Status Operativo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Health Score */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Saúde Operativa</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{healthScore}%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> Excelente
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {operationalServices} de {services.length} serviços operando sem restrições
          </p>
        </div>

        {/* Metric 2: Patient App Views */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Visualizações no App</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Eye className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">4,820</span>
            <span className="text-xs font-semibold text-teal-600 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +18% hoje
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Pacientes que visualizaram a ficha do hospital no SaúdeLink
          </p>
        </div>

        {/* Metric 3: Active Interruptions */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Interrupções Ativas</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{activeInterrupts.length}</span>
            <span className="text-xs font-semibold text-amber-600">
              {interruptedServices} serviços indisponíveis
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Avisos de manutenção ou alta demanda notificados
          </p>
        </div>

        {/* Metric 4: Pending Patient Requests */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Solicitações Pendentes</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Inbox className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{pendingRequests.length}</span>
            <span className="text-xs font-semibold text-indigo-600">Aguardando resposta</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Marcação de exames e triagem de emergência
          </p>
        </div>
      </div>

      {/* Main Grid: Quick Status Switcher & Active Interruptions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Services Quick Status Matrix */}
        <div className="lg:col-span-2 rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Estado de Disponibilidade em Tempo Real</h2>
              <p className="text-xs text-slate-500">
                Altere o status de um serviço para propagar a alteração imediatamente aos pacientes.
              </p>
            </div>

            <button
              onClick={() => navigate("/operations/status")}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              Ver todos <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{srv.name}</span>
                    {srv.isEmergency && (
                      <span className="bg-red-50 text-red-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-red-200">
                        24h ER
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-3">
                    <span>{srv.locationName}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" /> ~{srv.waitTimeMinutes} min espera
                    </span>
                  </div>
                </div>

                {/* Quick Status Pill Switcher */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => updateServiceStatus(srv.id, "operational")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      srv.status === "operational"
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Operacional
                  </button>

                  <button
                    onClick={() => updateServiceStatus(srv.id, "busy")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      srv.status === "busy"
                        ? "bg-amber-500 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Alta Demanda
                  </button>

                  <button
                    onClick={() => updateServiceStatus(srv.id, "interrupted")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      srv.status === "interrupted"
                        ? "bg-red-500 text-white shadow-xs"
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

        {/* Right Col: Active Interruptions & Quick Telemetry Snippet */}
        <div className="space-y-6">
          {/* Active Interruption Panel */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Interrupções em Andamento</h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                {activeInterrupts.length} ativas
              </span>
            </div>

            {activeInterrupts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                <p>Nenhuma interrupção reportada no momento.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeInterrupts.map((int) => (
                  <div
                    key={int.id}
                    className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{int.serviceName}</span>
                      <span className="text-[10px] font-semibold text-amber-700">
                        {int.estimatedResolution}
                      </span>
                    </div>
                    <p className="text-xs text-amber-800">{int.reason}</p>
                    <div className="text-[10px] font-medium text-amber-700 flex items-center justify-between pt-1 border-t border-amber-200/60">
                      <span>{int.notifiedPatientsCount} pacientes informados</span>
                      <span className="underline cursor-pointer" onClick={() => navigate("/operations/status")}>
                        Resolver
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Infrastructure Monitoring Telemetry Widget */}
          <div className="rounded-3xl bg-slate-900 p-6 text-slate-100 border border-slate-800 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-cyan-400" />
                <h3 className="font-bold text-xs text-slate-100">Telemetria & Infraestrutura</h3>
              </div>
              <button
                onClick={() => navigate("/telemetry")}
                className="text-[11px] text-cyan-400 hover:underline font-semibold"
              >
                Ver tudo
              </button>
            </div>

            <div className="space-y-2">
              {telemetry.slice(0, 3).map((item) => (
                <div
                  key={item.systemId}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <span className="text-slate-300 font-medium text-[11px] truncate max-w-[170px]">
                    {item.systemName}
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      item.status === "normal"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : item.status === "warning"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}
                  >
                    {item.metricValue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
