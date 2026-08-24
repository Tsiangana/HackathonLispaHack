import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Stethoscope,
  Activity,
  Megaphone,
  Inbox,
  BarChart3,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  ChevronLeft,
  Crown,
  Radio,
  Cpu,
  UserCheck,
} from "lucide-react";
import { useProviderStore } from "../../store/useProviderStore";
import { UserRole } from "../../types/provider";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const provider = useProviderStore((s) => s.provider);
  const user = useProviderStore((s) => s.user);
  const setRole = useProviderStore((s) => s.setRole);
  const logout = useProviderStore((s) => s.logout);
  const requests = useProviderStore((s) => s.requests);
  const interruptions = useProviderStore((s) => s.interruptions);

  const [hospitalOpen, setHospitalOpen] = useState(
    location.pathname.startsWith("/hospital")
  );
  const [operationsOpen, setOperationsOpen] = useState(
    location.pathname.startsWith("/operations") || location.pathname.startsWith("/services")
  );

  const pendingRequestsCount = requests.filter((r) => r.status === "pending").length;
  const activeInterruptionsCount = interruptions.filter((i) => i.status === "active").length;

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as UserRole);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`relative flex flex-col bg-slate-900 border-r border-slate-800 text-slate-200 transition-all duration-300 z-30 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-cyan-400 text-white font-black text-xl shadow-lg shadow-teal-500/20">
            S
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-slate-100 tracking-tight leading-none">
                SaúdeLink
              </span>
              <span className="text-[10px] font-bold tracking-wider text-teal-400 uppercase mt-0.5">
                Provider Hub
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors"
          title={isCollapsed ? "Expandir Menu" : "Recolher Menu"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Institution Info Card */}
      {!isCollapsed && (
        <div className="p-3 mx-3 my-3 rounded-xl bg-slate-850 border border-slate-800/80 bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            {provider.logoUrl ? (
              <img
                src={provider.logoUrl}
                alt={provider.name}
                className="h-9 w-9 rounded-lg object-cover border border-slate-700 shrink-0"
              />
            ) : (
              <div className="h-9 w-9 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold shrink-0">
                <Building2 className="h-5 w-5" />
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-bold text-xs text-slate-100 truncate">{provider.name}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {provider.verificationStatus === "verified" ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" />
                    Verificado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400">
                    <ShieldAlert className="h-3 w-3 text-amber-400" />
                    Pendente
                  </span>
                )}
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {provider.plan}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {/* Overview */}
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
            isActive("/dashboard")
              ? "bg-teal-600 text-white font-semibold shadow-md shadow-teal-600/20"
              : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
          }`}
          title="Visão Geral"
        >
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Visão Geral</span>}
        </Link>

        {/* Hospital Group */}
        <div>
          {isCollapsed ? (
            <Link
              to="/hospital/profile"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                location.pathname.startsWith("/hospital")
                  ? "bg-teal-600 text-white"
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
              }`}
              title="Hospital"
            >
              <Building2 className="h-5 w-5 shrink-0" />
            </Link>
          ) : (
            <div>
              <button
                onClick={() => setHospitalOpen(!hospitalOpen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  location.pathname.startsWith("/hospital")
                    ? "text-slate-100 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 shrink-0" />
                  <span>Hospital</span>
                </div>
                {hospitalOpen ? (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                )}
              </button>

              {hospitalOpen && (
                <div className="ml-8 mt-1 space-y-1 border-l border-slate-800 pl-3">
                  <Link
                    to="/hospital/profile"
                    className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive("/hospital/profile")
                        ? "text-teal-400 font-bold bg-teal-500/10"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Perfil da Instituição
                  </Link>
                  <Link
                    to="/hospital/locations"
                    className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive("/hospital/locations")
                        ? "text-teal-400 font-bold bg-teal-500/10"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Unidades & Campus
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Services & Operations */}
        <div>
          {isCollapsed ? (
            <Link
              to="/services"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                location.pathname.startsWith("/services")
                  ? "bg-teal-600 text-white"
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
              }`}
              title="Serviços & Operações"
            >
              <Stethoscope className="h-5 w-5 shrink-0" />
            </Link>
          ) : (
            <div>
              <button
                onClick={() => setOperationsOpen(!operationsOpen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  location.pathname.startsWith("/services") ||
                  location.pathname.startsWith("/operations")
                    ? "text-slate-100 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Stethoscope className="h-5 w-5 shrink-0" />
                  <span>Serviços & Operações</span>
                </div>
                {operationsOpen ? (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                )}
              </button>

              {operationsOpen && (
                <div className="ml-8 mt-1 space-y-1 border-l border-slate-800 pl-3">
                  <Link
                    to="/services"
                    className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive("/services")
                        ? "text-teal-400 font-bold bg-teal-500/10"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Catálogo de Serviços
                  </Link>
                  <Link
                    to="/operations/status"
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive("/operations/status")
                        ? "text-teal-400 font-bold bg-teal-500/10"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>Status Operativo 24h</span>
                    {activeInterruptionsCount > 0 && (
                      <span className="h-4 px-1.5 flex items-center justify-center rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                        {activeInterruptionsCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/operations/announcements"
                    className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive("/operations/announcements")
                        ? "text-teal-400 font-bold bg-teal-500/10"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Avisos ao Paciente
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Requests Queue */}
        <Link
          to="/requests"
          className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
            isActive("/requests")
              ? "bg-teal-600 text-white font-semibold shadow-md shadow-teal-600/20"
              : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
          }`}
          title="Solicitações"
        >
          <div className="flex items-center gap-3">
            <Inbox className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Solicitações</span>}
          </div>
          {pendingRequestsCount > 0 && (
            <span
              className={`flex h-5 items-center justify-center rounded-full px-2 text-xs font-bold ${
                isActive("/requests")
                  ? "bg-white text-teal-700"
                  : "bg-teal-500/20 text-teal-300 border border-teal-500/40"
              }`}
            >
              {pendingRequestsCount}
            </span>
          )}
        </Link>

        {/* Infrastructure & Telemetry Monitoring */}
        <Link
          to="/telemetry"
          className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
            isActive("/telemetry")
              ? "bg-teal-600 text-white font-semibold shadow-md shadow-teal-600/20"
              : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
          }`}
          title="Monitorização de Infraestrutura"
        >
          <div className="flex items-center gap-3">
            <Cpu className="h-5 w-5 shrink-0 text-cyan-400" />
            {!isCollapsed && <span>Monitorização Infra</span>}
          </div>
          {!isCollapsed && (
            <span className="text-[9px] font-bold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
              Telemetry
            </span>
          )}
        </Link>

        {/* Analytics */}
        <Link
          to="/analytics"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
            isActive("/analytics")
              ? "bg-teal-600 text-white font-semibold shadow-md shadow-teal-600/20"
              : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
          }`}
          title="Métricas & Desempenho"
        >
          <BarChart3 className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Métricas & Métricas</span>}
        </Link>

        {/* Team RBAC */}
        <Link
          to="/team"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
            isActive("/team")
              ? "bg-teal-600 text-white font-semibold shadow-md shadow-teal-600/20"
              : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
          }`}
          title="Equipa & Permissões"
        >
          <Users className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Equipa & Permissões</span>}
        </Link>

        {/* Settings */}
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
            isActive("/settings")
              ? "bg-teal-600 text-white font-semibold shadow-md shadow-teal-600/20"
              : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
          }`}
          title="Configurações"
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Configurações</span>}
        </Link>
      </nav>

      {/* Role Switcher Demo Tool & User Profile Footer */}
      {!isCollapsed && (
        <div className="p-3 mx-3 mb-2 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span className="flex items-center gap-1 text-slate-300">
              <UserCheck className="h-3.5 w-3.5 text-teal-400" />
              Perfil RBAC Activo:
            </span>
          </div>
          <select
            value={user.role}
            onChange={handleRoleChange}
            className="w-full bg-slate-900 border border-slate-700 text-teal-300 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
          >
            <option value="owner">Owner (Acesso Total)</option>
            <option value="admin">Administrator (Gestão Geral)</option>
            <option value="operations">Operations Manager (Serviços & Status)</option>
            <option value="staff">Staff (Leitura & Suporte)</option>
          </select>
        </div>
      )}

      {/* User Footer */}
      <div className="p-3 border-t border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover border border-slate-700 shrink-0"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
              {user.name.charAt(0)}
            </div>
          )}
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-slate-200 truncate">{user.name}</span>
              <span className="text-[10px] text-slate-400 truncate capitalize">{user.role}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
          title="Sair da Conta"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
};
