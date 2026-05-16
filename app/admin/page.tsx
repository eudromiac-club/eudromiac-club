import Link from 'next/link';
import { count, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, invitations, genetics } from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getCounts() {
  const [[active], [pendingKyc], [pendingInv], [activeGenetics]] = await Promise.all([
    db.select({ n: count() }).from(users).where(eq(users.status, 'active')),
    db.select({ n: count() }).from(users).where(eq(users.status, 'pending_kyc')),
    db.select({ n: count() }).from(invitations).where(eq(invitations.status, 'pending')),
    db.select({ n: count() }).from(genetics).where(eq(genetics.active, true)),
  ]);

  return {
    activeMembers: active?.n ?? 0,
    pendingKyc: pendingKyc?.n ?? 0,
    pendingInvitations: pendingInv?.n ?? 0,
    activeGenetics: activeGenetics?.n ?? 0,
  };
}

export default async function AdminIndexPage() {
  const c = await getCounts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Panel</h1>
        <p className="text-sm text-muted-foreground">Resumen del club.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Socios activos</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{c.activeMembers}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes KYC</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{c.pendingKyc}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Invitaciones abiertas</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{c.pendingInvitations}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Genéticas activas</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{c.activeGenetics}</CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Link
          href="/admin/invitations"
          className="rounded-md border bg-card px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Gestionar invitaciones →
        </Link>
      </div>
    </div>
  );
}
