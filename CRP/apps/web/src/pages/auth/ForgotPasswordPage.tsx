import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-slate-100 relative z-10">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 mb-4 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao Login
        </Link>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">Instruções Enviadas!</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enviamos um ligação de recuperação de palavra-passe para <strong>{email}</strong>. Por favor, verifique a sua caixa de entrada.
            </p>
            <Link
              to="/auth/login"
              className="inline-block mt-4 w-full py-2.5 rounded-xl bg-slate-800 text-teal-300 font-bold text-xs hover:bg-slate-750 transition-colors"
            >
              Regressar à Página de Autenticação
            </Link>
          </div>
        ) : (
          <div>
            <h1 className="text-xl font-black text-slate-100 mb-1">Recuperar Palavra-passe</h1>
            <p className="text-xs text-slate-400 mb-6">
              Insira o email associado à sua instituição para receber as instruções.
            </p>

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
                    placeholder="contato@hospital.co.ao"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-teal-600/25"
              >
                Enviar Ligação de Recuperação
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
