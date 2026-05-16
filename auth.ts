import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { authConfig } from './auth.config';
import { db } from './lib/db';
import { users } from './lib/db/schema';

const LoginSchema = z.object({
  email: z.email().transform((v) => v.trim().toLowerCase()),
  password: z.string().min(1),
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) {
          console.warn('[auth] payload inválido');
          return null;
        }

        const { email, password } = parsed.data;

        try {
          const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

          if (!user) {
            console.warn('[auth] user no existe:', email);
            return null;
          }
          if (!user.passwordHash) {
            console.warn('[auth] user sin passwordHash:', email);
            return null;
          }

          const valid = await bcrypt.compare(password, user.passwordHash);
          if (!valid) {
            console.warn('[auth] password incorrecta:', email);
            return null;
          }

          if (user.role !== 'admin' && (user.status === 'suspended' || user.status === 'inactive')) {
            console.warn('[auth] cuenta bloqueada:', email, user.status);
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
            role: user.role,
            status: user.status,
          };
        } catch (e) {
          console.error('[auth] error en authorize:', e);
          return null;
        }
      },
    }),
  ],
});
