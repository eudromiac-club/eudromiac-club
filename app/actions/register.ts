'use server';

import { eq } from 'drizzle-orm';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

import { db } from '@/lib/db';
import { users, patientProfiles } from '@/lib/db/schema';
import { signIn } from '@/auth';
import { notifyWelcome, notifyTeamReprocannContact } from '@/lib/email/notify';

const RegisterSchema = z
  .object({
    email: z.email({ error: 'Email inválido.' }).transform((v) => v.trim().toLowerCase()),
    password: z
      .string()
      .min(8, { error: 'La contraseña tiene que tener al menos 8 caracteres.' })
      .max(200),
    firstName: z.string().trim().min(1, { error: 'Ingresá tu nombre.' }).max(80),
    lastName: z.string().trim().min(1, { error: 'Ingresá tu apellido.' }).max(80),
    dni: z
      .string()
      .trim()
      .regex(/^\d{6,10}$/, { error: 'DNI inválido (solo números, 6-10 dígitos).' }),
    phone: z.string().trim().min(6, { error: 'Ingresá un teléfono válido.' }).max(40),
    birthDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'Fecha de nacimiento inválida.' })
      .refine(
        (s) => {
          const d = new Date(s + 'T00:00:00Z');
          if (Number.isNaN(d.getTime())) return false;
          const today = new Date();
          const age = today.getUTCFullYear() - d.getUTCFullYear() -
            (today.getUTCMonth() < d.getUTCMonth() ||
            (today.getUTCMonth() === d.getUTCMonth() && today.getUTCDate() < d.getUTCDate())
              ? 1
              : 0);
          return age >= 18 && age < 120;
        },
        { error: 'Tenés que ser mayor de 18 años.' },
      ),
    reprocannNumber: z.string().trim().max(60).optional().default(''),
    noReprocann: z.boolean().default(false),
    acceptTerms: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.noReprocann && data.reprocannNumber.trim().length < 3) {
      ctx.addIssue({
        code: 'custom',
        path: ['reprocannNumber'],
        message: 'Ingresá el número de trámite REPROCANN.',
      });
    }
    if (!data.acceptTerms) {
      ctx.addIssue({
        code: 'custom',
        path: ['acceptTerms'],
        message: 'Tenés que aceptar los Términos y la Política de Privacidad.',
      });
    }
  });

// Valores tipeados que devolvemos en el state para repoblar el form si la
// validación falla. React 19 resetea el form tras cada server action, así que
// sin esto se borraría todo lo que el socio ya cargó. La contraseña NO se
// devuelve (no se espeja por seguridad; ese campo sí se vuelve a tipear).
export type RegisterValues = {
  email: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  birthDate: string;
  reprocannNumber: string;
  noReprocann: boolean;
  acceptTerms: boolean;
};

export type RegisterState =
  | undefined
  | { ok: true }
  | {
      ok: false;
      values?: RegisterValues;
      errors?: Partial<Record<
        | 'email'
        | 'password'
        | 'firstName'
        | 'lastName'
        | 'dni'
        | 'phone'
        | 'birthDate'
        | 'reprocannNumber'
        | 'acceptTerms'
        | 'form',
        string[]
      >>;
    };

export async function registerAction(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const values: RegisterValues = {
    email: String(formData.get('email') ?? ''),
    firstName: String(formData.get('firstName') ?? ''),
    lastName: String(formData.get('lastName') ?? ''),
    dni: String(formData.get('dni') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    birthDate: String(formData.get('birthDate') ?? ''),
    reprocannNumber: String(formData.get('reprocannNumber') ?? ''),
    noReprocann: formData.get('noReprocann') === 'on',
    acceptTerms: formData.get('acceptTerms') === 'on',
  };

  const parsed = RegisterSchema.safeParse({
    email: values.email,
    password: formData.get('password'),
    firstName: values.firstName,
    lastName: values.lastName,
    dni: values.dni,
    phone: values.phone,
    birthDate: values.birthDate,
    reprocannNumber: values.reprocannNumber,
    noReprocann: values.noReprocann,
    acceptTerms: values.acceptTerms,
  });

  if (!parsed.success) {
    return { ok: false, values, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const d = parsed.data;
  const fullName = `${d.firstName} ${d.lastName}`.trim();
  const reprocannNumber = d.noReprocann ? null : d.reprocannNumber.trim();

  try {
    await db.transaction(async (tx) => {
      const [existing] = await tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, d.email))
        .limit(1);
      if (existing) throw new RegisterError('email', 'Ya existe una cuenta con ese email.');

      if (reprocannNumber) {
        const [existingReprocann] = await tx
          .select({ userId: patientProfiles.userId })
          .from(patientProfiles)
          .where(eq(patientProfiles.reprocannNumber, reprocannNumber))
          .limit(1);
        if (existingReprocann) {
          throw new RegisterError(
            'reprocannNumber',
            'Ese número de trámite REPROCANN ya está registrado.',
          );
        }
      }

      const passwordHash = await bcrypt.hash(d.password, 10);

      const [created] = await tx
        .insert(users)
        .values({
          email: d.email,
          name: fullName,
          passwordHash,
          role: 'member',
          status: 'pending_kyc',
        })
        .returning({ id: users.id });

      await tx.insert(patientProfiles).values({
        userId: created.id,
        fullName,
        dni: d.dni,
        birthDate: d.birthDate,
        phone: d.phone,
        reprocannNumber,
        reprocannStatus: 'pending_review',
        needsReprocannContact: d.noReprocann,
      });
    });
  } catch (e) {
    if (e instanceof RegisterError) {
      return { ok: false, values, errors: { [e.field]: [e.message] } };
    }
    console.error('[register] error inesperado:', e);
    return {
      ok: false,
      values,
      errors: { form: ['No pudimos crear tu cuenta. Probá de nuevo en un rato.'] },
    };
  }

  // Emails (best-effort: notify atrapa sus errores). El de bienvenida va al
  // socio; si se registró sin REPROCANN, avisamos al equipo para contactarlo.
  await notifyWelcome(d.email, fullName);
  if (d.noReprocann) {
    await notifyTeamReprocannContact({
      memberName: fullName,
      memberEmail: d.email,
      phone: d.phone,
    });
  }

  try {
    await signIn('credentials', { email: d.email, password: d.password, redirectTo: '/cuenta' });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        ok: false,
        values,
        errors: {
          form: [
            'Cuenta creada, pero no pudimos iniciar tu sesión. Probá entrar desde /login.',
          ],
        },
      };
    }
    throw error;
  }
}

class RegisterError extends Error {
  field:
    | 'email'
    | 'password'
    | 'firstName'
    | 'lastName'
    | 'dni'
    | 'phone'
    | 'birthDate'
    | 'reprocannNumber'
    | 'form';
  constructor(field: RegisterError['field'], message: string) {
    super(message);
    this.field = field;
    this.name = 'RegisterError';
  }
}
