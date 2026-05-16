// Endpoint temporal de diagnóstico de conexión a la DB.
// Gateado por header X-Diag-Token === DIAG_TOKEN (env). Borrar cuando login funcione.
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const token = req.headers.get('x-diag-token');
  if (!process.env.DIAG_TOKEN || token !== process.env.DIAG_TOKEN) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const urlSet = !!process.env.DATABASE_URL;
  const urlHasSsl = (process.env.DATABASE_URL ?? '').includes('sslmode=');
  const urlHost = (process.env.DATABASE_URL ?? '').match(/@([^/]+)/)?.[1] ?? null;

  try {
    const v = await db.execute(sql`select version() as v`);
    const c = await db.select({ count: sql<number>`count(*)::int` }).from(users);
    return NextResponse.json({
      ok: true,
      url_set: urlSet,
      url_has_sslmode: urlHasSsl,
      url_host: urlHost,
      pg_version: (v as unknown as { rows: { v: string }[] }).rows?.[0]?.v ?? null,
      users_count: c[0]?.count ?? 0,
    });
  } catch (e) {
    const err = e as Error & { code?: string; severity?: string };
    return NextResponse.json(
      {
        ok: false,
        url_set: urlSet,
        url_has_sslmode: urlHasSsl,
        url_host: urlHost,
        error_name: err.name,
        error_message: err.message,
        error_code: err.code,
        error_severity: err.severity,
      },
      { status: 500 },
    );
  }
}
