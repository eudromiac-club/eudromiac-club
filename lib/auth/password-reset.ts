import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { and, eq, isNull } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';
import { users, passwordResetTokens } from '@/lib/db/schema';

// El link de recuperación vive 1 hora.
const TOKEN_TTL_MS = 60 * 60 * 1000;

// Guardamos el hash del token, nunca el token en claro (defensa ante fuga de DB).
function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

// Crea un token de recuperación para el email dado. Devuelve el token EN CLARO
// (para el link del email) + datos del usuario, o null si no hay cuenta con ese
// email. Antes invalida cualquier token previo sin usar del mismo usuario, así
// solo hay un link vivo a la vez.
export async function createPasswordResetToken(
  email: string,
): Promise<{ token: string; user: { id: string; email: string; name: string | null } } | null> {
  const [user] = await db
    .select({ id: users.id, email: users.email, name: users.name })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (!user) return null;

  await db
    .delete(passwordResetTokens)
    .where(and(eq(passwordResetTokens.userId, user.id), isNull(passwordResetTokens.usedAt)));

  const token = randomBytes(32).toString('hex');
  await db.insert(passwordResetTokens).values({
    userId: user.id,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
  });

  return { token, user };
}

// Devuelve la fila del token si es válido (existe, no usado, no vencido), o null.
export async function findValidResetToken(token: string) {
  if (!token) return null;
  const [row] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.tokenHash, hashToken(token)))
    .limit(1);
  if (!row) return null;
  if (row.usedAt) return null;
  if (row.expiresAt.getTime() < Date.now()) return null;
  return row;
}

// Cambia la contraseña usando el token. Revalida el token (no confiar en que la
// página ya lo chequeó), marca el token como usado y borra los demás del usuario.
// Devuelve false si el token ya no sirve.
export async function resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
  const row = await findValidResetToken(token);
  if (!row) return false;

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, row.userId));
    await tx
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, row.id));
    // Limpiar cualquier otro token sin usar del mismo usuario.
    await tx
      .delete(passwordResetTokens)
      .where(
        and(eq(passwordResetTokens.userId, row.userId), isNull(passwordResetTokens.usedAt)),
      );
  });
  return true;
}
