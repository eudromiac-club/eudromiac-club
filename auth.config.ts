// Edge-safe config (sin DB, sin bcrypt). La usa el middleware.
import type { NextAuthConfig } from 'next-auth';

const PROTECTED_PREFIXES = ['/admin', '/cuenta', '/catalogo', '/dispensario', '/checkout'];
const ADMIN_PREFIXES = ['/admin'];
const AUTH_ROUTES = ['/login'];

export const authConfig = {
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      session.user.role = (token.role as 'member' | 'admin') ?? 'member';
      session.user.status =
        (token.status as 'pending_kyc' | 'active' | 'suspended' | 'inactive') ?? 'pending_kyc';
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const pathname = nextUrl.pathname;

      if (ADMIN_PREFIXES.some((p) => pathname.startsWith(p))) {
        if (!isLoggedIn) return false;
        return role === 'admin';
      }

      if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
        return isLoggedIn;
      }

      if (AUTH_ROUTES.some((p) => pathname.startsWith(p)) && isLoggedIn) {
        return Response.redirect(new URL('/cuenta', nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
