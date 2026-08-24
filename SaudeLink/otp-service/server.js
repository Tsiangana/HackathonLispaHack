require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 4012;

app.use(cors());
app.use(express.json());

// In-memory OTP storage map: email -> { code, expiresAt, attempts }
const otpStore = new Map();

// Transporter configuration for Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

// Helper to generate a 6-digit numeric OTP code
function generate6DigitOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Clean up expired OTPs periodically every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (data.expiresAt < now) {
      otpStore.delete(email);
    }
  }
}, 5 * 60 * 1000);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SaúdeLink OTP Microservice',
    timestamp: new Date().toISOString(),
  });
});

// Send 6-digit OTP endpoint
app.post('/api/otp/send', async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Endereço de email inválido.',
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const code = generate6DigitOtp();
  const expiresAt = Date.now() + 10 * 60 * 1000; // Code valid for 10 minutes

  otpStore.set(cleanEmail, {
    code,
    expiresAt,
    attempts: 0,
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || '"SaúdeLink" <no-reply@saudelink.ao>',
    to: cleanEmail,
    subject: `${code} é o teu código de verificação - SaúdeLink`,
    html: `
      <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 30px; background-color: #FAFAF8; border-radius: 20px; color: #1E293B;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #D9232E; margin: 0; font-size: 26px; font-weight: 800;">SaúdeLink</h2>
          <p style="color: #64748B; margin-top: 4px; font-size: 14px;">Cuidados de saúde ao alcance de todos</p>
        </div>

        <div style="background: #FFFFFF; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #E2E8F0; text-align: center;">
          <h3 style="margin-top: 0; color: #0F172A; font-size: 18px;">O teu código de verificação</h3>
          <p style="color: #475569; font-size: 14px; margin-bottom: 20px;">Utiliza o código abaixo para concluir a tua autenticação no SaúdeLink:</p>

          <div style="background-color: #FEF2F2; border: 2px dashed #D9232E; border-radius: 12px; padding: 16px; display: inline-block; letter-spacing: 8px; font-size: 32px; font-weight: 800; color: #D9232E; margin-bottom: 16px;">
            ${code}
          </div>

          <p style="color: #94A3B8; font-size: 12px; margin: 0;">Este código é válido por 10 minutos. Nunca partilhes este código com ninguém.</p>
        </div>

        <div style="text-align: center; margin-top: 24px; color: #94A3B8; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} SaúdeLink. Todos os direitos reservados.</p>
        </div>
      </div>
    `,
  };

  try {
    if (process.env.SMTP_USER) {
      await transporter.sendMail(mailOptions);
      console.log(`[OTP Sent] Email: ${cleanEmail} | Code: ${code}`);
    } else {
      console.log(`[OTP Generated (SMTP Mock)] Email: ${cleanEmail} | Code: ${code}`);
    }

    return res.json({
      success: true,
      message: 'Código de verificação enviado para o teu email.',
    });
  } catch (error) {
    console.error('Erro ao enviar email de OTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao enviar email de verificação. Tenta novamente.',
    });
  }
});

// Verify 6-digit OTP endpoint
app.post('/api/otp/verify', (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({
      success: false,
      message: 'Email e código são obrigatórios.',
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = code.trim();
  const record = otpStore.get(cleanEmail);

  if (!record) {
    return res.status(400).json({
      success: false,
      message: 'Nenhum código solicitado para este email ou código expirado.',
    });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanEmail);
    return res.status(400).json({
      success: false,
      message: 'O código de verificação expirou. Solicita um novo código.',
    });
  }

  record.attempts += 1;

  if (record.attempts > 5) {
    otpStore.delete(cleanEmail);
    return res.status(429).json({
      success: false,
      message: 'Excedido o número máximo de tentativas. Solicita um novo código.',
    });
  }

  if (record.code !== cleanCode) {
    return res.status(400).json({
      success: false,
      message: 'Código de verificação incorreto.',
    });
  }

  // OTP verified successfully -> remove code from store
  otpStore.delete(cleanEmail);

  return res.json({
    success: true,
    message: 'Código verificado com sucesso.',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SaúdeLink OTP Microservice running on port ${PORT}`);
});
