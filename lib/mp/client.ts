import 'server-only';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

function getToken(): string | null {
  return process.env.MP_ACCESS_TOKEN ?? null;
}

export function mpConfigured(): boolean {
  return !!getToken();
}

function client(): MercadoPagoConfig {
  const token = getToken();
  if (!token) {
    throw new Error('MP_ACCESS_TOKEN no está configurado.');
  }
  return new MercadoPagoConfig({ accessToken: token });
}

export function mpPreference(): Preference {
  return new Preference(client());
}

export function mpPayment(): Payment {
  return new Payment(client());
}
