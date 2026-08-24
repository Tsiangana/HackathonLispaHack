import React from "react";
import {
  X,
  ShieldCheck,
  PhoneCall,
  MapPin,
  Clock,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Share2,
  ChevronRight,
  Sparkles,
  Smartphone,
  Navigation,
  Activity,
} from "lucide-react";
import { useProviderStore } from "../../store/useProviderStore";

export const PatientAppPreviewDrawer: React.FC = () => {
  const isPatientPreviewOpen = useProviderStore((s) => s.isPatientPreviewOpen);
  const setPatientPreviewOpen = useProviderStore((s) => s.setPatientPreviewOpen);
  const provider = useProviderStore((s) => s.provider);
  const locations = useProviderStore((s) => s.locations);
  const services = useProviderStore((s) => s.services);
  const announcements = useProviderStore((s) => s.announcements);
  const interruptions = useProviderStore((s) => s.interruptions);

  if (!isPatientPreviewOpen) return null;

  const mainLocation = locations.find((l) => l.isMain) || locations[0];
  const activeAnnouncements = announcements.filter((a) => a.status === "published");
  const activeInterrupt = interruptions.filter((i) => i.status === "active");

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-all duration-300">
      {/* Backdrop click to close */}
      <div
        className="flex-1 cursor-pointer"
        onClick={() => setPatientPreviewOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative flex h-full w-full max-w-lg flex-col bg-slate-900 text-slate-100 shadow-2xl border-l border-slate-800 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">Visão do Paciente</h3>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Sincronizado
                </span>
              </div>
              <p className="text-xs text-slate-400">Simulação da App SaúdeLink para Pacientes</p>
            </div>
          </div>

          <button
            onClick={() => setPatientPreviewOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live sync highlight note */}
        <div className="bg-teal-950/50 border-b border-teal-800/40 px-6 py-2.5 flex items-center gap-2 text-xs text-teal-300">
          <Sparkles className="h-4 w-4 text-teal-400 shrink-0" />
          <span>
            Qualquer alteração de disponibilidade feita no Provider Web é atualizada <strong>instantaneamente</strong> para os pacientes.
          </span>
        </div>

        {/* Phone Frame Simulator */}
        <div className="flex-1 overflow-y-auto p-6 flex justify-center bg-slate-950/80">
          <div className="relative w-full max-w-[370px] rounded-[40px] border-[8px] border-slate-800 bg-slate-900 shadow-2xl overflow-hidden text-slate-900 flex flex-col min-h-[640px] max-h-[720px]">
            {/* Phone Notch */}
            <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 flex justify-center items-center z-30">
              <div className="w-24 h-4 bg-slate-900 rounded-b-xl flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800" />
              </div>
            </div>

            {/* Mobile Header Bar */}
            <div className="pt-7 px-4 pb-3 bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-white/20 flex items-center justify-center text-xs font-black">
                  SL
                </div>
                <span className="font-black text-sm tracking-wide">SaúdeLink</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 rounded-full bg-white/10 hover:bg-white/20">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="p-1 rounded-full bg-white/10 hover:bg-white/20">
                  <Bell className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mobile App Body Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50 text-slate-800 p-3 space-y-3 font-sans text-xs">
              {/* Institution Header Card */}
              <div className="rounded-2xl bg-white p-3.5 shadow-sm border border-slate-100 relative">
                {provider.bannerUrl && (
                  <div className="h-20 -mx-3.5 -mt-3.5 mb-3 overflow-hidden rounded-t-2xl relative">
                    <img
                      src={provider.bannerUrl}
                      alt={provider.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    <div className="absolute bottom-2 left-3 text-white font-bold text-sm">
                      {provider.name}
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    {!provider.bannerUrl && (
                      <h4 className="font-extrabold text-sm text-slate-900">{provider.name}</h4>
                    )}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 border border-teal-200 capitalize">
                        {provider.type.replace("_", " ")}
                      </span>
                      {provider.verificationStatus === "verified" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 fill-emerald-100" />
                          Verificado
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 font-bold text-amber-500 text-xs">
                      ★ {provider.rating || 4.9}
                      <span className="text-[10px] font-normal text-slate-400">
                        ({provider.reviewCount || 428})
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {provider.description}
                </p>

                {mainLocation && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-slate-700 truncate max-w-[200px]">
                      <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                      {mainLocation.address}, {mainLocation.city}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-teal-700 shrink-0">
                      <Navigation className="h-3 w-3" />
                      Rotas
                    </span>
                  </div>
                )}
              </div>

              {/* Active Emergency / Alert Banner */}
              {activeInterrupt.length > 0 && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-amber-900 space-y-1 animate-pulse">
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    <span>Aviso de Operação em Andamento</span>
                  </div>
                  <p className="text-[10px] text-amber-800 leading-snug">
                    {activeInterrupt[0].serviceName}: {activeInterrupt[0].reason}
                  </p>
                </div>
              )}

              {/* Patient Announcements */}
              {activeAnnouncements.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="font-bold text-[11px] text-slate-700">Avisos à Comunidade</span>
                    <span className="text-[10px] text-teal-600 font-semibold">Ver todos</span>
                  </div>
                  {activeAnnouncements.slice(0, 2).map((anc) => (
                    <div
                      key={anc.id}
                      className="rounded-xl bg-teal-500/10 border border-teal-200 p-2.5 text-slate-800 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-teal-900">{anc.title}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded">
                          {anc.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600 line-clamp-2 leading-relaxed">
                        {anc.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Live Services & Availability Section */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="font-bold text-[11px] text-slate-700">
                    Especialidades & Disponibilidade Real
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                    <Activity className="h-3 w-3" />
                    Tempo Real
                  </span>
                </div>

                <div className="space-y-1.5">
                  {services.map((srv) => {
                    const isOp = srv.status === "operational";
                    const isBusy = srv.status === "busy";
                    const isInterrupted = srv.status === "interrupted";

                    return (
                      <div
                        key={srv.id}
                        className="rounded-xl bg-white border border-slate-200/80 p-2.5 shadow-2xs flex items-center justify-between transition-all hover:border-slate-300"
                      >
                        <div className="space-y-0.5 max-w-[65%]">
                          <div className="font-semibold text-slate-900 text-[11px] flex items-center gap-1.5">
                            {srv.name}
                            {srv.isEmergency && (
                              <span className="bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                                24h ER
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-2">
                            {srv.waitTimeMinutes > 0 && (
                              <span className="flex items-center gap-0.5 text-slate-600 font-medium">
                                <Clock className="h-3 w-3 text-slate-400" /> ~{srv.waitTimeMinutes} min esperados
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          {isOp && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Operacional
                            </span>
                          )}
                          {isBusy && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700 border border-amber-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              Alta Demanda
                            </span>
                          )}
                          {isInterrupted && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold text-red-700 border border-red-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                              Indisponível
                            </span>
                          )}
                          {srv.status === "closed" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600 border border-slate-300">
                              Fechado
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Quick Call & Request CTA */}
              <div className="pt-2">
                <button className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 py-2.5 font-bold text-white shadow-md flex items-center justify-center gap-2 hover:opacity-95 text-xs">
                  <PhoneCall className="h-3.5 w-3.5" />
                  Ligar para Emergência / Central
                </button>
              </div>
            </div>

            {/* Mobile Bottom Navigation Bar Simulation */}
            <div className="h-12 bg-white border-t border-slate-200 flex items-center justify-around text-[10px] font-semibold text-slate-500">
              <div className="flex flex-col items-center text-teal-600">
                <Activity className="h-4 w-4" />
                <span>Início</span>
              </div>
              <div className="flex flex-col items-center">
                <Navigation className="h-4 w-4" />
                <span>Mapa</span>
              </div>
              <div className="flex flex-col items-center">
                <Bell className="h-4 w-4" />
                <span>Alertas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-800 px-6 py-3 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
          <span>SaúdeLink Mobile App Simulator v2.4</span>
          <button
            onClick={() => setPatientPreviewOpen(false)}
            className="text-teal-400 hover:underline font-semibold"
          >
            Fechar Pré-visualização
          </button>
        </div>
      </div>
    </div>
  );
};
