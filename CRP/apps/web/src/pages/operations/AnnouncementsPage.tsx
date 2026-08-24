import React, { useState } from "react";
import { Megaphone, Plus, Trash2, Eye, Calendar, Sparkles, X, Smartphone } from "lucide-react";
import { useProviderStore } from "../../store/useProviderStore";

export const AnnouncementsPage: React.FC = () => {
  const announcements = useProviderStore((s) => s.announcements);
  const createAnnouncement = useProviderStore((s) => s.createAnnouncement);
  const deleteAnnouncement = useProviderStore((s) => s.deleteAnnouncement);
  const togglePatientPreview = useProviderStore((s) => s.togglePatientPreview);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"general" | "urgent" | "maintenance" | "event">("general");
  const [targetAudience, setTargetAudience] = useState<"all" | "patients" | "emergency_only">("all");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    createAnnouncement({
      title,
      content,
      type,
      targetAudience,
      status: "published",
    });

    setTitle("");
    setContent("");
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-2xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Avisos ao Paciente & Comunicados</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publique comunicados informativos, campanhas de saúde ou alertas de emergência visíveis no SaúdeLink.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePatientPreview}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-teal-300 font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            <Smartphone className="h-4 w-4" /> Ver no App Paciente
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs hover:opacity-95 transition-all shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>Criar Novo Aviso</span>
          </button>
        </div>
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((anc) => (
          <div
            key={anc.id}
            className="rounded-3xl bg-white border border-slate-200 p-6 shadow-2xs space-y-3 relative flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border ${
                    anc.type === "urgent"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : anc.type === "maintenance"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-teal-50 text-teal-700 border-teal-200"
                  }`}
                >
                  {anc.type}
                </span>

                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(anc.publishedAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900">{anc.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{anc.content}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-slate-600 font-semibold">
                <Eye className="h-3.5 w-3.5 text-slate-400" /> {anc.viewsCount} visualizações
              </span>

              <button
                onClick={() => deleteAnnouncement(anc.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Eliminar Aviso"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Publicar Novo Aviso aos Pacientes</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título do Aviso</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Campanha Urgente de Doação de Sangue O-"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Conteúdo da Mensagem
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escreva as instruções ou detalhes da campanha para os pacientes..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Aviso</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="general">Geral (Informativo)</option>
                    <option value="urgent">Urgente (Emergência)</option>
                    <option value="maintenance">Manutenção de Serviço</option>
                    <option value="event">Campanha / Evento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Público Alvo</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="all">Todos os Pacientes</option>
                    <option value="patients">Consultas Agendadas</option>
                    <option value="emergency_only">Apenas Pronto Socorro</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs hover:opacity-95 shadow-sm"
                >
                  Publicar Imediatamente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
