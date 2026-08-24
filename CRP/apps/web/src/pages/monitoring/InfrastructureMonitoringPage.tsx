import React, { useState } from "react";
import {
  Cpu,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Crown,
  Wifi,
  Database,
  Flame,
  Shield,
  Sliders,
} from "lucide-react";
import { useProviderStore } from "../../store/useProviderStore";

export const InfrastructureMonitoringPage: React.FC = () => {
  const provider = useProviderStore((s) => s.provider);
  const telemetry = useProviderStore((s) => s.telemetry);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl text-slate-100 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5" /> Telemetria em Tempo Real
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30 uppercase">
              Plano {provider.plan}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">Monitorização de Infraestrutura & Telemetria</h1>
          <p className="text-xs text-slate-400">
            Acompanhamento técnico da capacidade de leitos, usina de oxigénio, equipamentos médicos e gateways do ecossistema SaúdeLink.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-md self-start md:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Atualizar Leituras</span>
        </button>
      </div>

      {/* Plan Specific Feature Gating Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-950/60 via-slate-900 to-slate-900 border border-teal-800/50 p-4 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-slate-100">Monitorização no Plano {provider.plan.toUpperCase()}</span>
            <p className="text-[11px] text-slate-400">
              O seu plano inclui telemetria de capacidade, oxigênio e tempo de resposta da API SaúdeLink. Upgrade para Enterprise para integração com sensores IoT.
            </p>
          </div>
        </div>

        {provider.plan !== "enterprise" && (
          <button className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shrink-0 transition-colors">
            Fazer Upgrade para Enterprise
          </button>
        )}
      </div>

      {/* Telemetry Systems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {telemetry.map((item) => {
          const isNormal = item.status === "normal";
          const isWarn = item.status === "warning";
          const isCrit = item.status === "critical";

          return (
            <div
              key={item.systemId}
              className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {item.category}
                </span>

                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    isNormal
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : isWarn
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-red-50 text-red-700 border-red-200 animate-pulse"
                  }`}
                >
                  {isNormal && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                  {isWarn && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                  {isCrit && <AlertTriangle className="h-3 w-3 text-red-500" />}
                  {item.status.toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900">{item.systemName}</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.details}</p>
              </div>

              {/* Progress Health Meter */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-600">Eficiência / Leitura</span>
                  <span
                    className={
                      isNormal ? "text-emerald-600" : isWarn ? "text-amber-600" : "text-red-600"
                    }
                  >
                    {item.metricValue} ({item.healthPercentage}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isNormal ? "bg-emerald-500" : isWarn ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${item.healthPercentage}%` }}
                  />
                </div>
              </div>

              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Última verificação: {item.lastCheck}</span>
                <span className="text-teal-600 font-bold hover:underline cursor-pointer">
                  Diagnóstico
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
