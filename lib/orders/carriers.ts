// Transportistas de envío + armado del link de seguimiento.
//
// OJO: los deep-links de tracking de cada correo no están documentados de forma
// estable. Estos son los mejores formatos conocidos a mayo 2026. Si al hacer un
// envío real el link no cae en el seguimiento puntual (cae en el buscador), se
// ajusta SOLO acá y queda arreglado en toda la app y los emails.

type CarrierDef = {
  label: string;
  track: (code: string) => string | null;
};

export const CARRIERS = {
  andreani: {
    label: 'Andreani',
    track: (c) => `https://seguimiento.andreani.com/envio/${encodeURIComponent(c)}`,
  },
  correo_argentino: {
    label: 'Correo Argentino',
    track: (c) => `https://www.correoargentino.com.ar/formularios/e-commerce?id=${encodeURIComponent(c)}`,
  },
  via_cargo: {
    label: 'Vía Cargo',
    track: (c) => `https://formularios.viacargo.com.ar/seguimiento-envio?guia=${encodeURIComponent(c)}`,
  },
  propio: {
    label: 'Envío propio',
    track: () => null, // sin seguimiento web; el "número" es una referencia interna
  },
} satisfies Record<string, CarrierDef>;

export type CarrierKey = keyof typeof CARRIERS;
export const CARRIER_KEYS = Object.keys(CARRIERS) as CarrierKey[];

export function isCarrierKey(v: unknown): v is CarrierKey {
  return typeof v === 'string' && v in CARRIERS;
}

export function carrierLabel(key: string | null | undefined): string | null {
  if (!key) return null;
  return (CARRIERS as Record<string, CarrierDef>)[key]?.label ?? key;
}

export function trackingUrl(
  key: string | null | undefined,
  code: string | null | undefined,
): string | null {
  if (!key || !code) return null;
  return (CARRIERS as Record<string, CarrierDef>)[key]?.track(code) ?? null;
}
