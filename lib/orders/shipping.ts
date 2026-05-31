// Dirección de envío de un pedido. Se guarda como snapshot jsonb en
// orders.shipping_address (no en la tabla shipping_addresses, que queda
// disponible para una futura agenda de direcciones por socio). Hoy el club
// sólo hace envío a domicilio, así que se pide en cada checkout.

// Provincias argentinas (24 jurisdicciones) para el desplegable del checkout.
export const AR_PROVINCES = [
  'Ciudad Autónoma de Buenos Aires',
  'Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
] as const;

// Rango horario de entrega preferido.
export type DeliveryWindow = 'morning' | 'afternoon';
export const DELIVERY_WINDOW_LABEL: Record<DeliveryWindow, string> = {
  morning: 'Por la mañana',
  afternoon: 'Por la tarde',
};

export type ShippingAddress = {
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string | null;
  deliveryWindow: DeliveryWindow;
  notes: string | null;
};

export type ShippingField =
  | 'recipientName'
  | 'phone'
  | 'street'
  | 'city'
  | 'province'
  | 'deliveryWindow';
export type ShippingFieldErrors = Partial<Record<ShippingField, string>>;

const REQUIRED: Record<ShippingField, string> = {
  recipientName: 'Ingresá el nombre de quien recibe.',
  phone: 'Ingresá un teléfono de contacto.',
  street: 'Ingresá la calle y el número.',
  city: 'Ingresá la localidad.',
  province: 'Elegí la provincia.',
  deliveryWindow: 'Elegí un rango horario.',
};

export function parseShippingForm(
  formData: FormData,
): { ok: true; value: ShippingAddress } | { ok: false; errors: ShippingFieldErrors } {
  const get = (k: string) => String(formData.get(k) ?? '').trim();

  const rawWindow = get('deliveryWindow');
  const deliveryWindow: DeliveryWindow | '' =
    rawWindow === 'morning' || rawWindow === 'afternoon' ? rawWindow : '';
  const rawProvince = get('province');
  const province = (AR_PROVINCES as readonly string[]).includes(rawProvince) ? rawProvince : '';

  const value: ShippingAddress = {
    recipientName: get('recipientName'),
    phone: get('phone'),
    street: get('street'),
    city: get('city'),
    province,
    postalCode: get('postalCode') || null,
    deliveryWindow: (deliveryWindow || 'morning') as DeliveryWindow,
    notes: get('notes') || null,
  };

  const errors: ShippingFieldErrors = {};
  for (const field of ['recipientName', 'phone', 'street', 'city'] as ShippingField[]) {
    if (!value[field]) errors[field] = REQUIRED[field];
  }
  if (!province) errors.province = REQUIRED.province;
  if (!deliveryWindow) errors.deliveryWindow = REQUIRED.deliveryWindow;
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return { ok: true, value };
}

// "Calle 123, Localidad, Provincia, CP" — saltea los vacíos.
export function formatShippingLine(a: ShippingAddress): string {
  return [a.street, a.city, a.province, a.postalCode].filter(Boolean).join(', ');
}
