import React, { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  Key,
  Smartphone,
  RefreshCw,
  Save,
  CheckCircle2,
} from "lucide-react";
import { useProviderStore } from "../../store/useProviderStore";

export const SettingsPage: React.FC = () => {
  const resetDemoData = useProviderStore((s) => s.resetDemoData);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [apiKey] = useState("sl_live_8849204910294810294819");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-2xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Configurações & Ecossistema</h1>
          <p className="text-xs text-slate-500 mt-1">
            Preferências de notificação, integração de API com a app móvel e segurança.
          </p>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Notifications & Patient App Sync */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-base text-slate-900">Sincronização & Notificações</h2>
              {savedSuccess && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  ✓ Configurações Salvas!
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-slate-900">
                    Sincronização Automática em Tempo Real com App Paciente
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Transmite qualquer alteração no estado de emergência para os pacientes instantaneamente.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className="h-5 w-5 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-slate-900">Alertas por Email para Pedidos Urgentes</span>
                  <p className="text-[11px] text-slate-500">
                    Receba notificações por email quando um paciente submeter um pedido prioritário.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="h-5 w-5 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs hover:opacity-95 shadow-md transition-all"
              >
                <Save className="h-4 w-4" />
                <span>Guardar Definições</span>
              </button>
            </div>
          </div>

          {/* API Integrations */}
          <div className="rounded-3xl bg-slate-900 text-slate-100 p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Key className="h-5 w-5 text-teal-400" />
              <h2 className="font-bold text-base text-slate-100">Chave de Integração API SaúdeLink</h2>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Chave de API do Provedor (API Key)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={apiKey}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-teal-300"
                />
                <button
                  type="button"
                  onClick={() => alert("Chave copiada para a área de transferência!")}
                  className="px-4 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 shrink-0"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Reset Data Tool */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Restaurar Dados de Demonstração</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Restaura a instituição com os dados iniciais do Hospital Central SaúdeLink, serviços e pedidos de demonstração.
            </p>
            <button
              type="button"
              onClick={() => {
                if (confirm("Deseja restaurar todos os dados de teste da plataforma?")) {
                  resetDemoData();
                  alert("Dados restaurados com sucesso!");
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              <RefreshCw className="h-4 w-4 text-slate-600" />
              <span>Restaurar Demo</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
