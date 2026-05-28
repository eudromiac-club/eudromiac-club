import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  date,
  numeric,
  jsonb,
  primaryKey,
  check,
  uniqueIndex,
  customType,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import type { ShippingAddress } from '@/lib/orders/shipping';

// citext: case-insensitive text. Requiere la extensión CITEXT (creada en la migration).
const citext = customType<{ data: string }>({
  dataType: () => 'citext',
});

export const userRole = pgEnum('user_role', ['member', 'admin']);
export const userStatus = pgEnum('user_status', [
  'pending_kyc',
  'under_review',
  'active',
  'rejected',
  'suspended',
  'inactive',
]);
export const invitationStatus = pgEnum('invitation_status', ['pending', 'redeemed', 'expired', 'revoked']);
export const reprocannStatus = pgEnum('reprocann_status', ['pending_review', 'active', 'expired', 'rejected']);
export const geneticType = pgEnum('genetic_type', ['sativa', 'indica', 'hybrid', 'cbd']);
export const orderStatus = pgEnum('order_status', [
  'pending',
  'paid',
  'cancelled',
  'refunded',
  'shipped',
  'delivered',
]);
export const trackingCarrier = pgEnum('tracking_carrier', [
  'andreani',
  'correo_argentino',
  'via_cargo',
  'propio',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: citext('email').notNull().unique(),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  passwordHash: text('password_hash'),
  name: text('name'),
  role: userRole('role').notNull().default('member'),
  status: userStatus('status').notNull().default('pending_kyc'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

export const invitations = pgTable('invitations', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  code: text('code').notNull().unique(),
  email: citext('email'),
  status: invitationStatus('status').notNull().default('pending'),
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
  redeemedBy: uuid('redeemed_by').references(() => users.id, { onDelete: 'set null' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  redeemedAt: timestamp('redeemed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const patientProfiles = pgTable('patient_profiles', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  fullName: text('full_name').notNull(),
  dni: text('dni').notNull(),
  birthDate: date('birth_date').notNull(),
  phone: text('phone'),
  reprocannNumber: text('reprocann_number').unique(),
  reprocannStatus: reprocannStatus('reprocann_status').notNull().default('pending_review'),
  needsReprocannContact: boolean('needs_reprocann_contact').notNull().default(false),
  reprocannExpiresAt: date('reprocann_expires_at'),
  reprocannDocUrl: text('reprocann_doc_url'),
  monthlyGramsLimit: numeric('monthly_grams_limit', { precision: 5, scale: 2 }),
  doctorName: text('doctor_name'),
  doctorLicense: text('doctor_license'),
  doctorProvince: text('doctor_province'),
  notes: text('notes'),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  verifiedBy: uuid('verified_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const patientStatusHistory = pgTable('patient_status_history', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  fromStatus: text('from_status'),
  toStatus: text('to_status').notNull(),
  reason: text('reason'),
  changedBy: uuid('changed_by').references(() => users.id, { onDelete: 'set null' }),
  changedAt: timestamp('changed_at', { withTimezone: true }).notNull().defaultNow(),
});

export const shippingAddresses = pgTable(
  'shipping_addresses',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    label: text('label'),
    recipientName: text('recipient_name').notNull(),
    street: text('street').notNull(),
    city: text('city').notNull(),
    province: text('province').notNull(),
    postalCode: text('postal_code'),
    notes: text('notes'),
    isDefault: boolean('is_default').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('shipping_addresses_one_default_per_user')
      .on(t.userId)
      .where(sql`${t.isDefault} = true`),
  ],
);

export const genetics = pgTable('genetics', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  type: geneticType('type').notNull(),
  thcPercent: numeric('thc_percent', { precision: 4, scale: 2 }),
  cbdPercent: numeric('cbd_percent', { precision: 4, scale: 2 }),
  priceCents: integer('price_cents').notNull(),
  stock: integer('stock').notNull().default(0),
  maxPerOrderGrams: numeric('max_per_order_grams', { precision: 5, scale: 2 }),
  images: text('images').array().notNull().default(sql`'{}'::text[]`),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const carts = pgTable('carts', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const cartItems = pgTable(
  'cart_items',
  {
    cartId: uuid('cart_id')
      .notNull()
      .references(() => carts.id, { onDelete: 'cascade' }),
    geneticId: uuid('genetic_id')
      .notNull()
      .references(() => genetics.id, { onDelete: 'restrict' }),
    quantity: integer('quantity').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.cartId, t.geneticId] }),
    check('cart_items_quantity_positive', sql`${t.quantity} > 0`),
  ],
);

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text('order_number').unique(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  status: orderStatus('status').notNull().default('pending'),
  subtotalCents: integer('subtotal_cents').notNull().default(0),
  discountCents: integer('discount_cents').notNull().default(0),
  couponCode: text('coupon_code'),
  totalCents: integer('total_cents').notNull(),
  mpPreferenceId: text('mp_preference_id'),
  mpPaymentId: text('mp_payment_id'),
  shippingAddress: jsonb('shipping_address').$type<ShippingAddress>(),
  trackingCarrier: trackingCarrier('tracking_carrier'),
  trackingNumber: text('tracking_number'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  geneticId: uuid('genetic_id')
    .notNull()
    .references(() => genetics.id, { onDelete: 'restrict' }),
  nameSnapshot: text('name_snapshot').notNull(),
  quantity: integer('quantity').notNull(),
  unitPriceCents: integer('unit_price_cents').notNull(),
});

// Favoritos (wishlist) del socio: relación N:N user↔genetic. PK compuesta para
// que no se pueda favoritear dos veces lo mismo.
export const favorites = pgTable(
  'favorites',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    geneticId: uuid('genetic_id')
      .notNull()
      .references(() => genetics.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.geneticId] })],
);
