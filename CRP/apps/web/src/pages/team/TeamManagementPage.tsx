import React, { useState } from "react";
import { Users, Plus, ShieldCheck, Mail, UserCheck, Trash2, X, Lock } from "lucide-react";
import { useProviderStore } from "../../store/useProviderStore";
import { UserRole } from "../../types/provider";

export const TeamManagementPage: React.FC = () => {
  const team = useProviderStore((s) => s.team);
  const addTeamMember = useProviderStore((s) => s.addTeamMember);
  const removeTeamMember = useProviderStore((s) => s.removeTeamMember);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState<UserRole>("operations");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addTeamMember({
      name,
      email,
      department: department || "Operações Médicas",
      role,
      status: "invited",
    });

    setName("");
    setEmail("");
    setDepartment("");
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-2xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Gestão da Equipa & Controlo de Acessos (RBAC)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Adicione médicos, gestores de operações e recepcionistas com permissões baseadas em papéis.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs hover:opacity-95 transition-all shadow-md self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Convidar Membro para a Equipa</span>
        </button>
      </div>

      {/* Team Members List */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-2xs space-y-4">
        <h2 className="font-bold text-base text-slate-900">Membros Ativos & Convites Pendentes</h2>

        <div className="divide-y divide-slate-100">
          {team.map((member) => (
            <div key={member.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-teal-500/10 text-teal-600 font-bold flex items-center justify-center text-sm shrink-0">
                    {member.name.charAt(0)}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{member.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        member.role === "owner"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : member.role === "admin"
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          : member.role === "operations"
                          ? "bg-teal-50 text-teal-700 border border-teal-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{member.email} &bull; {member.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400">Atividade: {member.lastActive}</span>
                {member.role !== "owner" && (
                  <button
                    onClick={() => removeTeamMember(member.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Remover Membro"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RBAC Permission Reference Table */}
      <div className="rounded-3xl bg-slate-900 text-slate-100 p-6 border border-slate-800 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <Lock className="h-4 w-4 text-teal-400" /> Matriz de Permissões por Papel (RBAC)
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-2">Papel / Função</th>
                <th className="pb-2">Gerir Perfil</th>
                <th className="pb-2">Alterar Status 24h</th>
                <th className="pb-2">Avisos ao Paciente</th>
                <th className="pb-2">Gerir Equipa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-2.5 font-bold text-purple-400">Owner</td>
                <td className="py-2.5 text-emerald-400">✓ Total</td>
                <td className="py-2.5 text-emerald-400">✓ Total</td>
                <td className="py-2.5 text-emerald-400">✓ Total</td>
                <td className="py-2.5 text-emerald-400">✓ Total</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-indigo-400">Administrator</td>
                <td className="py-2.5 text-emerald-400">✓ Sim</td>
                <td className="py-2.5 text-emerald-400">✓ Sim</td>
                <td className="py-2.5 text-emerald-400">✓ Sim</td>
                <td className="py-2.5 text-emerald-400">✓ Sim</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-teal-400">Operations Manager</td>
                <td className="py-2.5 text-slate-500">Apenas Leitura</td>
                <td className="py-2.5 text-emerald-400">✓ Sim</td>
                <td className="py-2.5 text-emerald-400">✓ Sim</td>
                <td className="py-2.5 text-slate-500">Sem Acesso</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-400">Staff / Recepção</td>
                <td className="py-2.5 text-slate-500">Sem Acesso</td>
                <td className="py-2.5 text-slate-500">Apenas Leitura</td>
                <td className="py-2.5 text-slate-500">Apenas Leitura</td>
                <td className="py-2.5 text-slate-500">Sem Acesso</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Invite */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Convidar Membro para o Hospital</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Enf. Marcos Ribeiro"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Institucional</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@hospital.co.ao"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Departamento</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Ex: Triagem"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Papel (Role RBAC)</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="admin">Administrator</option>
                    <option value="operations">Operations Manager</option>
                    <option value="staff">Staff / Recepção</option>
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
                  Enviar Convite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
