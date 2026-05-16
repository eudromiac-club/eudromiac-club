import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/dal';
import { logoutAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Admin · eudromiac club',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-dvh">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-sm font-semibold tracking-tight">
              Admin · eudromiac
            </Link>
            <nav className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/admin/invitations" className="hover:text-foreground">
                Invitaciones
              </Link>
              <span className="opacity-50">Socios</span>
              <span className="opacity-50">Genéticas</span>
            </nav>
          </div>
          <form action={logoutAction} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{admin.email}</span>
            <Button type="submit" variant="outline" size="sm">
              Salir
            </Button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
