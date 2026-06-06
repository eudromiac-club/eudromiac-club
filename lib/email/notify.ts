import 'server-only';
import { sendEmail, teamEmail } from './client';
import {
  welcomeEmail,
  passwordResetEmail,
  reprocannApprovedEmail,
  reprocannRejectedEmail,
  orderConfirmedEmail,
  orderShippedEmail,
  teamReprocannContactEmail,
  teamNewOrderEmail,
  teamNewLeadEmail,
} from './templates';
import { carrierLabel, trackingUrl } from '@/lib/orders/carriers';
import type { ShippingAddress } from '@/lib/orders/shipping';

// Cada función arma su template y delega en sendEmail (que ya atrapa errores y
// no rompe nada si Resend falla o no está configurado).

export async function notifyWelcome(to: string, name: string | null): Promise<void> {
  const t = welcomeEmail(name);
  await sendEmail({ to, subject: t.subject, html: t.html });
}

export async function notifyPasswordReset(
  to: string,
  name: string | null,
  resetUrl: string,
): Promise<void> {
  const t = passwordResetEmail(name, resetUrl);
  await sendEmail({ to, subject: t.subject, html: t.html });
}

export async function notifyReprocannApproved(to: string, name: string | null): Promise<void> {
  const t = reprocannApprovedEmail(name);
  await sendEmail({ to, subject: t.subject, html: t.html });
}

export async function notifyReprocannRejected(
  to: string,
  name: string | null,
  reason?: string | null,
): Promise<void> {
  const t = reprocannRejectedEmail(name, reason);
  await sendEmail({ to, subject: t.subject, html: t.html });
}

export async function notifyOrderConfirmed(opts: {
  to: string;
  name: string | null;
  orderNumber: string | null;
  totalCents: number;
  items: { name: string; quantity: number; unitPriceCents: number }[];
  shipping: ShippingAddress | null;
  isFree: boolean;
  cashOnDelivery?: boolean;
}): Promise<void> {
  const t = orderConfirmedEmail(opts);
  await sendEmail({ to: opts.to, subject: t.subject, html: t.html });
}

export async function notifyOrderShipped(opts: {
  to: string;
  name: string | null;
  orderNumber: string | null;
  carrier: string | null;
  trackingNumber: string | null;
}): Promise<void> {
  const t = orderShippedEmail({
    name: opts.name,
    orderNumber: opts.orderNumber,
    carrierLabel: carrierLabel(opts.carrier),
    trackingNumber: opts.trackingNumber,
    trackingUrl: trackingUrl(opts.carrier, opts.trackingNumber),
  });
  await sendEmail({ to: opts.to, subject: t.subject, html: t.html });
}

export async function notifyTeamReprocannContact(opts: {
  memberName: string;
  memberEmail: string;
  phone: string | null;
}): Promise<void> {
  const to = teamEmail();
  if (!to) return;
  const t = teamReprocannContactEmail(opts);
  await sendEmail({ to, subject: t.subject, html: t.html });
}

export async function notifyTeamNewOrder(opts: {
  orderNumber: string | null;
  memberName: string | null;
  totalCents: number;
}): Promise<void> {
  const to = teamEmail();
  if (!to) return;
  const t = teamNewOrderEmail(opts);
  await sendEmail({ to, subject: t.subject, html: t.html });
}

export async function notifyTeamNewLead(opts: {
  name: string | null;
  email: string;
  phone: string;
  source: string;
}): Promise<void> {
  const to = teamEmail();
  if (!to) return;
  const t = teamNewLeadEmail(opts);
  await sendEmail({ to, subject: t.subject, html: t.html });
}
