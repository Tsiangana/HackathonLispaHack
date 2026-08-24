import React, { useState } from "react";
import {
  Building2,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Save,
  Crown,
  Edit,
  ExternalLink,
  Smartphone,
} from "lucide-react";
import { useProviderStore } from "../../store/useProviderStore";

export const HospitalProfilePage: React.FC = () => {
  const provider = useProviderStore((s) => s.provider);
  const updateProvider = useProviderStore((s) => s.updateProvider);
  const togglePatientPreview = useProviderStore((s) => s.togglePatientPreview);

  const [name, setName] = useState(provider.name);
  const [legalName, setLegalName] = useState(provider.legalName || "");
  const [description, setDescription] = useState(provider.description || "");
  const [phone, setPhone] = useState(provider.phone || "");
  const [emergencyPhone, setEmergencyPhone] = useState(provider.emergencyPhone || "");
  const [email, setEmail] = useState(provider.email || "");
  const [website, setWebsite] = useState(provider.website || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProvider({
      name,
      legalName,
      description,
      phone,
      emergencyPhone,
      email,
      website,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-2xs">
        <div className="flex items-center gap-4">
          {provider.logoUrl ? (
            <img
              src={provider.logoUrl}
              alt={provider.name}
              className="h-16 w-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
          ) : (
            <div className="h-16 w-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 flex items-center justify-center font-bold text-2xl">
              <Building2 className="h-8 w-8" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">{provider.name}</h1>
              {provider.verificationStatus === "verified" && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Instituição Verificada
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {provider.legalName} &bull; NIF: {provider.cnpj || "AO.504.992.112"}
            </p>
          </div>
        </div>

        <button
          onClick={togglePatientPreview}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-teal-300 text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm self-start md:self-auto"
        >
          <Smartphone className="h-4 w-4" />
          <span>Pré-visualizar Perfil no App</span>
        </button>
      </div>

      {/* Main Form & Subscription Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Editable Profile Details */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-base text-slate-900">Informações Públicas do Hospital</h2>
              {savedSuccess && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  ✓ Alterações Guardadas!
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome da Instituição (Exibido aos Pacientes)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Razão Social (Nome Legal)
                </label>
                <input
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descrição Pública da Instituição
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telefone Geral de Atendimento
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 text-red-600">
                    Hotline de Emergência 24h
                  </label>
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-red-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Institucional
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Website</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs hover:opacity-95 shadow-md transition-all"
              >
                <Save className="h-4 w-4" />
                <span>Guardar Alterações do Perfil</span>
              </button>
            </div>
          </div>
        </form>

        {/* Right Col: Subscription Plan & Verification Card */}
        <div className="space-y-6">
          {/* Subscription Tier Card */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border border-slate-800 p-6 text-slate-100 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-400" />
                <span className="font-bold text-sm">Plano de Subscrição</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-extrabold text-[10px] uppercase border border-teal-500/30">
                {provider.plan}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              O seu plano <strong>Professional</strong> permite atualizações ilimitadas em tempo real, gestão de disponibilidade, avisos ao paciente e métricas avançadas.
            </p>

            <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-slate-300">
                <span>Gestão de Unidades:</span>
                <span className="font-bold text-white">Até 5 Unidades</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Membros da Equipa:</span>
                <span className="font-bold text-white">Até 15 Usuários</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Sincronização Patient App:</span>
                <span className="font-bold text-emerald-400">Instantânea (0s)</span>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors">
              Gerir Subscrição & Upgrade
            </button>
          </div>

          {/* Legal Verification Status */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <span>Selo de Verificação Sanitária</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sua instituição possui selo verificado com base no alvará sanitário emitido pelo Ministério da Saúde.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700 font-mono space-y-1">
              <div>Licença: MINSA-LU-2024-8842</div>
              <div>Validade: 31/12/2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
