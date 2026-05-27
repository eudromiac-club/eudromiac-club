// Dirección de envío de un pedido. Se guarda como snapshot jsonb en
// orders.shipping_address (no en la tabla shipping_addresses, que queda
// disponible para una futura agenda de direcciones por socio). Hoy el club
// sólo hace envío a domicilio, así que se pide en cada checkout.

export type ShippingAddress = {
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string | null;
  notes: string | null;
};

export type ShippingField = 'recipientName' | 'phone' | 'street' | 'city' | 'province';
export type ShippingFieldErrors = Partial<Record<ShippingField, string>>;

const REQUIRED: Record<ShippingField, string> = {
  recipientName: 'Ingresá el nombre de quien recibe.',
  phone: 'Ingresá un teléfono de contacto.',
  street: 'Ingresá la calle y el número.',
  city: 'Ingresá la localidad.',
  province: 'Ingresá la provincia.',
};

export function parseShippingForm(
  formData: FormData,
): { ok: true; value: ShippingAddress } | { ok: false; errors: ShippingFieldErrors } {
  const get = (k: string) => String(formData.get(k) ?? '').trim();

  const value: ShippingAddress = {
    recipientName: get('recipientName'),
    phone: get('phone'),
    street: get('street'),
    city: get('city'),
    province: get('province'),
    postalCode: get('postalCode') || null,
    notes: get('notes') || null,
  };

  const errors: ShippingFieldErrors = {};
  for (const field of Object.keys(REQUIRED) as ShippingField[]) {
    if (!value[field]) errors[field] = REQUIRED[field];
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return { ok: true, value };
}

// "Calle 123, Localidad, Provincia, CP" — saltea los vacíos.
export function formatShippingLine(a: ShippingAddress): string {
  return [a.street, a.city, a.province, a.postalCode].filter(Boolean).join(', ');
}
