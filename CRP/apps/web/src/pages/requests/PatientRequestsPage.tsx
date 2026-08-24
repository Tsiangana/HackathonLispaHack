import React, { useState } from "react";
import {
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  PhoneCall,
  User,
  Calendar,
  Filter,
  Check,
  Search,
} from "lucide-react";
import { useProviderStore } from "../../store/useProviderStore";
import { PatientRequest } from "../../types/provider";

export const PatientRequestsPage: React.FC = () => {
  const requests = useProviderStore((s) => s.requests);
  const updateRequestStatus = useProviderStore((s) => s.updateRequestStatus);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = filterStatus === "all" || req.status === filterStatus;
    const matchesSearch =
      req.patientName.toLowerCase().includes(search.toLowerCase()) ||
      req.serviceName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-2xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Fila de Solicitações de Pacientes</h1>
          <p className="text-xs text-slate-500 mt-1">
            Gira os pedidos de agendamento de exames, consultas, dúvidas e triagem de emergência.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 font-bold text-xs border border-teal-200">
            {requests.filter((r) => r.status === "pending").length} pendentes
          </span>
        </div>
      </div>

      {/* Toolbar Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar paciente ou serviço..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "Todas" },
            { id: "pending", label: "Pendentes" },
            { id: "accepted", label: "Aceites" },
            { id: "in_progress", label: "Em Triagem" },
            { id: "completed", label: "Concluídas" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterStatus === f.id
                  ? "bg-slate-900 text-teal-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List Cards */}
      <div className="space-y-3">
        {filteredRequests.map((req) => {
          const isPending = req.status === "pending";
          const isAccepted = req.status === "accepted";
          const isInProgress = req.status === "in_progress";
          const isCompleted = req.status === "completed";

          return (
            <div
              key={req.id}
              className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-slate-300"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">{req.patientName}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      req.priority === "emergency"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : req.priority === "urgent"
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {req.priority.toUpperCase()}
                  </span>

                  <span className="text-[10px] font-mono text-slate-400">ID: {req.id}</span>
                </div>

                <div className="text-xs text-slate-600 font-medium">
                  Serviço Solicitado: <strong>{req.serviceName}</strong> ({req.type})
                </div>

                {req.notes && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1">
                    "{req.notes}"
                  </p>
                )}

                <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                  <span className="flex items-center gap-1">
                    <PhoneCall className="h-3 w-3 text-slate-400" /> {req.patientPhone}
                  </span>
                  <span>&bull;</span>
                  <span>Submetido: {new Date(req.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2">
                {isPending && (
                  <button
                    onClick={() => updateRequestStatus(req.id, "accepted")}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-xs"
                  >
                    <Check className="h-4 w-4" /> Aceitar Pedido
                  </button>
                )}

                {isAccepted && (
                  <button
                    onClick={() => updateRequestStatus(req.id, "completed")}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Marcar Concluído
                  </button>
                )}

                <span
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                    isCompleted
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : isInProgress
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {req.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
