import NextAuth from 'next-auth';
import type { NextRequest } from 'next/server';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

export function proxy(request: NextRequest) {
  return auth(request as unknown as Parameters<typeof auth>[0]);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|woff2)).*)'],
};
