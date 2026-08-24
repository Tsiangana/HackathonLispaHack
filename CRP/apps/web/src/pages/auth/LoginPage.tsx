import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Stethoscope,
  Activity,
} from "lucide-react";
import { useProviderStore } from "../../store/useProviderStore";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useProviderStore((s) => s.login);

  const [email, setEmail] = useState("contato@hospitalsaudelink.co.ao");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, "owner");
    navigate("/dashboard");
  };

  const handleQuickLogin = (role: "owner" | "operations") => {
    login("contato@hospitalsaudelink.co.ao", role);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glow Decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card Container */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-slate-100 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-cyan-400 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-teal-500/20 mb-3">
            SL
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">SaúdeLink Provider</h1>
          <p className="text-xs text-slate-400 mt-1">
            Plataforma Operativa de Gestão de Hospitais & Unidades de Saúde
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Email Institucional
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@hospital.co.ao"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300">Palavra-passe</label>
              <Link
                to="/auth/forgot-password"
                className="text-xs font-semibold text-teal-400 hover:underline"
              >
                Esqueceu a palavra-passe?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs py-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-teal-500 focus:ring-teal-500"
              />
              Lembrar credenciais
            </label>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Conexão Segura
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2"
          >
            <span>Aceder à Plataforma</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Quick Demo Access Buttons */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-2">
          <p className="text-[11px] font-semibold text-slate-400 text-center mb-2">
            ⚡ Acesso Rápido para Demonstração:
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin("owner")}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700/80 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Building2 className="h-3.5 w-3.5 text-teal-400" />
              <span>Dra. Patrícia (Owner)</span>
            </button>

            <button
              onClick={() => handleQuickLogin("operations")}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700/80 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Activity className="h-3.5 w-3.5 text-cyan-400" />
              <span>Gestor Operativo</span>
            </button>
          </div>
        </div>

        {/* Register Redirect Footer */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Ainda não registou a sua instituição?{" "}
          <Link to="/auth/register" className="font-bold text-teal-400 hover:underline">
            Registar Novo Hospital
          </Link>
        </div>
      </div>

      <div className="mt-6 text-center text-[11px] text-slate-500">
        &copy; 2026 SaúdeLink Ecosystem &bull; Conectando Provedores de Saúde a Pacientes
      </div>
    </div>
  );
};
