import { supabase } from '@/lib/supabase';

const CUSTOM_OTP_URL = process.env.EXPO_PUBLIC_OTP_SERVICE_URL;

export type OtpResult = {
  success: boolean;
  message?: string;
};

/**
  * Translate Supabase or network error messages into Portuguese
  */
function translateAuthError(errorMsg?: string): string {
  if (!errorMsg) return 'Ocorreu um erro inesperado. Tenta novamente.';

  const msg = errorMsg.toLowerCase();
  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'Muitas tentativas enviadas. Por favor aguarda alguns segundos antes de tentar novamente.';
  }
  if (msg.includes('invalid') || msg.includes('expired') || msg.includes('token')) {
    return 'Código de verificação inválido ou expirado. Confirma o código e tenta novamente.';
  }
  if (msg.includes('user not found')) {
    return 'Utilizador não encontrado. Verifica o email introduzido.';
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return 'Erro de ligação à rede. Verifica a tua ligação à Internet.';
  }

  return errorMsg;
}

export async function sendOtpCode(email: string): Promise<OtpResult> {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return {
      success: false,
      message: 'Por favor introduz um endereço de email válido.',
    };
  }

  try {
    if (CUSTOM_OTP_URL) {
      const response = await fetch(`${CUSTOM_OTP_URL}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return {
          success: false,
          message: translateAuthError(data.message || 'Falha ao enviar código OTP.'),
        };
      }
      return { success: true, message: 'Código de 6 dígitos enviado para o teu email.' };
    }

    // Default Supabase Auth OTP (with shouldCreateUser so it supports signup & login via 6-digit OTP code)
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      return {
        success: false,
        message: translateAuthError(error.message),
      };
    }

    return { success: true, message: 'Código de 6 dígitos enviado com sucesso!' };
  } catch (err: any) {
    return {
      success: false,
      message: translateAuthError(err?.message),
    };
  }
}

export async function verifyOtpCode(email: string, code: string): Promise<OtpResult> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = code.trim();

  if (cleanCode.length !== 6) {
    return {
      success: false,
      message: 'Por favor introduz um código de 6 dígitos completo.',
    };
  }

  try {
    if (CUSTOM_OTP_URL) {
      const response = await fetch(`${CUSTOM_OTP_URL}/api/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, code: cleanCode }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return {
          success: false,
          message: translateAuthError(data.message || 'Código de verificação incorreto.'),
        };
      }
      return { success: true };
    }

    const { error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanCode,
      type: 'email',
    });

    if (error) {
      return {
        success: false,
        message: translateAuthError(error.message),
      };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      message: translateAuthError(err?.message),
    };
  }
}
