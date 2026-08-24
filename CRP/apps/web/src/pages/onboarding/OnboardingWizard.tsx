import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Building2,
  MapPin,
  PhoneCall,
  Stethoscope,
  Clock,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useProviderStore } from "../../store/useProviderStore";
import { InstitutionType, ServiceCategory } from "../../types/provider";

const STEPS = [
  { id: 1, name: "Conta", desc: "Dados de Acesso" },
  { id: 2, name: "Instituição", desc: "Identificação Legal" },
  { id: 3, name: "Localização", desc: "Endereço & Acesso" },
  { id: 4, name: "Contactos", desc: "Linhas de Apoio" },
  { id: 5, name: "Serviços", desc: "Especialidades" },
  { id: 6, name: "Horários", desc: "Funcionamento" },
  { id: 7, name: "Verificação", desc: "Licença & Validação" },
];

export const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const onboarding = useProviderStore((s) => s.onboarding);
  const setOnboardingStep = useProviderStore((s) => s.setOnboardingStep);
  const updateOnboardingData = useProviderStore((s) => s.updateOnboardingData);
  const completeOnboarding = useProviderStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(onboarding.currentStep || 1);

  // Local Form States
  const [accountEmail, setAccountEmail] = useState(onboarding.account?.email || "admin@hospital.co.ao");
  const [accountName, setAccountName] = useState(onboarding.account?.fullName || "Dra. Patrícia Zau");

  const [instName, setInstName] = useState(onboarding.institution?.name || "Hospital Geral de Luanda");
  const [instLegalName, setInstLegalName] = useState(onboarding.institution?.legalName || "Hospital Geral de Luanda E.P.");
  const [instType, setInstType] = useState<InstitutionType>(onboarding.institution?.type || "hospital");
  const [instCnpj, setInstCnpj] = useState(onboarding.institution?.cnpj || "AO.500.998.112");
  const [instDesc, setInstDesc] = useState(
    onboarding.institution?.description || "Unidade hospitalar de referência dedicada a cuidados de urgência, ambulatório e cirurgia."
  );

  const [locAddress, setLocAddress] = useState(onboarding.location?.address || "Avenida Revolução de Outubro, Nº 142");
  const [locCity, setLocCity] = useState(onboarding.location?.city || "Luanda");
  const [locState, setLocState] = useState(onboarding.location?.state || "Luanda");
  const [locEmergAvailable, setLocEmergAvailable] = useState(true);

  const [phone, setPhone] = useState(onboarding.contacts?.phone || "+244 923 000 111");
  const [emergencyPhone, setEmergencyPhone] = useState(onboarding.contacts?.emergencyPhone || "+244 911 000 000");
  const [email, setEmail] = useState(onboarding.contacts?.email || "urgencia@hospital.co.ao");
  const [website, setWebsite] = useState(onboarding.contacts?.website || "https://hospitalluanda.co.ao");

  const [licenseNumber, setLicenseNumber] = useState(onboarding.verification?.licenseNumber || "MINSA-2024-9981");
  const [docUploaded, setDocUploaded] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(true);

  const handleNext = () => {
    if (step < 7) {
      const nextStep = step + 1;
      setStep(nextStep);
      setOnboardingStep(nextStep);
    } else {
      // Finalize Onboarding
      completeOnboarding();
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      const prevStep = step - 1;
      setStep(prevStep);
      setOnboardingStep(prevStep);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center font-black text-white text-lg">
            SL
          </div>
          <div>
            <span className="font-extrabold text-sm text-slate-100">SaúdeLink Provider</span>
            <span className="text-[10px] text-teal-400 font-bold block">Onboarding da Instituição</span>
          </div>
        </div>

        <button
          onClick={() => {
            updateOnboardingData({ currentStep: step });
            alert("Progresso guardado com sucesso!");
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs text-slate-300 font-semibold border border-slate-700 transition-colors"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Guardar Progresso</span>
        </button>
      </header>

      {/* Progress Stepper Bar */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-4 overflow-x-auto">
        <div className="max-w-4xl mx-auto flex items-center justify-between min-w-[600px]">
          {STEPS.map((s) => {
            const isDone = s.id < step;
            const isCurrent = s.id === step;

            return (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    isDone
                      ? "bg-emerald-500 text-slate-950"
                      : isCurrent
                      ? "bg-teal-500 text-slate-950 ring-4 ring-teal-500/20 font-black"
                      : "bg-slate-800 text-slate-500 border border-slate-700"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-5 w-5" /> : s.id}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-xs font-bold ${
                      isCurrent ? "text-teal-300" : isDone ? "text-slate-200" : "text-slate-500"
                    }`}
                  >
                    {s.name}
                  </span>
                  <span className="text-[10px] text-slate-500">{s.desc}</span>
                </div>

                {s.id < 7 && <div className="h-0.5 w-8 bg-slate-800 mx-2" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 flex justify-center items-center p-6 bg-slate-950">
        <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          {/* Step 1: Account */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-100">1. Conta do Gestor</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Defina os dados de acesso principais da sua instituição no SaúdeLink.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nome Completo do Responsável
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Email Institucional Principal
                  </label>
                  <input
                    type="email"
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Institution */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-100">2. Dados da Instituição</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Identificação pública e jurídica do estabelecimento de saúde.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Nome Público da Instituição
                    </label>
                    <input
                      type="text"
                      value={instName}
                      onChange={(e) => setInstName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Razão Social (Legal)
                    </label>
                    <input
                      type="text"
                      value={instLegalName}
                      onChange={(e) => setInstLegalName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Tipo de Instituição
                    </label>
                    <select
                      value={instType}
                      onChange={(e) => setInstType(e.target.value as InstitutionType)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-teal-300 focus:outline-none focus:border-teal-500"
                    >
                      <option value="hospital">Hospital de Urgência & Geral</option>
                      <option value="clinic">Clínica Médica Especializada</option>
                      <option value="laboratory">Laboratório de Análises</option>
                      <option value="diagnostic_center">Centro de Diagnóstico por Imagem</option>
                      <option value="maternity">Maternidade & Centro Infantil</option>
                      <option value="medical_center">Centro Médico de Ambulatório</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      NIF / CNPJ Fiscal
                    </label>
                    <input
                      type="text"
                      value={instCnpj}
                      onChange={(e) => setInstCnpj(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Descrição Curta para o Paciente
                  </label>
                  <textarea
                    rows={3}
                    value={instDesc}
                    onChange={(e) => setInstDesc(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-100">3. Endereço Principal & Acesso</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Localização física onde os pacientes encontrarão o hospital e entrada de emergência.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Endereço Completo & Rua
                  </label>
                  <input
                    type="text"
                    value={locAddress}
                    onChange={(e) => setLocAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Cidade</label>
                    <input
                      type="text"
                      value={locCity}
                      onChange={(e) => setLocCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Província / Estado</label>
                    <input
                      type="text"
                      value={locState}
                      onChange={(e) => setLocState(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-800/60 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-teal-200">Possui Entrada de Emergência 24h?</span>
                    <p className="text-[11px] text-slate-400">
                      Sinaliza na App do Paciente botão de rotas пряmas de emergência.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={locEmergAvailable}
                    onChange={(e) => setLocEmergAvailable(e.target.checked)}
                    className="h-5 w-5 rounded bg-slate-950 border-slate-700 text-teal-500 focus:ring-teal-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contacts */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-100">4. Contactos & Linhas Diretas</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Números operacionais e hotline de emergência directa para os pacientes.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Telefone Geral de Atendimento
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 text-red-400">
                      Hotline de Emergência 24h
                    </label>
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-red-900/50 text-sm text-slate-100 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Email de Contacto</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Website Oficial</label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Services */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-100">5. Catálogo de Serviços & Especialidades</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Selecione os serviços que a sua instituição presta no ecossistema SaúdeLink.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {[
                  { title: "Pronto Socorro Geral 24h", cat: "emergency", icon: "🚨" },
                  { title: "Radiologia & Imagem", cat: "radiology", icon: "🩻" },
                  { title: "Laboratório de Análises", cat: "laboratory", icon: "🧪" },
                  { title: "Unidade de Terapia Intensiva (UTI)", cat: "icu", icon: "🫀" },
                  { title: "Pediatria Infantil", cat: "pediatrics", icon: "👶" },
                  { title: "Cardiologia & ECG", cat: "cardiology", icon: "❤️" },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-200">
                      {s.icon} {s.title}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      Ativo
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Operating Hours */}
          {step === 6 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-100">6. Horários de Funcionamento</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure a disponibilidade geral de atendimento.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-emerald-300">Atendimento Geral 24 Horas / 7 Dias</span>
                  <p className="text-[11px] text-slate-400">
                    O hospital permanece aberto ininterruptamente para urgências.
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 rounded bg-slate-950 border-slate-700 text-teal-500 focus:ring-teal-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Step 7: Verification */}
          {step === 7 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-100">7. Validação & Licença Sanitária</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Confirme a licença oficial do Ministério da Saúde para obter o selo <strong>Verificado</strong>.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Número do Registo Sanitário / Licença MINSA
                  </label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-dashed border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold text-xs text-slate-200">Licença_Sanitaria_Oficial.pdf</span>
                      <span className="text-[10px] text-slate-500 block">Documento carregado (1.8 MB)</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                    Validado
                  </span>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 pt-2">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-teal-500 focus:ring-teal-500"
                  />
                  Concordo com os Termos de Operação do Ecossistema SaúdeLink.
                </label>
              </div>
            </div>
          )}

          {/* Stepper Control Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                step === 1
                  ? "opacity-40 cursor-not-allowed bg-slate-800 text-slate-500"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-750"
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Anterior</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs hover:opacity-95 transition-all shadow-lg shadow-teal-600/25"
            >
              <span>{step === 7 ? "Concluir & Ir para a Plataforma" : "Próximo Passo"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
