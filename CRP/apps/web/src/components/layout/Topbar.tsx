import React, { useState } from "react";
import {
  Search,
  Bell,
  Smartphone,
  ShieldCheck,
  Zap,
  Activity,
  AlertTriangle,
  ChevronDown,
  CheckCircle2,
  Building,
} from "lucide-react";
import { useProviderStore } from "../../store/useProviderStore";
import { useNavigate } from "react-router-dom";

export const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const provider = useProviderStore((s) => s.provider);
  const user = useProviderStore((s) => s.user);
  const isPatientPreviewOpen = useProviderStore((s) => s.isPatientPreviewOpen);
  const togglePatientPreview = useProviderStore((s) => s.togglePatientPreview);
  const interruptions = useProviderStore((s) => s.interruptions);
  const requests = useProviderStore((s) => s.requests);

  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const activeInterruptCount = interruptions.filter((i) => i.status === "active").length;
  const pendingRequestsCount = requests.filter((r) => r.status === "pending").length;
  const totalNotifications = activeInterruptCount + pendingRequestsCount;

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      {/* Left: Global Search & Context */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar serviço, pedido de paciente ou aviso..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100/80 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Action Toolbar */}
      <div className="flex items-center gap-3">
        {/* Verification Status Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <ShieldCheck className="h-4 w-4 text-emerald-600 fill-emerald-100" />
          <span>{provider.name}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Quick Status Update Shortcut */}
        <button
          onClick={() => navigate("/operations/status")}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-all shadow-2xs"
        >
          <Zap className="h-4 w-4 text-teal-600 fill-teal-200" />
          <span>Alterar Disponibilidade</span>
        </button>

        {/* Patient App Live Preview Toggle */}
        <button
          onClick={togglePatientPreview}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-all shadow-sm ${
            isPatientPreviewOpen
              ? "bg-slate-900 text-teal-300 ring-2 ring-teal-500"
              : "bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:opacity-95"
          }`}
        >
          <Smartphone className="h-4 w-4" />
          <span className="hidden md:inline">Ver na App Paciente</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                {totalNotifications}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">Notificações Operativas</span>
                <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                  {totalNotifications} novas
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {activeInterruptCount > 0 && (
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      navigate("/operations/status");
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex items-start gap-2.5"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {activeInterruptCount} Interrupção(ões) Activa(s)
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Serviços marcados com tempo de espera elevado ou manutenção.
                      </p>
                    </div>
                  </div>
                )}

                {pendingRequestsCount > 0 && (
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      navigate("/requests");
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex items-start gap-2.5"
                  >
                    <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700 shrink-0">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {pendingRequestsCount} Pedidos de Paciente Pendentes
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Exames, consultas e triagem aguardando confirmação.
                      </p>
                    </div>
                  </div>
                )}

                {totalNotifications === 0 && (
                  <div className="p-6 text-center text-xs text-slate-500">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                    Tudo em dia! Sem alertas operacionais no momento.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
