import React from "react";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Users,
  Clock,
  ArrowUpRight,
  Download,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useProviderStore } from "../../store/useProviderStore";

export const AnalyticsPage: React.FC = () => {
  const provider = useProviderStore((s) => s.provider);
  const services = useProviderStore((s) => s.services);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-2xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Métricas & Desempenho de Presença</h1>
          <p className="text-xs text-slate-500 mt-1">
            Análise de buscas dos pacientes, visualizações da ficha do hospital e demanda por serviços.
          </p>
        </div>

        <button
          onClick={() => alert("Relatório em PDF gerado com sucesso!")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-teal-300 font-bold text-xs hover:bg-slate-800 transition-colors self-start md:self-auto"
        >
          <Download className="h-4 w-4" />
          <span>Exportar Relatório em PDF</span>
        </button>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-500">Impressões nas Procuras</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">14,290</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="h-3.5 w-3.5" /> +24%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Aparições nos resultados de busca do SaúdeLink</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-500">Cliques no Perfil</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">4,820</span>
            <span className="text-xs font-bold text-teal-600 flex items-center">
              <TrendingUp className="h-3.5 w-3.5" /> +18%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Pacientes que abriram o perfil completo do hospital</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-500">Cliques em "Ligar Agora"</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">1,240</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="h-3.5 w-3.5" /> +12%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Ligações diretas para a central/hotline do hospital</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-500">Navegações GPS Iniciadas</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">890</span>
            <span className="text-xs font-bold text-indigo-600 flex items-center">
              <TrendingUp className="h-3.5 w-3.5" /> +30%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Rotas traçadas pelo paciente em direção ao hospital</p>
        </div>
      </div>

      {/* Demand & Traffic Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Serviços Mais Procurados</h3>
          <div className="space-y-3">
            {services.map((srv, idx) => (
              <div key={srv.id} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{srv.name}</span>
                  <span>{95 - idx * 12}% de procura</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${95 - idx * 12}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900 text-slate-100 p-6 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-100">Picos de Horário de Procura dos Pacientes</h3>
          <div className="h-44 flex items-end justify-between gap-2 pt-4">
            {[35, 48, 85, 95, 60, 40, 75, 90, 55, 30].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div
                  className="w-full bg-gradient-to-t from-teal-600 to-emerald-400 rounded-t-lg transition-all"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[9px] text-slate-400 font-mono">{i * 2 + 6}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
