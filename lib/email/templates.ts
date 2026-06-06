import {
  formatShippingLine,
  DELIVERY_WINDOW_LABEL,
  type ShippingAddress,
} from '@/lib/orders/shipping';

// Paleta de marca, en hex porque los clientes de email no entienden variables CSS.
const C = {
  bg: '#100c08',
  card: '#1a140d',
  border: '#2e2418',
  text: '#e9e3d8',
  muted: '#a89c8a',
  brand: '#c89a5b',
};

function appUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? '').replace(/\/+$/, '');
}

function formatArs(cents: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) =>
    c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&quot;',
  );
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:${C.brand};color:#1a120a;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:14px 28px;font-weight:600;">${esc(label)}</a>`;
}

// Wrapper común. `body` ya viene como HTML.
function layout(opts: { preheader: string; heading: string; body: string }): string {
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${C.bg};">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.card};border:1px solid ${C.border};">
        <tr><td style="padding:28px 32px;border-bottom:1px solid ${C.border};">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;letter-spacing:5px;color:${C.text};text-transform:uppercase;">EUDROMIA <span style="color:${C.brand};">CLUB</span></div>
        </td></tr>
        <tr><td style="padding:32px;font-family:Arial,Helvetica,sans-serif;color:${C.text};">
          <h1 style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:500;line-height:1.25;color:${C.text};">${opts.heading}</h1>
          ${opts.body}
        </td></tr>
        <tr><td style="padding:22px 32px;border-top:1px solid ${C.border};font-family:Arial,Helvetica,sans-serif;font-size:11px;color:${C.muted};line-height:1.6;">
          EUDROMIA CLUB · Club cannábico de socios.<br/>
          Recibís este email porque estás registrado como socio. Acceso restringido, mayores de 18.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

const p = (html: string) =>
  `<p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:${C.muted};">${html}</p>`;

// ---------------------------------------------------------------------------
// Socio
// ---------------------------------------------------------------------------

export function welcomeEmail(name: string | null) {
  const hi = name ? `Hola ${esc(name.split(' ')[0])},` : 'Hola,';
  return {
    subject: 'Bienvenido a EUDROMIA CLUB',
    html: layout({
      preheader: 'Tu cuenta fue creada. El próximo paso es validar tu permiso REPROCANN.',
      heading: 'Bienvenido al <span style="color:' + C.brand + ';">club</span>.',
      body:
        p(hi) +
        p('Tu cuenta ya está creada. Para acceder al dispensario y reservar genéticas necesitás <strong style="color:' + C.text + ';">validar tu permiso REPROCANN</strong>.') +
        p('Si todavía no lo tenés, nuestro equipo médico lo gestiona con vos.') +
        `<div style="margin:26px 0;">${button(appUrl() + '/cuenta/reprocann', 'Cargar mi permiso')}</div>`,
    }),
  };
}

export function reprocannApprovedEmail(name: string | null) {
  const hi = name ? `Hola ${esc(name.split(' ')[0])},` : 'Hola,';
  return {
    subject: 'Tu permiso fue aprobado · EUDROMIA CLUB',
    html: layout({
      preheader: 'Tu REPROCANN fue validado. Ya podés comprar en el dispensario.',
      heading: 'Tu permiso fue <span style="color:' + C.brand + ';">aprobado</span>.',
      body:
        p(hi) +
        p('Validamos tu permiso REPROCANN. Tu cuenta ya está <strong style="color:' + C.text + ';">activa</strong> y podés acceder al dispensario.') +
        `<div style="margin:26px 0;">${button(appUrl() + '/dispensario', 'Ir al dispensario')}</div>`,
    }),
  };
}

export function reprocannRejectedEmail(name: string | null, reason?: string | null) {
  const hi = name ? `Hola ${esc(name.split(' ')[0])},` : 'Hola,';
  return {
    subject: 'Sobre tu solicitud · EUDROMIA CLUB',
    html: layout({
      preheader: 'Tu solicitud REPROCANN no pudo ser aprobada.',
      heading: 'Sobre tu <span style="color:' + C.brand + ';">solicitud</span>.',
      body:
        p(hi) +
        p('Revisamos tu solicitud REPROCANN y por ahora no pudimos aprobarla.') +
        (reason
          ? `<div style="margin:0 0 16px;padding:14px 16px;background:${C.bg};border:1px solid ${C.border};font-size:13px;color:${C.text};"><strong style="color:${C.brand};">Motivo:</strong> ${esc(reason)}</div>`
          : '') +
        p('Podés revisar la documentación y volver a enviarla desde tu cuenta.') +
        `<div style="margin:26px 0;">${button(appUrl() + '/cuenta/reprocann', 'Volver a enviar')}</div>`,
    }),
  };
}

export function passwordResetEmail(name: string | null, resetUrl: string) {
  const hi = name ? `Hola ${esc(name.split(' ')[0])},` : 'Hola,';
  return {
    subject: 'Restablecé tu contraseña · EUDROMIA CLUB',
    html: layout({
      preheader: 'Pediste restablecer tu contraseña. El link vence en 1 hora.',
      heading: 'Restablecé tu <span style="color:' + C.brand + ';">contraseña</span>.',
      body:
        p(hi) +
        p('Recibimos un pedido para restablecer la contraseña de tu cuenta. Si fuiste vos, tocá el botón. El link vence en <strong style="color:' + C.text + ';">1 hora</strong> y se puede usar una sola vez.') +
        `<div style="margin:26px 0;">${button(resetUrl, 'Cambiar mi contraseña')}</div>` +
        p('Si no pediste esto, ignorá este email: tu contraseña no cambia.'),
    }),
  };
}

type OrderItemLine = { name: string; quantity: number; unitPriceCents: number };

export function orderConfirmedEmail(opts: {
  name: string | null;
  orderNumber: string | null;
  totalCents: number;
  items: OrderItemLine[];
  shipping: ShippingAddress | null;
  isFree: boolean;
  cashOnDelivery?: boolean;
}) {
  const hi = opts.name ? `Hola ${esc(opts.name.split(' ')[0])},` : 'Hola,';
  const rows = opts.items
    .map(
      (it) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid ${C.border};font-size:13px;color:${C.text};">${esc(it.name)} <span style="color:${C.muted};">· ${it.quantity}g</span></td><td align="right" style="padding:8px 0;border-bottom:1px solid ${C.border};font-size:13px;color:${C.text};">${formatArs(it.unitPriceCents * it.quantity)}</td></tr>`,
    )
    .join('');
  const ship = opts.shipping
    ? p(
        `<strong style="color:${C.text};">Envío a:</strong> ${esc(opts.shipping.recipientName)} — ${esc(formatShippingLine(opts.shipping))}. Tel: ${esc(opts.shipping.phone)}.${
          opts.shipping.deliveryWindow
            ? ` Horario: ${esc(DELIVERY_WINDOW_LABEL[opts.shipping.deliveryWindow] ?? opts.shipping.deliveryWindow)}.`
            : ''
        }`,
      )
    : '';
  return {
    subject: `Pedido confirmado${opts.orderNumber ? ` ${opts.orderNumber}` : ''} · EUDROMIA CLUB`,
    html: layout({
      preheader: `Recibimos tu pedido${opts.orderNumber ? ` ${opts.orderNumber}` : ''}. Lo preparamos y coordinamos el envío.`,
      heading: 'Pedido <span style="color:' + C.brand + ';">confirmado</span>.',
      body:
        p(hi) +
        p(
          opts.cashOnDelivery
            ? 'Recibimos tu pedido. El pago lo coordinamos en efectivo al momento de la entrega.'
            : opts.isFree
              ? 'Recibimos tu pedido y el equipo se pone con la preparación.'
              : 'Tu pago se procesó correctamente y el equipo se pone con la preparación.',
        ) +
        (opts.orderNumber
          ? `<div style="margin:0 0 20px;padding:14px 16px;background:${C.bg};border:1px solid ${C.border};text-align:center;"><div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">Tu número de pedido</div><div style="margin-top:6px;font-family:monospace;font-size:20px;letter-spacing:3px;color:${C.brand};">${esc(opts.orderNumber)}</div></div>`
          : '') +
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">${rows}<tr><td style="padding:12px 0 0;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:${C.muted};">Total</td><td align="right" style="padding:12px 0 0;font-size:16px;color:${C.brand};font-family:Georgia,serif;">${formatArs(opts.totalCents)}</td></tr></table>` +
        ship +
        `<div style="margin:24px 0 0;">${button(appUrl() + '/cuenta/pedidos', 'Ver mi pedido')}</div>`,
    }),
  };
}

export function orderShippedEmail(opts: {
  name: string | null;
  orderNumber: string | null;
  carrierLabel: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
}) {
  const hi = opts.name ? `Hola ${esc(opts.name.split(' ')[0])},` : 'Hola,';
  const trackBlock =
    opts.trackingNumber || opts.carrierLabel
      ? `<div style="margin:0 0 20px;padding:16px;background:${C.bg};border:1px solid ${C.border};">` +
        (opts.carrierLabel
          ? `<div style="font-size:12px;color:${C.muted};">Transportista: <strong style="color:${C.text};">${esc(opts.carrierLabel)}</strong></div>`
          : '') +
        (opts.trackingNumber
          ? `<div style="margin-top:6px;font-size:12px;color:${C.muted};">Seguimiento: <strong style="font-family:monospace;color:${C.text};letter-spacing:1px;">${esc(opts.trackingNumber)}</strong></div>`
          : '') +
        `</div>` +
        (opts.trackingUrl
          ? `<div style="margin:0 0 8px;">${button(opts.trackingUrl, 'Seguir mi envío')}</div>`
          : '')
      : '';
  return {
    subject: `Tu pedido${opts.orderNumber ? ` ${opts.orderNumber}` : ''} está en camino · EUDROMIA CLUB`,
    html: layout({
      preheader: 'Tu pedido fue despachado.',
      heading: 'Tu pedido está en <span style="color:' + C.brand + ';">camino</span>.',
      body:
        p(hi) +
        p(`Despachamos tu pedido${opts.orderNumber ? ` <strong style="color:${C.text};">${esc(opts.orderNumber)}</strong>` : ''}.`) +
        trackBlock,
    }),
  };
}

// ---------------------------------------------------------------------------
// Equipo (avisos internos)
// ---------------------------------------------------------------------------

export function teamReprocannContactEmail(opts: {
  memberName: string;
  memberEmail: string;
  phone: string | null;
}) {
  return {
    subject: '[Interno] Socio sin REPROCANN — contactar',
    html: layout({
      preheader: `${opts.memberName} se registró sin REPROCANN y necesita contacto médico.`,
      heading: 'Socio <span style="color:' + C.brand + ';">sin REPROCANN</span>.',
      body:
        p('Un socio se registró eligiendo <strong style="color:' + C.text + ';">"No tengo REPROCANN"</strong>. Hay que contactarlo para gestionar el permiso.') +
        `<div style="padding:14px 16px;background:${C.bg};border:1px solid ${C.border};font-size:13px;color:${C.text};line-height:1.8;">
          <div><strong style="color:${C.brand};">Nombre:</strong> ${esc(opts.memberName)}</div>
          <div><strong style="color:${C.brand};">Email:</strong> ${esc(opts.memberEmail)}</div>
          <div><strong style="color:${C.brand};">Teléfono:</strong> ${opts.phone ? esc(opts.phone) : '—'}</div>
        </div>` +
        `<div style="margin:24px 0 0;">${button(appUrl() + '/admin/socios', 'Ver en el panel')}</div>`,
    }),
  };
}

export function teamNewOrderEmail(opts: {
  orderNumber: string | null;
  memberName: string | null;
  totalCents: number;
}) {
  return {
    subject: `[Interno] Pedido nuevo${opts.orderNumber ? ` ${opts.orderNumber}` : ''} — por despachar`,
    html: layout({
      preheader: `Entró un pedido nuevo por ${formatArs(opts.totalCents)}.`,
      heading: 'Pedido <span style="color:' + C.brand + ';">por despachar</span>.',
      body:
        p('Entró un pedido nuevo. Está listo para preparar y despachar.') +
        `<div style="padding:14px 16px;background:${C.bg};border:1px solid ${C.border};font-size:13px;color:${C.text};line-height:1.8;">
          <div><strong style="color:${C.brand};">Pedido:</strong> ${opts.orderNumber ? esc(opts.orderNumber) : '—'}</div>
          <div><strong style="color:${C.brand};">Socio:</strong> ${opts.memberName ? esc(opts.memberName) : '—'}</div>
          <div><strong style="color:${C.brand};">Total:</strong> ${formatArs(opts.totalCents)}</div>
        </div>` +
        `<div style="margin:24px 0 0;">${button(appUrl() + '/admin/pedidos', 'Ir a pedidos')}</div>`,
    }),
  };
}

export function teamNewLeadEmail(opts: {
  name: string | null;
  email: string;
  phone: string;
  source: string;
}) {
  return {
    subject: '[Interno] Nuevo interesado — Experiencias',
    html: layout({
      preheader: `${opts.name ?? 'Alguien'} dejó sus datos para recibir más info.`,
      heading: 'Nuevo <span style="color:' + C.brand + ';">interesado</span>.',
      body:
        p('Alguien dejó sus datos pidiendo más información. Contactalo para enviarle lo que necesita.') +
        `<div style="padding:14px 16px;background:${C.bg};border:1px solid ${C.border};font-size:13px;color:${C.text};line-height:1.8;">
          <div><strong style="color:${C.brand};">Nombre:</strong> ${opts.name ? esc(opts.name) : '—'}</div>
          <div><strong style="color:${C.brand};">Email:</strong> ${esc(opts.email)}</div>
          <div><strong style="color:${C.brand};">Teléfono:</strong> ${esc(opts.phone)}</div>
          <div><strong style="color:${C.brand};">Origen:</strong> ${esc(opts.source)}</div>
        </div>` +
        `<div style="margin:24px 0 0;">${button(appUrl() + '/admin/leads', 'Ver interesados')}</div>`,
    }),
  };
}
