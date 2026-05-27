import 'server-only';
import { Resend } from 'resend';

// Mismo patrón que mpConfigured(): si no hay RESEND_API_KEY, los emails se
// loguean y NO se mandan. Así nada del flujo (registro, pedidos, webhook) se
// rompe por falta de config o por un fallo de Resend.

function getApiKey(): string | null {
  return process.env.RESEND_API_KEY ?? null;
}

export function emailConfigured(): boolean {
  return !!getApiKey();
}

// Remitente. En modo prueba de Resend usar el default; con dominio propio
// verificado, setear EMAIL_FROM (ej. "EUDROMIA CLUB <hola@tudominio>").
function from(): string {
  return process.env.EMAIL_FROM ?? 'EUDROMIA CLUB <onboarding@resend.dev>';
}

// Destinatario de los avisos internos al equipo.
export function teamEmail(): string | null {
  return process.env.TEAM_EMAIL ?? process.env.ADMIN_EMAIL ?? null;
}

let cached: Resend | null = null;
function client(): Resend {
  if (!cached) cached = new Resend(getApiKey() as string);
  return cached;
}

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  if (!emailConfigured()) {
    console.info('[email] RESEND_API_KEY ausente — no se envía:', opts.subject, '→', opts.to);
    return;
  }
  try {
    const { error } = await client().emails.send({
      from: from(),
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo ?? process.env.EMAIL_REPLY_TO,
    });
    if (error) {
      console.error('[email] Resend devolvió error:', error, '→', opts.subject);
    }
  } catch (e) {
    // Nunca propagar: un email caído no debe romper el registro ni un pedido.
    console.error('[email] excepción enviando:', e, '→', opts.subject);
  }
}
